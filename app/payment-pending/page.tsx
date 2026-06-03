"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input, Select } from "@/components/ui";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  ArrowRight,
  Send,
  RefreshCw,
  HelpCircle,
  LogOut,
} from "lucide-react";

type Family = {
  id: string;
  name: string;
  active: boolean;
  payment_status: string;
  owner_id: string;
};

type Payment = {
  id: string;
  family_id: string;
  user_id: string;
  method: string | null;
  reference: string | null;
  receipt_url: string | null;
  note: string | null;
  rejection_reason: string | null;
  status: string;
  submitted_at: string | null;
  created_at: string;
};

type PageState = "loading" | "pending" | "submitted" | "rejected" | "approved";

const paymentMethods = [
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "instapay", label: "InstaPay" },
  { value: "bank_transfer", label: "تحويل بنكي" },
];

export default function PaymentPendingPage() {
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [family, setFamily] = useState<Family | null>(null);
  const [latestPayment, setLatestPayment] = useState<Payment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("vodafone_cash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [optionalNote, setOptionalNote] = useState("");

  // Prevent double-submit across re-renders
  const submittingRef = useRef(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setPageState("loading");
    setFormError("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: familyData } = await supabase
      .from("families")
      .select("id, name, active, payment_status, owner_id")
      .eq("owner_id", userData.user.id)
      .maybeSingle();

    if (!familyData) {
      router.push("/setup");
      return;
    }

    setFamily(familyData);

    // Family is active — show success state
    if (familyData.active) {
      setPageState("approved");
      return;
    }

    // Load the latest payment for this family/user
    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .eq("family_id", familyData.id)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const payment = (paymentsData?.[0] as Payment) ?? null;
    setLatestPayment(payment);

    if (payment?.status === "submitted") {
      setPageState("submitted");
    } else if (payment?.status === "rejected") {
      setPageState("rejected");
      setPaymentMethod(payment.method || "vodafone_cash");
      setReferenceNumber(payment.reference || "");
      setOptionalNote(payment.note || "");
    } else {
      setPageState("pending");
    }
  }

  async function handleSubmitPayment(event: React.FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;

    setFormError("");
    setSuccessMessage("");

    if (!paymentMethod) {
      setFormError("يرجى اختيار طريقة الدفع.");
      return;
    }
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

    // Guard: if a submitted payment already exists, don't double-insert
    const { data: existingCheck } = await supabase
      .from("payments")
      .select("id, status")
      .eq("family_id", family.id)
      .eq("user_id", userData.user.id)
      .eq("status", "submitted")
      .maybeSingle();

    if (existingCheck) {
      setSubmitting(false);
      submittingRef.current = false;
      await loadPage();
      return;
    }

    const receiptValue = receiptFile ? receiptFile.name : null;

    const { error: paymentError } = await supabase.from("payments").insert({
      family_id: family.id,
      user_id: userData.user.id,
      method: paymentMethod,
      reference: referenceNumber.trim(),
      receipt_url: receiptValue,
      note: optionalNote.trim() || null,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });

    if (paymentError) {
      setFormError(paymentError.message);
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }

    await supabase
      .from("families")
      .update({ payment_status: "submitted" })
      .eq("id", family.id);

    setSuccessMessage("تم إرسال بيانات الدفع. سنقوم بمراجعتها في أقرب وقت.");
    setSubmitting(false);
    submittingRef.current = false;
    await loadPage();
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
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
          <Link href="/" className="text-3xl font-black text-emerald-900 hover:text-emerald-700 transition">
            ختمة عيلة
          </Link>
          {family?.name && (
            <p className="mt-1 text-sm font-semibold text-slate-400">{family.name}</p>
          )}
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* ── APPROVED ─────────────────────────────────────────────────────── */}
        {pageState === "approved" && (
          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-700" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">تم تفعيل حساب العيلة</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              يمكنك الآن البدء في تنظيم الختمة ومتابعة أفراد العيلة.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="mt-6 w-full">
              الدخول إلى لوحة التحكم
            </Button>
          </Card>
        )}

        {/* ── SUBMITTED ────────────────────────────────────────────────────── */}
        {pageState === "submitted" && (
          <div className="space-y-5">
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-800">طلب التفعيل قيد المراجعة</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                تم استلام بيانات الدفع، وسنقوم بمراجعتها في أقرب وقت.
              </p>
            </Card>

            {latestPayment && (
              <Card>
                <h2 className="mb-4 text-base font-black text-slate-700">ملخص بيانات الدفع</h2>
                <div className="space-y-2">
                  <InfoRow
                    label="طريقة الدفع"
                    value={
                      paymentMethods.find((m) => m.value === latestPayment.method)?.label ||
                      latestPayment.method ||
                      "—"
                    }
                  />
                  <InfoRow label="رقم العملية" value={latestPayment.reference || "—"} mono />
                  <InfoRow
                    label="تاريخ الإرسال"
                    value={new Date(
                      latestPayment.submitted_at || latestPayment.created_at
                    ).toLocaleDateString("ar-EG")}
                  />
                  <InfoRow
                    label="الحالة"
                    value={
                      <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-700">
                        قيد المراجعة
                      </span>
                    }
                  />
                </div>
              </Card>
            )}

            <Card className="border-amber-200/50 bg-amber-50/40 text-center">
              <p className="text-sm font-semibold leading-relaxed text-amber-800">
                شكرًا لدعمك للخدمة. جزء من الاشتراك يخرج كصدقة بإذن الله.
              </p>
            </Card>

            <Button onClick={loadPage} variant="secondary" className="w-full">
              <RefreshCw className="h-4 w-4" />
              تحديث الحالة
            </Button>
          </div>
        )}

        {/* ── REJECTED ─────────────────────────────────────────────────────── */}
        {pageState === "rejected" && (
          <div className="space-y-5">
            <Card className="border-rose-200 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                <AlertCircle className="h-8 w-8 text-rose-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-800">بيانات الدفع تحتاج مراجعة</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                برجاء التأكد من رقم العملية أو صورة الإيصال ثم إعادة الإرسال.
              </p>
              {latestPayment?.rejection_reason && (
                <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  سبب الرفض: {latestPayment.rejection_reason}
                </div>
              )}
            </Card>

            <PaymentForm
              title="إعادة إرسال بيانات الدفع"
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              referenceNumber={referenceNumber}
              setReferenceNumber={setReferenceNumber}
              receiptFile={receiptFile}
              setReceiptFile={setReceiptFile}
              optionalNote={optionalNote}
              setOptionalNote={setOptionalNote}
              submitting={submitting}
              formError={formError}
              onSubmit={handleSubmitPayment}
              submitLabel="إعادة إرسال بيانات الدفع"
            />
          </div>
        )}

        {/* ── PENDING ──────────────────────────────────────────────────────── */}
        {pageState === "pending" && (
          <div className="space-y-5">
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-800">
                حساب عيلتك بانتظار التفعيل
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                لتفعيل حساب العيلة، برجاء إرسال بيانات الدفع. الاشتراك رمزي لتغطية مصاريف
                التشغيل، وجزء من كل اشتراك يخرج كصدقة.
              </p>
            </Card>

            {/* Available payment methods */}
            <Card className="border-emerald-100/60 bg-emerald-50/30">
              <h2 className="mb-3 text-sm font-black text-emerald-800">طرق الدفع المتاحة</h2>
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

            <PaymentForm
              title="إرسال بيانات الدفع"
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              referenceNumber={referenceNumber}
              setReferenceNumber={setReferenceNumber}
              receiptFile={receiptFile}
              setReceiptFile={setReceiptFile}
              optionalNote={optionalNote}
              setOptionalNote={setOptionalNote}
              submitting={submitting}
              formError={formError}
              onSubmit={handleSubmitPayment}
              submitLabel="إرسال بيانات الدفع"
            />

            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-400 transition hover:text-slate-600"
            >
              <ArrowRight className="h-4 w-4" />
              الرجوع للصفحة الرئيسية
            </Link>
          </div>
        )}

        {/* Trust message — shown on all non-approved states */}
        {pageState !== "approved" && (
          <div className="mt-8 rounded-2xl border border-amber-200/50 bg-amber-50/50 px-5 py-4 text-center">
            <p className="text-xs font-semibold leading-relaxed text-amber-800">
              الاشتراك رمزي لتغطية مصاريف التشغيل، وجزء من كل اشتراك يخرج كصدقة.
            </p>
          </div>
        )}

        {/* Support */}
        {pageState !== "approved" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span>
              لو عندك مشكلة في الدفع أو التفعيل، تقدر تتواصل مع{" "}
              <a
                href="mailto:support@khatma-aaila.com"
                className="font-bold text-emerald-700 underline hover:text-emerald-800"
              >
                الدعم الفني
              </a>
            </span>
          </div>
        )}

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

        {/* Footer */}
        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
          هدفنا إن الخدمة تفضل بسيطة، مستقرة، وتساعد العائلات تكمل ختمتها براحة.
        </p>
      </div>
    </main>
  );
}

