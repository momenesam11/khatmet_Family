"use client";

import React from "react";

export type PurposeKey =
  | "family_ongoing"
  | "deceased"
  | "intention"
  | "ramadan"
  | "other";

interface Props {
  familyName: string;
  khatmaNumber: number;
  purpose?: string | null;
  purposeNote?: string | null;
}

export function getDua(purpose?: string | null, purposeNote?: string | null): string | null {
  switch (purpose) {
    case "deceased":
      return `اللهم اجعل ثواب هذه الختمة صدقة جارية عن روح ${purposeNote?.trim() || "المتوفّى"}، واغفر له وارحمه وأدخله فسيح جناتك`;
    case "intention":
      return "اللهم تقبّل هذه الختمة وحقّق بها ما نويناه، إنك سميع مجيب";
    case "ramadan":
      return "اللهم تقبّل منا صيامنا وقيامنا وختمنا، وبلّغنا رمضان القادم";
    default:
      return null;
  }
}

const MAIN_DUA = "اللهم ارحمنا بالقرآن واجعله لنا إماماً ونوراً وهدى ورحمة";

const KhatmaShareCard = React.forwardRef<HTMLDivElement, Props>(
  ({ familyName, khatmaNumber, purpose, purposeNote }, ref) => {
    const today = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const extraDua = getDua(purpose, purposeNote);

    return (
      <div
        ref={ref}
        dir="rtl"
        className="relative flex flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600 text-white"
        style={{ width: 360, height: 360, fontFamily: "'Cairo', sans-serif" }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute inset-4 rounded-2xl border border-white/10" />

        <div className="relative z-10 w-full border-b border-white/10 px-6 py-4 text-center">
          <p className="text-[11px] font-black tracking-widest text-amber-300 uppercase">
            ختمة عيلة
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-white/50">{today}</p>
        </div>

        {/* Center */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          {/* Bismillah */}
          <p
            className="text-xl leading-relaxed text-amber-200"
            style={{ fontFamily: "'Amiri Quran', 'Amiri', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <div className="space-y-1">
            <h2 className="text-base font-black leading-snug text-white">
              مبروك! اكتملت ختمة عيلة
            </h2>
            <p className="text-lg font-black text-amber-300">{familyName}</p>
            <p className="text-xs font-bold text-white/60">الختمة رقم {khatmaNumber}</p>
          </div>

          {/* Main dua */}
          <div className="rounded-xl bg-white/10 px-4 py-2.5 text-center">
            <p className="text-[11px] font-semibold leading-relaxed text-emerald-100">
              {MAIN_DUA}
            </p>
          </div>

          {/* Extra dua */}
          {extraDua && (
            <p className="text-[10px] font-medium leading-relaxed text-white/70">
              {extraDua}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 w-full border-t border-white/10 px-6 py-3 text-center">
          <p className="text-[10px] font-bold text-amber-300">
            ختمة عيلة — نجمع العيلة على القرآن
          </p>
        </div>
      </div>
    );
  }
);

KhatmaShareCard.displayName = "KhatmaShareCard";

export { KhatmaShareCard };
