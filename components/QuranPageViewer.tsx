"use client";

import { useEffect, useState } from "react";
import { defaultQuranProvider, type QuranVerse } from "@/lib/quran-provider";

// Verse number rendered as a small emerald circle superscript
function VerseNumber({ verseKey }: { verseKey: string }) {
  const num = verseKey.split(":")[1];
  return (
    <sup
      className="mx-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700 align-super"
      aria-label={`آية ${num}`}
    >
      {num}
    </sup>
  );
}

// Skeleton shown while verses are loading
function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden>
      {[85, 100, 70, 95, 60].map((w, i) => (
        <div
          key={i}
          className="h-7 rounded-xl bg-amber-200/60"
          style={{ width: `${w}%`, marginRight: "auto", marginLeft: "auto" }}
        />
      ))}
    </div>
  );
}

interface Props {
  pageNumber: number;
}

export default function QuranPageViewer({ pageNumber }: Props) {
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!pageNumber || pageNumber < 1 || pageNumber > 604) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setVerses([]);

    defaultQuranProvider
      .getPageVerses(pageNumber)
      .then((v) => {
        setVerses(v);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [pageNumber]);

  const externalUrl = `https://quran.com/page/${pageNumber}`;

  return (
    <div
      dir="rtl"
      className="overflow-hidden rounded-3xl border border-amber-200/70 bg-[#FFFDF5] shadow-sm"
    >
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-amber-200/50 px-5 py-3">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-emerald-600 underline-offset-2 hover:underline"
        >
          افتح في المصحف الرقمي ↗
        </a>
        <span className="text-xs font-bold text-amber-800">
          صفحة {pageNumber}
        </span>
      </div>

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div className="px-5 py-6">
        {status === "loading" && <PageSkeleton />}

        {status === "error" && (
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold text-slate-500">
              تعذّر تحميل الصفحة — تحقق من الإنترنت.
            </p>
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              📖 اقرأ الصفحة على Quran.com
            </a>
          </div>
        )}

        {status === "ok" && verses.length > 0 && (
          <p
            className="text-center text-2xl leading-loose text-slate-800 sm:text-3xl"
            style={{ fontFamily: "'Amiri Quran', serif" }}
          >
            {verses.map((verse) => (
              <span key={verse.key}>
                {verse.text}
                <VerseNumber verseKey={verse.key} />
              </span>
            ))}
          </p>
        )}
      </div>

      {/* ── Page footer ──────────────────────────────────────────────────── */}
      {status === "ok" && (
        <div className="border-t border-amber-200/50 px-5 py-3 text-center">
          <span className="text-[10px] font-medium text-amber-700/60">
            ﴿ صفحة {pageNumber} من المصحف الشريف ﴾
          </span>
        </div>
      )}
    </div>
  );
}
