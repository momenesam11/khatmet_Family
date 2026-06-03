create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'family_owner' check (role in ('super_admin', 'family_owner')),
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  active boolean not null default false,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'submitted', 'paid', 'rejected')),
  members_limit int not null default 30,
  current_start_page integer not null default 1,
  current_round integer not null default 1,
  khatmas_completed integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  phone text,
  level text not null default 'صفحة يوميًا',
  access_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  type text not null default 'توزيع بالصفحات',
  method text not null default 'توزيع تلقائي',
  start_date date not null default current_date,
  end_date date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  reading_text text not null,
  due_date date not null default current_date,
  status text not null default 'assigned' check (status in ('assigned', 'done', 'excused')),
  note text,
  end_page integer,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references public.families(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  method text,
  reference text,
  receipt_url text,
  note text,
  rejection_reason text,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'approved', 'rejected')),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

create or replace function public.owns_family(p_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.families
    where id = p_family_id
      and owner_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.members enable row level security;
alter table public.plans enable row level security;
alter table public.assignments enable row level security;
alter table public.payments enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_super_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_super_admin())
with check (id = auth.uid() or public.is_super_admin());

drop policy if exists "families_all_owner_or_admin" on public.families;
create policy "families_all_owner_or_admin"
on public.families for all
to authenticated
using (owner_id = auth.uid() or public.is_super_admin())
with check (owner_id = auth.uid() or public.is_super_admin());

drop policy if exists "members_all_owner_or_admin" on public.members;
create policy "members_all_owner_or_admin"
on public.members for all
to authenticated
using (public.owns_family(family_id) or public.is_super_admin())
with check (public.owns_family(family_id) or public.is_super_admin());

drop policy if exists "plans_all_owner_or_admin" on public.plans;
create policy "plans_all_owner_or_admin"
on public.plans for all
to authenticated
using (public.owns_family(family_id) or public.is_super_admin())
with check (public.owns_family(family_id) or public.is_super_admin());

drop policy if exists "assignments_all_owner_or_admin" on public.assignments;
create policy "assignments_all_owner_or_admin"
on public.assignments for all
to authenticated
using (
  exists (
    select 1
    from public.plans p
    where p.id = assignments.plan_id
      and (public.owns_family(p.family_id) or public.is_super_admin())
  )
)
with check (
  exists (
    select 1
    from public.plans p
    where p.id = assignments.plan_id
      and (public.owns_family(p.family_id) or public.is_super_admin())
  )
);

drop policy if exists "payments_owner_or_admin" on public.payments;
create policy "payments_owner_or_admin"
on public.payments for all
to authenticated
using (user_id = auth.uid() or public.is_super_admin())
with check (user_id = auth.uid() or public.is_super_admin());

