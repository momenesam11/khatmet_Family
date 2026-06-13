import React, { useMemo } from "react";
import { Assignment } from "./StatsBar";

interface KhatmaGridProps {
  assignments: Assignment[];
}

export function KhatmaGrid({ assignments }: KhatmaGridProps) {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Map each page to its most-relevant assignment.
  // Priority: done > assigned/excused (newest wins among non-done).
  // Assumes assignments is sorted by created_at ASC so later entries are newer.
  const assignmentMap = useMemo(() => {
    const map = new Map<number, Assignment>();
    assignments.forEach((a) => {
      if (a.start_page == null) return;
      const existing = map.get(a.start_page);
      if (!existing) {
        map.set(a.start_page, a);
      } else if (existing.status !== "done" && a.status === "done") {
        // done beats everything
        map.set(a.start_page, a);
      } else if (existing.status !== "done" && a.status !== "done") {
        // both non-done: take the newer one (a is newer, array is asc)
        map.set(a.start_page, a);
      }
      // existing is done → keep it, ignore a
    });
    return map;
  }, [assignments]);

  const cells = useMemo(() => {
    const list = [];
    for (let page = 1; page <= 604; page++) {
      const assignment = assignmentMap.get(page);
      let bgColor =
        "bg-slate-100 text-slate-400 hover:bg-slate-200 border-slate-200/50";
      let statusText = "لم يُوزَّع بعد";
      let memberName = "";

      if (assignment) {
        memberName = assignment.members?.name || "عضو غير معروف";
        if (assignment.status === "done") {
          bgColor =
            "bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-800";
          statusText = "تمت القراءة";
        } else if (assignment.status === "excused") {
          bgColor =
            "bg-rose-200 text-rose-950 hover:bg-rose-300 border-rose-300";
          statusText = "اعتذر";
        } else if (assignment.status === "assigned") {
          const isDelayed = assignment.due_date < todayStr;
          if (isDelayed) {
            bgColor =
              "bg-rose-200 text-rose-950 hover:bg-rose-300 border-rose-300";
            statusText = "متأخر (لم يقرأ)";
          } else {
            bgColor =
              "bg-emerald-200 text-emerald-950 hover:bg-emerald-300 border-emerald-300";
            statusText = "الورد الحالي";
          }
        }
      }

      const tooltip = assignment
        ? `صفحة ${page} — ${memberName} (${statusText})`
        : `صفحة ${page} — لم تُوزَّع بعد`;

      list.push({ page, bgColor, tooltip });
    }
    return list;
  }, [assignmentMap, todayStr]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm" dir="rtl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            خريطة الختمة (604 صفحة)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            خريطة بصرية تفاعلية تعرض حالة كل صفحة في المصحف الشريف
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-emerald-700 border border-emerald-800" />
            <span className="font-semibold text-slate-600">تمت القراءة</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-emerald-200 border border-emerald-300" />
            <span className="font-semibold text-slate-600">الورد الحالي</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-rose-200 border border-rose-300" />
            <span className="font-semibold text-slate-600">متأخر / اعتذر</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-slate-100 border border-slate-200" />
            <span className="font-semibold text-slate-600">غير موزع</span>
          </div>
        </div>
      </div>

      {/* Grid — 20 cols mobile / 25 tablet / 30 desktop, fills full width */}
      <div
        className="grid gap-[3px] py-1 [--cols:20] sm:[--cols:25] lg:[--cols:30]"
        style={{ gridTemplateColumns: "repeat(var(--cols), minmax(0, 1fr))" }}
      >
        {cells.map(({ page, bgColor, tooltip }) => (
          <div
            key={page}
            title={tooltip}
            className={`aspect-square rounded-[2px] border flex items-center justify-center select-none cursor-pointer transition-transform hover:scale-110 hover:z-10 ${bgColor}`}
          >
            <span className="hidden lg:block text-[13px] font-semibold leading-none">
              {page}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
