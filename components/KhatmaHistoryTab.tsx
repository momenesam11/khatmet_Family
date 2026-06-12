"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MemberRef = { id: string; name: string };

type AssignmentRef = {
  id: string;
  status: string;
  start_page: number | null;
  member_id: string;
  members: MemberRef | null;
};

type Plan = {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  active: boolean;
  assignments: AssignmentRef[];
};

type MemberStats = {
  id: string;
  name: string;
  doneCount: number;
  pct: number;
};

function getPlanStatus(plan: Plan): "active" | "completed" {
  if (plan.active) return "active";
  return "completed";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function KhatmaHistoryTab({ familyId }: { familyId: string }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from("plans")
      .select(
        "id, name, start_date, end_date, active, assignments(id, status, start_page, member_id, members(id, name))"
      )
      .eq("family_id", familyId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        type RawAssignment = Omit<AssignmentRef, "members"> & {
          members: MemberRef | MemberRef[] | null;
        };
        type RawPlan = Omit<Plan, "assignments"> & {
          assignments: RawAssignment[];
        };

        const normalized: Plan[] = ((data ?? []) as unknown as RawPlan[]).map((plan) => ({
          ...plan,
          assignments: plan.assignments.map((a) => ({
            ...a,
            members: Array.isArray(a.members) ? (a.members[0] ?? null) : a.members,
          })),
        }));

        setPlans(normalized);
        // Active plans open by default
        setOpenIds(new Set(normalized.filter((p) => p.active).map((p) => p.id)));
        setLoading(false);
      });
  }, [familyId]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">جاري التحميل...</p>
    );
  }

  if (plans.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">
        لا توجد ختمات بعد — أنشئ أول ختمة من تاب "الختمات والأوراد".
      </p>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <h2 className="text-2xl font-black">سجل الختمات</h2>

      {plans.map((plan) => {
        const isOpen = openIds.has(plan.id);
        const status = getPlanStatus(plan);
        const doneCount = plan.assignments.filter((a) => a.status === "done").length;

        // Per-member stats (client-side)
        const memberMap = new Map<string, MemberStats>();
        for (const a of plan.assignments) {
          if (!a.members) continue;
          const mem = a.members;
          if (!memberMap.has(mem.id)) {
            memberMap.set(mem.id, { id: mem.id, name: mem.name, doneCount: 0, pct: 0 });
          }
          if (a.status === "done") {
            memberMap.get(mem.id)!.doneCount++;
          }
        }
        const memberStats: MemberStats[] = [...memberMap.values()]
          .map((m) => ({
            ...m,
            pct: doneCount > 0 ? Math.round((m.doneCount / doneCount) * 100) : 0,
          }))
          .sort((a, b) => b.doneCount - a.doneCount);

        return (
          <div
            key={plan.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Card header / toggle button */}
            <button
              type="button"
              onClick={() => toggle(plan.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-right transition hover:bg-slate-50"
            >
              <span className="text-xs text-slate-400 flex-shrink-0">
                {isOpen ? "▲" : "▼"}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-black text-slate-900 truncate">
                    {plan.name}
                  </span>
                  {status === "active" ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 flex-shrink-0">
                      جارية
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500 flex-shrink-0">
                      مكتملة ✓
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(plan.start_date)}
                  {plan.end_date ? ` — ${formatDate(plan.end_date)}` : ""}
                </p>
              </div>

              {/* Progress summary */}
              <div className="text-left flex-shrink-0">
                <p className="text-sm font-black text-emerald-800">
                  {doneCount}
                  <span className="text-xs font-semibold text-slate-400"> / 604</span>
                </p>
                <p className="text-xs text-slate-400">صفحة مقروءة</p>
              </div>
            </button>

            {/* Expanded: member breakdown */}
            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4">
                {memberStats.length === 0 ? (
                  <p className="text-sm text-slate-400">لا توجد بيانات لهذه الختمة.</p>
                ) : (
                  <div className="space-y-2">
                    {memberStats.map((m, idx) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                      >
                        <span className="w-5 text-center text-xs font-black text-slate-300">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-sm font-bold text-slate-900">{m.name}</p>
                        <div className="text-left">
                          <p className="text-sm font-black text-emerald-800">
                            {m.doneCount}{" "}
                            <span className="text-xs font-semibold text-slate-400">صفحة</span>
                          </p>
                          <p className="text-xs text-slate-400">{m.pct}% من المقروء</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
