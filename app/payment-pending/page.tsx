"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { supabase } from "@/lib/supabase";
import { Card, Input, Select } from "@/components/ui";
import { Heart, Send, ArrowRight, HelpCircle, LogOut } from "lucide-react";

type Family = {
  id: string;
  name: string;
  owner_id: string;
};

type PageState = "loading" | "form" | "thankyou";

const paymentMethods = [
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "instapay",      label: "InstaPay" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

export default function SupportPage() {
  const router = useRouter();

  const [pageState,       setPageState]       = useState<PageState>("loading");
  const [family,          setFamily]           = useState<Family | null>(null);
  const [submitting,      setSubmitting]       = useState(false);
  const [formError,       setFormError]        = useState("");
  const [paymentMethod,   setPaymentMethod]    = useState("vodafone_cash");
  const [referenceNumber, setReferenceNumber]  = useState("");
  const [receiptFile,     setReceiptFile]      = useState<File | null>(null);
  const [optionalNote,    setOptionalNote]     = useState("");

  const submittingRef = useRef(false);

  useEffect(() => { loadPage(); }, []);

  async function loadPage() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { router.push("/login"); return; }

    const { data: familyData } = await supabase
      .from("families")
      .select("id, name, owner_id")
      .eq("owner_id", userData.user.id)
      .maybeSingle();

    if (!familyData) { router.push("/setup"); return; }

    setFamily(familyData);
    setPageState("form");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;

    setFormError("");
    if (!referenceNumber.trim()) {
      setFormError("يرجى إدخال رقم العملية أو التحويل.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !family) {
      setFormError("حدث خطأ في التحقق من البيانات.");
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }

    const { error } = await supabase.from("payments").insert({
      family_id:    family.id,
      user_id:      userData.user.id,
      method:       paymentMethod,
      reference:    referenceNumber.trim(),
      receipt_url:  receiptFile ? receiptFile.name : null,
      note:         optionalNote.trim() || null,
      status:       "pending",
      submitted_at: new Date().toISOString(),
    });

    submittingRef.current = false;
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    track("support_donated", { method: paymentMethod });
    setPageState("thankyou");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF9F5] p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm font-bold text-slate-400">جاري التحميل…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5]" dir="rtl">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-black text-emerald-900 transition hover:text-emerald-700">
            ختمة عيلة
          </Link>
          {family?.name && (
            <p className="mt-1 text-sm font-semibold text-slate-400">{family.name}</p>
          )}
        </div>

        {/* ── Thank-you state ───────────────────────────────────────────────── */}
        {pageState === "thankyou" && (
          <div className="space-y-5">
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Heart className="h-8 w-8 fill-emerald-100 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black text-emerald-950">جزاكم الله خيراً 🤍</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                وصلنا دعمكم وهنراجعه في أقرب وقت.
                <br />
                تقبّل الله منكم.
              </p>
            </Card>

            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        )}

        {/* ── Form state ────────────────────────────────────────────────────── */}
        {pageState === "form" && (
          <div className="space-y-5">
            {/* Hero card */}
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Heart className="h-8 w-8 fill-emerald-100 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-800">
                ادعم استمرار ختمة عيلة
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                ختمة عيلة خدمة مجانية لكل العائلات.
                <br />
                بنشغّلها بتبرعات أهلها، وجزء من كل تبرع يخرج
                <br />
                كصدقة جارية بإذن الله.
              </p>
            </Card>

            {/* Payment methods */}
            <Card className="border-emerald-100/60 bg-emerald-50/30">
              <h2 className="mb-3 text-sm font-black text-emerald-800">طرق الدعم المتاحة</h2>
              <div className="space-y-2">
                {paymentMethods.map((m) => (
                  <div
                    key={m.value}
                    className="rounded-xl border border-emerald-100/60 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </Card>

            {/* Form */}
            <Card>
              <h2 className="mb-5 text-lg font-black text-slate-800">أرسل بيانات دعمك</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="طريقة الدعم" value={paymentMethod} onChange={setPaymentMethod}>
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Select>

                <Input
                  label="رقم العملية أو التحويل"
                  value={referenceNumber}
                  onChange={setReferenceNumber}
                  placeholder="مثال: 123456789"
                  required
                />

                <label className="block space-y-2 text-right">
                  <span className="text-sm font-semibold text-slate-700">صورة إيصال (اختياري)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 file:ml-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-emerald-700"
                  />
                </label>

                <Input
                  label="ملاحظة اختيارية"
                  value={optionalNote}
                  onChange={setOptionalNote}
                  placeholder="أي ملاحظة تريد إضافتها"
                />

                {formError && (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      جاري الإرسال…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      أرسل بيانات الدعم
                    </>
                  )}
                </button>
              </form>
            </Card>

            {/* Back to dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-400 transition hover:text-slate-600"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للوحة التحكم
            </Link>
          </div>
        )}

        {/* Trust message */}
        <div className="mt-8 rounded-2xl border border-amber-200/50 bg-amber-50/50 px-5 py-4 text-center">
          <p className="text-xs font-semibold leading-relaxed text-amber-800">
            جزء من كل تبرع يخرج كصدقة جارية بإذن الله 🤍
          </p>
        </div>

        {/* Support link */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>
            لو عندك أي استفسار تقدر تتواصل مع{" "}
            <a
              href="mailto:support@khatma-aaila.com"
              className="font-bold text-emerald-700 underline hover:text-emerald-800"
            >
              الدعم الفني
            </a>
          </span>
        </div>

        {/* Logout */}
        <div className="mt-4 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition hover:text-rose-500"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
          هدفنا إن الخدمة تفضل بسيطة ومستقرة وتساعد العائلات تكمل ختمتها.
        </p>
      </div>
    </main>
  );
}
