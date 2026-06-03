"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, StatusPill } from "@/components/ui";

type Assignment = {
  id: string;
  reading_text: string;
  due_date: string;
  status: string;
  note: string | null;
};

type PortalData = {
  member: { id: string; name: string; level: string };
  family: { name: string };
  plan: { name: string } | null;
  assignment: Assignment | null;
};

export default function MemberPortalPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [data, setData] = useState<PortalData | null>(null);
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [atLimit, setAtLimit] = useState(false);

  async function loadPortal() {
    const { data: portalData, error } = await supabase.rpc("get_member_portal", {
      p_token: token,
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }
    setData(portalData as PortalData);
    setLoading(false);
  }

  useEffect(() => {
    loadPortal();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(status: "done" | "excused") {
    if (!data?.assignment?.id || actionLoading) return;
    setActionLoading(true);
    setErrorMsg("");

    const { error } = await supabase.rpc("complete_member_assignment", {
      p_token: token,
      p_assignment_id: data.assignment.id,
      p_status: status,
      p_note: note.trim() || null,
    });

    setActionLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setNote("");
    await loadPortal();
  }

  async function addExtraWard() {
    if (actionLoading) return;
    setActionLoading(true);
    setErrorMsg("");

    const { data: result, error } = await supabase.rpc("add_extra_ward", {
      p_token: token,
    });

    setActionLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if ((result as { at_limit?: boolean })?.at_limit) {
      setAtLimit(true);
      return;
    }

    // Reload portal — get_member_portal will now return the new assigned ward
    await loadPortal();
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-emerald-50 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="text-sm font-bold text-slate-400">جاري التحميل…</p>
        </div>
      </main>
    );
  }

  // ── Invalid token ────────────────────────────────────────────────────────────
  if (!data?.member) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Card className="w-full max-w-md text-center">
          <div className="text-5xl text-rose-600">×</div>
          <h1 className="mt-4 text-2xl font-black">الرابط غير صحيح</h1>
          <p className="mt-2 text-slate-600">
            {errorMsg || "لم نتمكن من العثور على هذا الرابط."}
          </p>
        </Card>
      </main>
    );
  }

  const assignment = data.assignment;
  const status = assignment?.status ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-5" dir="rtl">
      <div className="mx-auto max-w-md space-y-4 py-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Card className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-3xl text-white">
            🕌
          </div>
          <p className="text-sm font-bold text-emerald-600">{data.family.name}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">
            السلام عليكم يا {data.member.name}
          </h1>
          {data.plan && (
            <p className="mt-1 text-xs font-medium text-slate-400">{data.plan.name}</p>
          )}
        </Card>

        {/* ── Assignment area ─────────────────────────────────────────────── */}
        {assignment ? (
          <>
            {/* Ward display */}
            <Card>
              <p className="mb-2 text-sm font-semibold text-slate-400">وردك في هذه الختمة</p>
              <p className="text-3xl font-black leading-tight text-emerald-900">
                {assignment.reading_text}
              </p>
              <div className="mt-3">
                <StatusPill status={assignment.status} />
              </div>
            </Card>

            {/* ── ASSIGNED: action buttons ──────────────────────────────── */}
            {status === "assigned" && (
              <Card>
                <label className="mb-4 block space-y-2 text-right">
                  <span className="text-sm font-semibold text-slate-600">
                    ملاحظة للمسؤول (اختياري)
                  </span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="اكتب ملاحظة لو حابب"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <div className="space-y-3">
                  <Button
                    onClick={() => submit("done")}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    {actionLoading ? "جاري التسجيل…" : "✓ تمت القراءة"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => submit("excused")}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    ◷ مش قادر أقرأ اليوم
                  </Button>
                </div>
              </Card>
            )}

            {/* ── DONE: success + optional extra ward ──────────────────── */}
            {status === "done" && (
              <Card className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  ✓
                </div>
                <h2 className="text-xl font-black text-emerald-900">جزاك الله خيرًا!</h2>
                <p className="mt-1 text-sm text-emerald-700">تقبّل الله قراءتك ✨</p>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  {atLimit ? (
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-sm font-semibold text-emerald-800">
                        🌿 الختمة قاربت على الانتهاء، بارك الله في عيلتكم
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-3 text-sm text-slate-500">
                        عايز تكمّل قراءة أكتر؟
                      </p>
                      <Button
                        variant="secondary"
                        onClick={addExtraWard}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? "جاري الإضافة…" : "📖 أزيد وردي"}
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            )}

            {/* ── EXCUSED: gentle message ───────────────────────────────── */}
            {status === "excused" && (
              <Card className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
                  🤍
                </div>
                <h2 className="text-xl font-black text-amber-900">لا بأس عليك</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  يسّر الله لك ورفع عنك الحرج، وسيتابع المسؤول الورد.
                </p>
              </Card>
            )}
          </>
        ) : (
          <Card className="text-center">
            <div className="text-4xl">📋</div>
            <h2 className="mt-3 text-xl font-black text-slate-700">لا يوجد ورد حاليًا</h2>
            <p className="mt-2 text-sm text-slate-500">
              مسؤول العيلة لم يحدد وردًا نشطًا لك بعد.
            </p>
          </Card>
        )}

        {/* ── Error message ───────────────────────────────────────────────── */}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-center text-sm font-bold text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-slate-400">
          لا تحتاج لتسجيل دخول — هذا الرابط خاص بك فقط.
        </p>
      </div>
    </main>
  );
}