create or replace function public.get_member_portal(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member public.members;
  v_family public.families;
  v_plan public.plans;
  v_assignment public.assignments;
begin
  select * into v_member
  from public.members
  where access_token = p_token;

  if not found then
    return null;
  end if;

  select * into v_family
  from public.families
  where id = v_member.family_id;

  select p.* into v_plan
  from public.plans p
  where p.family_id = v_member.family_id
    and p.active = true
  order by p.created_at desc
  limit 1;

  if v_plan.id is not null then
    select a.* into v_assignment
    from public.assignments a
    where a.plan_id = v_plan.id
      and a.member_id = v_member.id
    order by
      case when a.status = 'assigned' then 0 else 1 end,
      a.due_date asc,
      a.created_at asc
    limit 1;
  end if;

  return jsonb_build_object(
    'member', jsonb_build_object('id', v_member.id, 'name', v_member.name, 'level', v_member.level),
    'family', jsonb_build_object('id', v_family.id, 'name', v_family.name),
    'plan', case when v_plan.id is null then null else jsonb_build_object('id', v_plan.id, 'name', v_plan.name) end,
    'assignment', case when v_assignment.id is null then null else jsonb_build_object(
      'id', v_assignment.id,
      'reading_text', v_assignment.reading_text,
      'due_date', v_assignment.due_date,
      'status', v_assignment.status,
      'note', v_assignment.note
    ) end
  );
end;
$$;

create or replace function public.complete_member_assignment(
  p_token uuid,
  p_assignment_id uuid,
  p_status text,
  p_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
begin
  if p_status not in ('done', 'excused') then
    raise exception 'Invalid status';
  end if;

  select id into v_member_id
  from public.members
  where access_token = p_token;

  if v_member_id is null then
    raise exception 'Invalid member token';
  end if;

  update public.assignments
  set status = p_status,
      note = p_note,
      completed_at = case when p_status = 'done' then now() else null end
  where id = p_assignment_id
    and member_id = v_member_id;

  if not found then
    raise exception 'Assignment not found';
  end if;

  return true;
end;
$$;

grant execute on function public.get_member_portal(uuid) to anon, authenticated;
grant execute on function public.complete_member_assignment(uuid, uuid, text, text) to anon, authenticated;

create or replace function public.add_extra_ward(p_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member       public.members;
  v_plan         public.plans;
  v_last         integer;
  v_from         integer;
  v_to           integer;
  v_new_id       uuid;
  v_member_count integer;
begin
  select * into v_member
  from public.members
  where access_token = p_token;

  if not found then
    raise exception 'Invalid member token';
  end if;

  select p.* into v_plan
  from public.plans p
  where p.family_id = v_member.family_id
    and p.active = true
  order by p.created_at desc
  limit 1;

  if v_plan.id is null then
    raise exception 'No active plan';
  end if;

  -- Row-level lock on the family row: any concurrent call to add_extra_ward for the
  -- same family will block here until this transaction commits, making the
  -- MAX(end_page) read + INSERT + UPDATE a serialised critical section.
  perform 1 from public.families where id = v_member.family_id for update;

  -- Highest end_page across the whole family's current plan (safe after lock)
  select coalesce(max(end_page), 0) into v_last
  from public.assignments
  where plan_id = v_plan.id;

  if v_last >= 604 then
    return jsonb_build_object('at_limit', true);
  end if;

  v_from := v_last + 1;
  v_to   := least(v_last + 2, 604);

  insert into public.assignments (plan_id, member_id, reading_text, due_date, status, end_page)
  values (
    v_plan.id,
    v_member.id,
    'من صفحة ' || v_from || ' إلى صفحة ' || v_to,
    current_date,
    'assigned',
    v_to
  )
  returning id into v_new_id;

  -- Sync current_start_page so finishCurrentWardAndCreateNew starts the next
  -- regular batch at v_to+1 with no page gaps.
  -- Formula: current_start_page = (v_to+1) - (member_count * 2)
  -- Assumption: every member reads exactly 2 pages per ward (fixed level).
  -- Revisit this formula if variable reading levels (حزب / جزء) are introduced later.
  select count(*) into v_member_count
  from public.members
  where family_id = v_member.family_id;

  update public.families
  set current_start_page = greatest(v_to + 1 - (v_member_count * 2), 1)
  where id = v_member.family_id;

  return jsonb_build_object(
    'id',           v_new_id,
    'reading_text', 'من صفحة ' || v_from || ' إلى صفحة ' || v_to,
    'due_date',     current_date::text,
    'status',       'assigned',
    'note',         null
  );
end;
$$;

grant execute on function public.add_extra_ward(uuid) to anon, authenticated;

create index if not exists idx_families_owner_id on public.families(owner_id);
create index if not exists idx_members_family_id on public.members(family_id);
create index if not exists idx_members_access_token on public.members(access_token);
create index if not exists idx_plans_family_id on public.plans(family_id);
create index if not exists idx_assignments_plan_id on public.assignments(plan_id);
create index if not exists idx_assignments_member_id on public.assignments(member_id);

-- After you create your first account from /signup, run this once and replace the email:
-- update public.profiles set role = 'super_admin' where email = 'your-email@example.com';
