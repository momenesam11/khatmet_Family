-- Migration 006: Add last_ward_date to families for lazy daily ward transition.
-- get_member_portal compares last_ward_date to current_date; when it's stale,
-- it auto-creates the next ward (with FOR UPDATE lock to prevent race conditions).
-- This removes the need for the admin to manually press "إنهاء الورد" every day.
-- Safe to re-run (idempotent throughout).

alter table public.families
  add column if not exists last_ward_date date;

-- Backfill: set to the most recent due_date in each family's active plan
-- so the first lazy check on an existing family does not re-create today's ward.
update public.families f
set last_ward_date = sub.max_due
from (
  select p.family_id, max(a.due_date) as max_due
  from public.assignments a
  join public.plans p on p.id = a.plan_id
  where p.active = true
  group by p.family_id
) sub
where f.id = sub.family_id
  and f.last_ward_date is null;
