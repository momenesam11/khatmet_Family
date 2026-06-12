-- Migration 008: assign_ward_to_member(p_member_id uuid) → jsonb
--
-- Called from the client immediately after a new member is inserted.
-- Finds the family's active plan and appends the next unassigned page to
-- the new member (max end_page + 1), serialised with FOR UPDATE to prevent
-- race conditions identical to add_extra_ward.
--
-- Return values:
--   { id, start_page, end_page, reading_text, due_date, status }  — success
--   { no_active_plan: true }                                        — no active plan yet
--   { at_limit: true }                                              — all 604 pages assigned
--
-- Idempotent (create or replace).

create or replace function public.assign_ward_to_member(p_member_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member        public.members;
  v_plan          public.plans;
  v_last          integer;
  v_from          integer;
  v_to            integer;
  v_new_id        uuid;
  v_member_count  integer;
begin
  -- 1. Resolve member
  select * into v_member
  from public.members
  where id = p_member_id;

  if not found then
    raise exception 'assign_ward_to_member: member not found: %', p_member_id;
  end if;

  -- 2. Find the family's active plan
  select p.* into v_plan
  from public.plans p
  where p.family_id = v_member.family_id
    and p.active = true
  order by p.created_at desc
  limit 1;

  if v_plan.id is null then
    return jsonb_build_object('no_active_plan', true);
  end if;

  -- 3. Row-level lock on the family to serialise concurrent inserts
  --    (same pattern as add_extra_ward)
  perform 1
  from public.families
  where id = v_member.family_id
  for update;

  -- 4. Determine next page (max end_page + 1)
  select coalesce(max(a.end_page), 0) into v_last
  from public.assignments a
  where a.plan_id = v_plan.id;

  if v_last >= 604 then
    return jsonb_build_object('at_limit', true);
  end if;

  v_from := v_last + 1;
  v_to   := v_from;

  -- 5. Insert assignment
  insert into public.assignments
    (plan_id, member_id, reading_text, due_date, status, start_page, end_page)
  values (
    v_plan.id,
    p_member_id,
    'صفحة ' || v_from,
    current_date,
    'assigned',
    v_from,
    v_to
  )
  returning id into v_new_id;

  -- 6. Keep current_start_page consistent so finishCurrentWardAndCreateNew
  --    always starts from the right position with no gaps.
  --    Formula mirrors add_extra_ward exactly:
  --      nextWardStart = current_start_page + member_count
  --    We want nextWardStart = v_to + 1, so:
  --      current_start_page = v_to + 1 - member_count
  select count(*) into v_member_count
  from public.members
  where family_id = v_member.family_id;

  update public.families
  set current_start_page = greatest(v_to + 1 - v_member_count, 1)
  where id = v_member.family_id;

  return jsonb_build_object(
    'id',           v_new_id,
    'start_page',   v_from,
    'end_page',     v_to,
    'reading_text', 'صفحة ' || v_from,
    'due_date',     current_date::text,
    'status',       'assigned'
  );
end;
$$;

grant execute on function public.assign_ward_to_member(uuid) to authenticated;

create index if not exists idx_assignments_plan_end_page
  on public.assignments(plan_id, end_page);
