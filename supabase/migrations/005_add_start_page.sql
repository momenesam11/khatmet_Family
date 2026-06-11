-- Migration 005: Add start_page column to assignments
-- Complements end_page: together they express a ward as individual page numbers
-- (page 20, page 21) rather than a range string.
-- This enables single-page display in the member portal and prepares for the
-- khatma Grid view (each cell = one page) in the next phase.
-- Safe to re-run (idempotent throughout).

alter table public.assignments
  add column if not exists start_page integer;

-- Backfill existing rows from reading_text: "من صفحة X إلى صفحة Y"
update public.assignments
set start_page = (regexp_match(reading_text, 'من صفحة (\d+)'))[1]::integer
where start_page is null
  and reading_text ~ 'من صفحة \d+';

-- Fallback: single-page assignments where start_page = end_page
update public.assignments
set start_page = end_page
where start_page is null
  and end_page is not null;

create index if not exists idx_assignments_start_page on public.assignments(start_page);
