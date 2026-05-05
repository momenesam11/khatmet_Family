"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, StatusPill } from "@/components/ui";

type PortalData = {
  member: { id: string; name: string; level: string };
  family: { name: string };
  plan: { name: string } | null;
  assignment: { id: string; reading_text: string; due_date: string; status: string; note: string | null } | null;
};

export default function MemberPortalPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [data, setData] = useState<PortalData | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPortal() {
    const { data: portalData, error } = await supabase.rpc("get_member_portal", { p_token: token });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setData(portalData as PortalData);
    setLoading(false);
  }

  useEffect(() => {
    loadPortal();
  }, [token]);

  async function submit(status: "done" | "excused") {
    if (!data?.assignment?.id) return;

    const { error } = await supabase.rpc("complete_member_assignment", {
      p_token: token,
      p_assignment_id: data.assignment.id,
      p_status: status,
      p_note: note,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(status === "done" ? "جزاك الله خيرًا، تم تسجيل القراءة." : "تم تسجيل الاعتذار.");
    await loadPortal();
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-emerald-50 p-6">جاري التحميل...</main>;

  if (!data?.member) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Card className="w-full max-w-md text-center">
          <div className="text-5xl text-rose-600">×</div>
          <h1 className="mt-4 text-2xl font-black">الرابط غير صحيح</h1>
          <p className="mt-2 text-slate-600">{message || "لم نتمكن من العثور على هذا الرابط."}</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-5 text-slate-900">
      <div className="mx-auto max-w-md py-6">
        <Card className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-700 text-3xl text-white">▣</div>
          <p className="text-sm font-bold text-emerald-700">وردك اليوم</p>
          <h1 className="mt-2 text-3xl font-black">السلام عليكم يا {data.member.name}</h1>
          <p className="mt-3 leading-7 text-slate-600">{data.family.name}</p>

          {data.assignment ? (
            <>
              <div className="my-6 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">المطلوب اليوم</p>
                <p className="mt-2 text-2xl font-black text-emerald-900">{data.assignment.reading_text}</p>
                <p className="mt-2 text-sm text-slate-500">{data.plan?.name}</p>
              </div>

              <StatusPill status={data.assignment.status} />

              {data.assignment.status === "assigned" ? (
                <div className="mt-5 space-y-4">
                  <label className="block space-y-2 text-right">
                    <span className="text-sm font-semibold text-slate-700">ملاحظة اختيارية</span>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="اكتب ملاحظة للمسؤول لو حابب"
                      className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <Button onClick={() => submit("done")} className="w-full">✓ تمت القراءة</Button>
                  <Button variant="secondary" onClick={() => submit("excused")} className="w-full">◷ مش قادر أقرأ اليوم</Button>
                </div>
              ) : (
                <div className="mt-5 rounded-3xl bg-emerald-50 p-5">
                  <h2 className="text-xl font-black text-emerald-900">تم تسجيل حالتك بالفعل</h2>
                  <p className="mt-2 text-sm text-emerald-700">جزاك الله خيرًا.</p>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <h2 className="text-xl font-black">لا يوجد ورد حاليًا</h2>
              <p className="mt-2 text-sm text-slate-600">مسؤول العيلة لم يحدد وردًا نشطًا لك بعد.</p>
            </div>
          )}

          {message && <div className="mt-5 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">لا تحتاج لتسجيل دخول. هذا الرابط خاص بك فقط.</div>
        </Card>
      </div>
    </main>
  );
}
