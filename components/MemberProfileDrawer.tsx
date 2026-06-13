"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatusPill } from "@/components/ui";
import { X, Send, Link2 } from "lucide-react";

type Member = {
  id: string;
  name: string;
  phone: string | null;
  level: string;
  access_token: string;
  family_id: string;
};

type PlanRef = {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  active: boolean;
};

type AssignmentWithPlan = {
  id: string;
  plan_id: string;
  start_page: number | null;
  end_page: number | null;
  reading_text: string;
  due_date: string;
  status: string;
  completed_at: string | null;
  plans: PlanRef | null;
};

type GroupedKhatma = {
  plan: PlanRef;
  assignments: AssignmentWithPlan[];
  doneCount: number;
};

function getMemberLink(token: string) {
  return `${window.location.origin}/member/${token}`;
}

function openWhatsApp(phone: string | null | undefined, text: string) {
  if (!phone) return;
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? "2" + digits : digits;
  window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(text)}`, "_blank");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MemberProfileDrawer({
  member,
  onClose,
  onCopy,
}: {
  member: Member;
  onClose: () => void;
  onCopy: (text: string) => void;
}) {
  const [assignments, setAssignments] = useState<AssignmentWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [openKhatmaIds, setOpenKhatmaIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setAssignments([]);

    supabase
      .from("assignments")
      .select("*, plans(id, name, start_date, end_date, active)")
      .eq("member_id", member.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        type Raw = Omit<AssignmentWithPlan, "plans"> & {
          plans: PlanRef | PlanRef[] | null;
        };
        const normalized: AssignmentWithPlan[] = ((data ?? []) as unknown as Raw[]).map(
          (item) => ({
            ...item,
            plans: Array.isArray(item.plans) ? (item.plans[0] ?? null) : item.plans,
          })
        );
        setAssignments(normalized);
        setLoading(false);
      });
  }, [member.id]);

  const grouped: GroupedKhatma[] = [];
  const seen = new Map<string, GroupedKhatma>();
  for (const a of assignments) {
    if (!a.plans) continue;
    const pid = a.plans.id;
    if (!seen.has(pid)) {
      const g: GroupedKhatma = { plan: a.plans, assignments: [], doneCount: 0 };
      seen.set(pid, g);
      grouped.push(g);
    }
    const g = seen.get(pid)!;
    g.assignments.push(a);
    if (a.status === "done") g.doneCount++;
  }

  const currentKhatma = grouped.find((g) => g.plan.active) ?? null;
  const pastKhatmas = grouped.filter((g) => !g.plan.active);
  const totalDone = assignments.filter((a) => a.status === "done").length;

  function toggleKhatma(id: string) {
    setOpenKhatmaIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        dir="rtl"
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl
                   lg:bottom-0 lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:w-[420px] lg:rounded-none lg:rounded-l-3xl lg:max-h-screen"
      >
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-slate-200 lg:hidden" />

        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-900">{member.name}</h2>
            <p className="mt-0.5 text-sm font-semibold text-emerald-700">{member.level}</p>
            {member.phone && (
              <p className="mt-0.5 text-xs text-slate-500 dir-ltr text-right">{member.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-center shrink-0">
            <p className="text-2xl font-black text-emerald-900">{totalDone}</p>
            <p className="text-xs font-semibold text-emerald-700">صفحة مقروءة</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => onCopy(getMemberLink(member.access_token))}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              <Link2 className="h-3.5 w-3.5" /> نسخ الرابط
            </button>
            {member.phone && (
              <button
                type="button"
                onClick={() => {
                  const link = getMemberLink(member.access_token);
                  const text = `السلام عليكم يا ${member.name}، تفضل رابط بوابتك في ختمة العيلة: ${link}`;
                  openWhatsApp(member.phone, text);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-100"
              >
                <Send className="h-3.5 w-3.5" /> إرسال عبر واتساب
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-slate-400">جاري التحميل...</p>
        ) : (
          <div className="space-y-6 px-5 pb-12">
            {currentKhatma && (
              <section>
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                  الختمة الحالية — {currentKhatma.plan.name}
                </h3>
                <div className="space-y-2">
                  {currentKhatma.assignments.length === 0 ? (
                    <p className="text-sm text-slate-400">لا يوجد سجل بعد.</p>
                  ) : (
                    currentKhatma.assignments.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <StatusPill status={a.status} />
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{a.reading_text}</p>
                          <p className="text-xs text-slate-400">{formatDate(a.due_date)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {pastKhatmas.length > 0 && (
              <section>
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                  الختمات السابقة
                </h3>
                <div className="space-y-2">
                  {pastKhatmas.map((g) => {
                    const isOpen = openKhatmaIds.has(g.plan.id);
                    return (
                      <div
                        key={g.plan.id}
                        className="overflow-hidden rounded-2xl border border-slate-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleKhatma(g.plan.id)}
                          className="flex w-full items-center justify-between px-4 py-3 text-right transition hover:bg-slate-50"
                        >
                          <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{g.plan.name}</p>
                            <p className="text-xs text-slate-400">{formatDate(g.plan.start_date)}</p>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-sm font-semibold text-slate-700">
                              صفحات مقروءة:{" "}
                              <span className="font-black text-emerald-700">{g.doneCount}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {!currentKhatma && pastKhatmas.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                لا يوجد سجل لهذا العضو بعد.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
