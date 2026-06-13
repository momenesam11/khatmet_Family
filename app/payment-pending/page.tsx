"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { supabase } from "@/lib/supabase";
import { Input, Select } from "@/components/ui";
import {
  Heart, Send, ArrowRight, LogOut,
  Copy, Check, Smartphone, CreditCard,
  Building2, ChevronLeft,
} from "lucide-react";

type Family   = { id: string; name: string; owner_id: string };
type PageState = "loading" | "form" | "thankyou";

const RECIPIENT_PHONE      = "01021179969";
const RECIPIENT_PHONE_INTL = "201021179969";
const RECIPIENT_NAME       = "مؤمن ع*** ع***";

type MethodKey = "vodafone_cash" | "instapay" | "bank_transfer";

const METHODS: {
  key: MethodKey;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  steps: string[];
  link?: string;
  linkLabel?: string;
}[] = [
  {
    key: "vodafone_cash",
    label: "Vodafone Cash",
    sublabel: "تحويل فوري من محفظة فودافون",
    icon: <Smartphone className="h-5 w-5" />,
    accent: "border-red-200 bg-red-50",
    iconBg: "bg-red-100 text-red-600",
    steps: [
      `افتح My Vodafone أو اتصل بـ *9*${RECIPIENT_PHONE}#`,
      "اختر «تحويل» ← «محفظة فودافون كاش»",
      `أدخل الرقم ${RECIPIENT_PHONE} ثم أدخل المبلغ`,
      "اضغط تأكيد واحفظ رقم العملية",
    ],
  },
  {
    key: "instapay",
    label: "InstaPay",
    sublabel: "تحويل من أي بنك أو محفظة",
    icon: <CreditCard className="h-5 w-5" />,
    accent: "border-blue-200 bg-blue-50",
    iconBg: "bg-blue-100 text-blue-600",
    steps: [
      "افتح تطبيق InstaPay أو تطبيق بنكك",
      `اضغط «تحويل» وأدخل رقم الهاتف ${RECIPIENT_PHONE}`,
      `تأكد من اسم المستلم: ${RECIPIENT_NAME}`,
      "أدخل المبلغ، أكد التحويل واحفظ رقم المرجع",
    ],
    link: `https://ipn.eg/S/${RECIPIENT_PHONE_INTL}`,
    linkLabel: "ادفع عبر InstaPay مباشرة",
  },
  {
    key: "bank_transfer",
    label: "تحويل بنكي",
    sublabel: "من أي بنك عبر الإنترنت",
    icon: <Building2 className="h-5 w-5" />,
    accent: "border-emerald-200 bg-emerald-50",
    iconBg: "bg-emerald-100 text-emerald-700",
    steps: [
      "افتح تطبيق بنكك الإلكتروني",
      `اختر «تحويل» وأدخل رقم الهاتف ${RECIPIENT_PHONE} (IPN)`,
      `تأكد من اسم المستلم: ${RECIPIENT_NAME}`,
      "أتم التحويل واحفظ الإيصال",
    ],
  },
];

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function doCopy() {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3">
      <button
        type="button"
        onClick={doCopy}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
          copied
            ? "border-emerald-200 bg-emerald-50 text-emerald-600 scale-110"
            : "border-slate-200 bg-slate-50 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
        }`}
        title="نسخ"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <div className="flex-1 text-right">
        <p className="text-[10px] font-bold text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-wide">{value}</p>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const router     = useRouter();
  const [pageState,       setPageState]       = useState<PageState>("loading");
  const [family,          setFamily]           = useState<Family | null>(null);
  const [activeMethod,    setActiveMethod]     = useState<MethodKey>("vodafone_cash");
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
    const { data: familyData } = await supabase.from("families").select("id, name, owner_id").eq("owner_id", userData.user.id).maybeSingle();
    if (!familyData) { router.push("/setup"); return; }
    setFamily(familyData);
    setPageState("form");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;
    setFormError("");
    if (!referenceNumber.trim()) { setFormError("يرجى إدخال رقم العملية أو التحويل."); return; }
    submittingRef.current = true;
    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user || !family) {
      setFormError("حدث خطأ في التحقق من البيانات.");
      setSubmitting(false); submittingRef.current = false; return;
    }
    const { error } = await supabase.from("payments").insert({
      family_id: family.id, user_id: userData.user.id, method: paymentMethod,
      reference: referenceNumber.trim(), receipt_url: receiptFile ? receiptFile.name : null,
      note: optionalNote.trim() || null, status: "pending",
      submitted_at: new Date().toISOString(),
    });
    submittingRef.current = false;
    setSubmitting(false);
    if (error) { setFormError(error.message); return; }
    track("support_donated", { method: paymentMethod });
    setPageState("thankyou");
  }

  async function handleLogout() { await supabase.auth.signOut(); router.push("/login"); }

  if (pageState === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="text-sm font-bold text-slate-400">جاري التحميل…</p>
        </div>
      </main>
    );
  }

  const selectedMethod = METHODS.find((m) => m.key === activeMethod)!;

  return (
    <main className="min-h-screen bg-[#FAF9F5]" dir="rtl">

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/60 bg-white/90 backdrop-blur-sm px-4 py-3">
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition">
          <LogOut className="h-4 w-4" /> خروج
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ختمة عيلة" className="h-8 w-8 object-contain" />
          <span className="text-sm font-black text-emerald-900">ختمة عيلة</span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-700 transition">
          الداشبورد <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </header>

      {pageState === "thankyou" && (
        <div className="mx-auto max-w-md px-4 py-16 text-center space-y-6" style={{ animation: "fade-up 0.35s ease-out" }}>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100"
            style={{ animation: "glow-pulse 2s ease-in-out infinite" }}>
            <Heart className="h-12 w-12 fill-emerald-200 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-emerald-950">جزاكم الله خيراً</h1>
            <p className="text-slate-500 font-medium leading-relaxed">وصلنا دعمكم وهنراجعه في أقرب وقت.<br />تقبّل الله منكم وجعله في ميزان حسناتكم.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">جزء من تبرعكم سيخرج صدقة جارية بإذن الله</p>
          </div>
          <Link href="/dashboard" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-sm font-bold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-800">
            العودة للوحة التحكم
          </Link>
        </div>
      )}

      {pageState === "form" && (
        <div className="mx-auto max-w-lg px-4 py-8 space-y-6" style={{ animation: "fade-up 0.25s ease-out" }}>

          {/* Hero section */}
          <div className="text-center space-y-3 py-4">
            <img src="/logo.png" alt="ختمة عيلة" className="h-20 w-20 object-contain mx-auto" style={{ animation: "float-gentle 5s ease-in-out infinite" }} />
            <div>
              <h1 className="text-2xl font-black text-emerald-950">ادعم استمرار ختمة عيلة</h1>
              <p className="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                خدمة مجانية تماماً — بتشتغل بتبرعات أهلها<br />
                جزء من كل تبرع يخرج صدقة جارية بإذن الله
              </p>
            </div>
          </div>

          {/* Method selector tabs */}
          <div>
            <p className="text-xs font-black text-slate-400 mb-3 px-1">اختر طريقة التحويل</p>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => { setActiveMethod(m.key); setPaymentMethod(m.key); }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all duration-200 ${
                    activeMethod === m.key
                      ? "border-emerald-300 bg-emerald-50 shadow-sm scale-[1.02]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeMethod === m.key ? m.iconBg : "bg-slate-100 text-slate-400"} transition-colors`}>
                    {m.icon}
                  </div>
                  <span className={`text-[11px] font-black leading-tight ${activeMethod === m.key ? "text-emerald-800" : "text-slate-500"}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected method details */}
          <div className={`rounded-3xl border ${selectedMethod.accent} overflow-hidden`} style={{ animation: "fade-up 0.2s ease-out" }} key={activeMethod}>

            {/* Method header */}
            <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/60">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${selectedMethod.iconBg}`}>
                {selectedMethod.icon}
              </div>
              <div>
                <p className="font-black text-slate-800">{selectedMethod.label}</p>
                <p className="text-xs font-medium text-slate-500">{selectedMethod.sublabel}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Recipient info */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">بيانات المستلم</p>
                <CopyField label="رقم الهاتف / المحفظة" value={RECIPIENT_PHONE} />
                <CopyField label="اسم المستلم" value={RECIPIENT_NAME} />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">خطوات التحويل</p>
                <div className="space-y-2">
                  {selectedMethod.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-white/70 px-3.5 py-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-black text-white">
                        {i + 1}
                      </span>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep link */}
              {selectedMethod.link && (
                <a href={selectedMethod.link} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-bold text-white shadow-sm transition active:scale-95">
                  <Smartphone className="h-4 w-4" />
                  {selectedMethod.linkLabel}
                </a>
              )}
            </div>
          </div>

          {/* Confirmation form */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-800">سجّل بيانات تحويلك</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">بعد الإتمام أرسل رقم العملية لنتأكد</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">طريقة الدعم</label>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => (
                    <button key={m.key} type="button" onClick={() => setPaymentMethod(m.key)}
                      className={`rounded-xl border py-2 text-[11px] font-bold transition ${
                        paymentMethod === m.key
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">رقم العملية أو المرجع <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="مثال: 123456789"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">صورة إيصال <span className="text-slate-400">(اختياري)</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition file:ml-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-emerald-700"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">ملاحظة <span className="text-slate-400">(اختياري)</span></label>
                <input
                  type="text"
                  value={optionalNote}
                  onChange={(e) => setOptionalNote(e.target.value)}
                  placeholder="أي ملاحظة تريد إضافتها"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition"
                />
              </div>

              {formError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{formError}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-sm font-bold text-white shadow-md shadow-emerald-900/15 transition hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> جاري الإرسال…</>
                  : <><Send className="h-4 w-4" /> أرسل بيانات الدعم</>}
              </button>
            </form>
          </div>

          {/* Charity note */}
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 px-5 py-4 flex items-center gap-3">
            <Heart className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed text-amber-800">
              جزء من كل تبرع يخرج كصدقة جارية بإذن الله — هدفنا إن الخدمة تفضل مجانية ومستقرة.
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 pb-4">
            لأي استفسار:{" "}
            <a href="mailto:support@khatma-aaila.com" className="font-bold text-emerald-700 underline hover:text-emerald-800">
              support@khatma-aaila.com
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