// ── Shared payment form ───────────────────────────────────────────────────────

type PaymentFormProps = {
  title: string;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  referenceNumber: string;
  setReferenceNumber: (v: string) => void;
  receiptFile: File | null;
  setReceiptFile: (f: File | null) => void;
  optionalNote: string;
  setOptionalNote: (v: string) => void;
  submitting: boolean;
  formError: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
};

function PaymentForm({
  title,
  paymentMethod,
  setPaymentMethod,
  referenceNumber,
  setReferenceNumber,
  receiptFile,
  setReceiptFile,
  optionalNote,
  setOptionalNote,
  submitting,
  formError,
  onSubmit,
  submitLabel,
}: PaymentFormProps) {
  return (
    <Card>
      <h2 className="mb-5 text-lg font-black text-slate-800">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <Select label="طريقة الدفع" value={paymentMethod} onChange={setPaymentMethod}>
          {paymentMethods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
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
          <span className="text-sm font-semibold text-slate-700">صورة إيصال الدفع</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 file:ml-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-emerald-700"
          />
          <p className="text-xs text-slate-400">اختياري — يمكنك إرفاق صورة الإيصال إن وجدت</p>
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

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              جاري الإرسال…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {submitLabel}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}

// ── Info row helper ───────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <span className={mono ? "font-mono text-xs text-slate-500" : "text-slate-500"}>{value}</span>
    </div>
  );
}
