-- Migration 007: Add purpose and purpose_note columns to plans table.
--
-- purpose      : machine-readable intention key stored during onboarding
--                (family_ongoing | deceased | intention | ramadan | other)
-- purpose_note : free-text note; only populated when purpose = 'other'
--
-- Both columns are nullable so existing rows are unaffected.
-- Idempotent (safe to re-run).

alter table public.plans
  add column if not exists purpose text;

alter table public.plans
  add column if not exists purpose_note text;
