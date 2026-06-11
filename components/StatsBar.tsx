import React from "react";
import { BookOpen, CheckCircle2, Users, Trophy } from "lucide-react";

export type Assignment = {
  id: string;
  start_page?: number | null;
  end_page?: number | null;
  reading_text: string;
  due_date: string;
  status: string;
  note: string | null;
  completed_at: string | null;
  member_id?: string;
  members?: { name: string; phone: string | null; access_token: string } | null;
};

interface StatsBarProps {
  assignments: Assignment[];
  khatmasCompleted: number;
  totalMembers: number;
}

export function StatsBar({ assignments, khatmasCompleted, totalMembers }: StatsBarProps) {
  const completedCount = assignments.filter((a) => a.status === "done").length;
  const remainingCount = Math.max(0, 604 - completedCount);

  // Count members whose latest assignment is 'done'.
  // Assignments arrive sorted by created_at ASC, so the last entry per member is newest.
  // Resets automatically when a new ward is distributed (latest becomes 'assigned').
  const latestByMember = new Map<string, string>(); // member_id → status
  assignments.forEach((a) => {
    if (a.member_id) latestByMember.set(a.member_id, a.status);
  });
  const readTodayCount = [...latestByMember.values()].filter((s) => s === "done").length;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" dir="rtl">
      {/* Card 1: Wards remaining */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md glass-card-gold relative overflow-hidden">
        <div className="absolute -left-4 -top-4 text-amber-500/5 select-none pointer-events-none">
          <BookOpen size={80} />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate"> فاضل للختمة</p>
            <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-black text-slate-900">
              {remainingCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">صفحة</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Completed pages */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md glass-card-emerald relative overflow-hidden">
        <div className="absolute -left-4 -top-4 text-emerald-500/5 select-none pointer-events-none">
          <CheckCircle2 size={80} />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate"> مكتمل</p>
            <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-black text-slate-900">
              {completedCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">من 604</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Read today */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md glass-card relative overflow-hidden">
        <div className="absolute -left-4 -top-4 text-teal-500/5 select-none pointer-events-none">
          <Users size={80} />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate"> قرأوا اليوم</p>
            <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-black text-slate-900">
              {readTodayCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">من {totalMembers}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Card 4: Completed Khatmas */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md glass-card relative overflow-hidden">
        <div className="absolute -left-4 -top-4 text-amber-500/5 select-none pointer-events-none">
          <Trophy size={80} />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate"> ختمات مكتملة</p>
            <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-black text-slate-900">
              {khatmasCompleted} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">ختمة</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
