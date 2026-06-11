import React, { useRef, useState, useMemo } from "react";
import { toPng } from "html-to-image";
import { Share2, Download, Image as ImageIcon } from "lucide-react";
import { Assignment } from "./StatsBar";

interface WardShareCardProps {
  familyName: string;
  planName: string;
  assignments: Assignment[];
}

export function WardShareCard({ familyName, planName, assignments }: WardShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Filter assignments to get the latest unique assignment for each member
  const latestAssignmentsByMember = useMemo(() => {
    const map = new Map<string, Assignment>();
    // Iterate in chronological order so that the latest assignment overwrites previous ones
    assignments.forEach((a) => {
      const name = a.members?.name;
      if (name) {
        map.set(name, a);
      }
    });
    
    // Sort: assigned first, then others
    return Array.from(map.values()).sort((a, b) => {
      if (a.status === "assigned" && b.status !== "assigned") return -1;
      if (a.status !== "assigned" && b.status === "assigned") return 1;
      return 0;
    });
  }, [assignments]);

  const saveAsImage = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      // Small delay to ensure styles are loaded
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality
        style: {
          direction: "rtl",
        },
      });

      // Try Web Share API first (mobile friendly)
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `ورد-${familyName}.png`, { type: "image/png" });
      
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `ورد عائلة ${familyName}`,
          text: `ورد عائلة ${familyName} لليوم — ختمة عيلة`,
          files: [file],
        });
        return;
      }

      // Fallback: download
      const link = document.createElement("a");
      link.download = `ورد-عائلة-${familyName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating share image:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-black text-slate-900">بطاقة المشاركة اليومية</h3>
      
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Capturable Card Preview Wrapper */}
        <div className="overflow-x-auto pb-2 flex items-center justify-center bg-slate-100 rounded-3xl p-2 sm:p-4 border border-slate-200">
          <div 
            ref={cardRef} 
            className="w-full max-w-[360px] overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-4 sm:p-6 text-white shadow-xl relative select-none"
            dir="rtl"
          >
            {/* Islamic decorative corner patterns */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,#c4a059_0%,transparent_70%)]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,#c4a059_0%,transparent_70%)]" />

            {/* Inner elegant border */}
            <div className="absolute inset-2.5 rounded-[22px] border border-amber-400/10 pointer-events-none" />

            {/* Header */}
            <div className="mb-6 text-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                🕌 ختمة عيلة
              </span>
              <h2 className="mt-4 text-2xl font-black text-white drop-shadow-sm">
                ورد عائلة {familyName}
              </h2>
              <p className="mt-1 text-xs font-semibold text-emerald-200">
                {planName}
              </p>
              <div className="mt-3 inline-block rounded-xl bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-bold text-emerald-100">
                📅 {todayStr}
              </div>
            </div>

            {/* Member rows */}
            <div className="space-y-2.5 relative z-10 max-h-[400px] overflow-y-auto pr-1">
              {latestAssignmentsByMember.map((assignment) => {
                const isDone = assignment.status === "done";
                const isExcused = assignment.status === "excused";
                
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/15 hover:border-white/10 p-3 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-white truncate">
                        {assignment.members?.name || "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-300 font-semibold">
                        {assignment.reading_text}
                      </p>
                    </div>
                    
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black border ${
                        isDone
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : isExcused
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-white/10 text-white/80 border-white/10"
                      }`}
                    >
                      {isDone ? "✓ قُرئ" : isExcused ? "اعتذر" : "لم يقرأ"}
                    </span>
                  </div>
                );
              })}

              {latestAssignmentsByMember.length === 0 && (
                <p className="text-center text-xs text-emerald-300 py-6">
                  لا يوجد أوراد مسجلة اليوم
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center relative z-10 border-t border-white/10 pt-4">
              <p className="text-[10px] font-bold text-amber-400">
                نجمع العيلة على القرآن الكريم 🤍
              </p>
              <p className="mt-0.5 text-[8px] text-white/40">
                khatma-aaila.com
              </p>
            </div>
          </div>
        </div>

        {/* Action Description & Buttons */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <h4 className="font-black text-slate-800 text-sm">مشاركة الورد اليومي</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              يمكنك تصدير هذه البطاقة كصورة لمشاركتها بسهولة على مجموعة واتساب العائلة. ستظهر الصورة بجميع أوراد اليوم وحالة قراءة كل فرد.
            </p>
          </div>

          <button
            type="button"
            disabled={isCapturing || latestAssignmentsByMember.length === 0}
            onClick={saveAsImage}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3.5 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCapturing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>جاري توليد الصورة...</span>
              </>
            ) : (
              <>
                <Share2 size={16} />
                <span>📸 حفظ كصورة ومشاركة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
