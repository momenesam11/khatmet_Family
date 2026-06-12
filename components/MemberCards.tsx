import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { Assignment } from "./StatsBar";

export type Member = {
  id: string;
  family_id: string;
  name: string;
  phone: string | null;
  level: string;
  access_token: string;
};

interface MemberCardsProps {
  members: Member[];
  assignments: Assignment[];
  onUpdateAssignmentStatus: (assignmentId: string, status: "done" | "excused" | "assigned") => Promise<void>;
}

export function MemberCards({ members, assignments, onUpdateAssignmentStatus }: MemberCardsProps) {
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleRecordReading = async (assignmentId: string) => {
    setLoadingIds((prev) => ({ ...prev, [assignmentId]: true }));
    try {
      await onUpdateAssignmentStatus(assignmentId, "done");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  // Helper to format the completion date beautifully
  const formatLastReadDate = (completedAtStr: string | null, dueDateStr: string): string => {
    const targetDateStr = completedAtStr || dueDateStr;
    if (!targetDateStr) return "—";

    const date = new Date(targetDateStr);
    const now = new Date();

    // Check if valid date
    if (isNaN(date.getTime())) return targetDateStr;

    const timeStr = date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true });

    if (date.toDateString() === now.toDateString()) {
      return `اليوم، الساعة ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `أمس، الساعة ${timeStr}`;
    }

    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const processedMembers = useMemo(() => {
    return members.map((member) => {
      // Find all assignments for this member
      const memberAssignments = assignments.filter(
        (a) => a.member_id === member.id || a.members?.access_token === member.access_token
      );

      // Sort assignments by created_at descending (latest first)
      // Since assignments is sorted by created_at ascending in DB query, we reverse it here
      const sortedAssignments = [...memberAssignments].reverse();

      // Current assignment: check if there's an active 'assigned' assignment.
      // If not, take the most recent assignment overall.
      const activeAssignment = sortedAssignments.find((a) => a.status === "assigned");
      const currentAssignment = activeAssignment || sortedAssignments[0] || null;

      // Status pill configuration
      let statusLabel = "لا يوجد ورد";
      let pillClass = "bg-slate-100 text-slate-500 border-slate-200";
      let statusKey = "none";

      if (currentAssignment) {
        if (currentAssignment.status === "done") {
          statusLabel = "قُرئ ✓";
          pillClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
          statusKey = "done";
        } else if (currentAssignment.status === "excused") {
          statusLabel = "اعتذر";
          pillClass = "bg-amber-50 text-amber-700 border-amber-200/60";
          statusKey = "excused";
        } else if (currentAssignment.status === "assigned") {
          const isDelayed = currentAssignment.due_date < todayStr;
          if (isDelayed) {
            statusLabel = "متأخر";
            pillClass = "bg-rose-50 text-rose-700 border-rose-200/60";
            statusKey = "delayed";
          } else {
            statusLabel = "حالي";
            pillClass = "bg-blue-50 text-blue-700 border-blue-200/60";
            statusKey = "current";
          }
        }
      }

      // Date of last reading (latest assignment with status = 'done')
      const lastReadAssignment = sortedAssignments.find((a) => a.status === "done");
      const lastReadText = lastReadAssignment
        ? formatLastReadDate(lastReadAssignment.completed_at, lastReadAssignment.due_date)
        : "لم يقرأ بعد";

      return {
        member,
        currentAssignment,
        statusLabel,
        pillClass,
        statusKey,
        lastReadText,
      };
    });
  }, [members, assignments, todayStr]);

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-black text-slate-900">الورد الحالي لأفراد العائلة</h3>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {processedMembers.map(({ member, currentAssignment, statusLabel, pillClass, statusKey, lastReadText }) => (
          <div
            key={member.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md glass-card"
          >
            <div className="space-y-3">
              {/* Header: Member name & Access role */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2">
                <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate" title={member.name}>
                  {member.name}
                </h4>
                <span className={`inline-flex self-start sm:self-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold border ${pillClass}`}>
                  {statusLabel}
                </span>
              </div>

              {/* Current Assignment page info */}
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-[10px] sm:text-xs text-slate-400">الورد الحالي</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {currentAssignment ? currentAssignment.reading_text : "لا يوجد ورد نشط"}
                </p>
              </div>

              {/* Date of last read */}
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs text-slate-400">تاريخ آخر قراءة</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 truncate" title={lastReadText}>
                  {lastReadText}
                </p>
              </div>
            </div>

            {/* Quick Action Button: record as read if assigned */}
            {currentAssignment && currentAssignment.status === "assigned" && (
              <button
                type="button"
                disabled={loadingIds[currentAssignment.id]}
                onClick={() => handleRecordReading(currentAssignment.id)}
                className="mt-3.5 flex w-full items-center justify-center gap-1 rounded-2xl bg-emerald-700 min-h-11 py-2.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingIds[currentAssignment.id] ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check size={12} className="sm:h-3.5 sm:w-3.5" />
                )}
                <span>سجّل قراءة</span>
              </button>
            )}
          </div>
        ))}

        {processedMembers.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500 font-semibold bg-white/50">
            لا يوجد أفراد عائلة حالياً. انتقل إلى تبويب "أفراد العيلة" لإضافتهم.
          </div>
        )}
      </div>
    </div>
  );
}
