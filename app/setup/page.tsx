"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, Input } from "@/components/ui";
import {
  BookOpen,
  Heart,
  Sparkles,
  Users,
  Moon,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  UserPlus,
  Trash2,
} from "lucide-react";

// ── Purpose options ───────────────────────────────────────────────────────────
const PURPOSES = [
  { key: "family_ongoing", label: "ختمة عائلية مستمرة",          icon: Users,      desc: "توزيع يومي متتالي لختم القرآن باستمرار" },
  { key: "deceased",       label: "ختمة على روح متوفّى",          icon: Heart,      desc: "صدقة جارية ودعاء لروح فقيد غالٍ" },
  { key: "intention",      label: "ختمة بنية (شفاء / فرج / توفيق)", icon: Sparkles, desc: "ختم القرآن بنية خاصة لقضاء حاجة" },
  { key: "ramadan",        label: "ختمة رمضان",                   icon: Moon,       desc: "ورد مكثف وخاص بشهر رمضان المبارك" },
  { key: "other",          label: "أخرى — اكتب نيّتك",            icon: HelpCircle, desc: "اختر لتكتب نيتك بكلماتك الخاصة" },
] as const;

type PurposeKey = (typeof PURPOSES)[number]["key"];

// ── Pending member (local state only, before DB insert) ───────────────────────
type PendingMember = { tempId: string; name: string; phone: string };

function makeTempId() {
  return Math.random().toString(36).slice(2);
}

// ── Shared button primitive (avoids importing full Button for inline variants) ─
function Btn({
  children, onClick, disabled = false, variant = "primary", type = "button", className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles = {
    primary:   "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow shadow-emerald-950/10",
    secondary: "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50",
    ghost:     "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
    danger:    "border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OnboardingSetupPage() {
  const router   = useRouter();
  const nameRef  = useRef<HTMLInputElement>(null);

  // Auth
  const [userId,       setUserId]      = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [loading,      setLoading]     = useState(true);
  const [saving,       setSaving]      = useState(false);
  const [hasFamily,    setHasFamily]   = useState(false);
  const [savedFamily,  setSavedFamily] = useState("");
  const [error,        setError]       = useState("");

  // Wizard
  const [step, setStep] = useState(1);

  // Step-2 fields
  const [familyName,   setFamilyName]  = useState("");
  const [purposeKey,   setPurposeKey]  = useState<PurposeKey>("family_ongoing");
  const [purposeNote,  setPurposeNote] = useState("");

  // Step-3 fields
  const [members,       setMembers]      = useState<PendingMember[]>([]);
  const [selfAdded,     setSelfAdded]    = useState(false);
  const [newName,       setNewName]      = useState("");
  const [newPhone,      setNewPhone]     = useState("");
  const [memberError,   setMemberError]  = useState("");

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }

      setUserId(data.user.id);
      const meta     = data.user.user_metadata ?? {};
      const fullName = (meta.full_name as string | undefined) ?? "";
      setUserFullName(fullName);

      // Check if onboarding was already completed
      supabase.from("families").select("name, active").eq("owner_id", data.user.id).maybeSingle()
        .then(({ data: fam }) => {
          if (fam) { setHasFamily(true); setSavedFamily(fam.name ?? ""); }
          setLoading(false);
        });
    });
  }, [router]);

  // ── Member helpers ──────────────────────────────────────────────────────────
  function addSelf() {
    if (selfAdded) return;
    setMembers(prev => [...prev, { tempId: makeTempId(), name: userFullName || "أنت", phone: "" }]);
    setSelfAdded(true);
  }

  function addMember() {
    const trimmed = newName.trim();
    if (!trimmed) { setMemberError("يرجى كتابة اسم الفرد."); return; }
    setMembers(prev => [...prev, { tempId: makeTempId(), name: trimmed, phone: newPhone.trim() }]);
    setNewName("");
    setNewPhone("");
    setMemberError("");
    nameRef.current?.focus();
  }

  function removeMember(tempId: string) {
    const removed = members.find(m => m.tempId === tempId);
    setMembers(prev => prev.filter(m => m.tempId !== tempId));
    // Allow re-adding self if they remove themselves
    if (removed && removed.name === (userFullName || "أنت")) setSelfAdded(false);
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  function next() {
    setError("");

    if (step === 2 && !familyName.trim()) {
      setError("يرجى كتابة اسم العيلة.");
      return;
    }
    if (step === 3 && members.length === 0) {
      setError("يرجى إضافة فرد واحد على الأقل.");
      return;
    }
    setStep(s => s + 1);
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (members.length === 0) { setError("يرجى إضافة فرد واحد على الأقل."); return; }
    setError("");
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);

    try {
      // 1. Create family
      const { data: fam, error: famErr } = await supabase
        .from("families")
        .insert({ owner_id: userId, name: familyName.trim(), payment_status: "paid", active: true })
        .select("id").single();
      if (famErr || !fam) throw new Error(famErr?.message ?? "لم يتم إنشاء العيلة");

      // 2. Insert members in order, collect IDs
      const memberIds: string[] = [];
      for (const m of members) {
        const { data: mem, error: memErr } = await supabase
          .from("members")
          .insert({ family_id: fam.id, name: m.name.trim(), phone: m.phone || null, level: "صفحة يوميًا" })
          .select("id").single();
        if (memErr || !mem) throw new Error(memErr?.message ?? `لم يتم إضافة الفرد: ${m.name}`);
        memberIds.push(mem.id);
      }

      // 3. Create plan with purpose
      const { data: plan, error: planErr } = await supabase
        .from("plans")
        .insert({
          family_id:    fam.id,
          name:         `ختمة ${familyName.trim()}`,
          type:         "توزيع بالصفحات",
          method:       "توزيع تلقائي",
          start_date:   today,
          active:       true,
          purpose:      purposeKey,
          purpose_note: purposeKey === "other" ? (purposeNote.trim() || null) : null,
        })
        .select("id").single();
      if (planErr || !plan) throw new Error(planErr?.message ?? "لم يتم إنشاء الختمة");

      // 4. Create first ward: one page per member
      const rows = memberIds.map((memberId, i) => ({
        plan_id:      plan.id,
        member_id:    memberId,
        reading_text: `صفحة ${i + 1}`,
        due_date:     today,
        status:       "assigned",
        start_page:   i + 1,
        end_page:     i + 1,
      }));
      const { error: assignErr } = await supabase.from("assignments").insert(rows);
      if (assignErr) throw new Error(assignErr.message);

      // 5. Stamp last_ward_date so lazy transition won't duplicate today's ward
      await supabase.from("families").update({ last_ward_date: today }).eq("id", fam.id);

      // 6. Flag onboarding done in auth metadata
      await supabase.auth.updateUser({
        data: { onboarding_completed: true, khatma_purpose: purposeKey, setup_step: 4 },
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى.");
      setSaving(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-islamic-grid p-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="text-sm font-bold text-slate-500">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  // ── Already done ─────────────────────────────────────────────────────────────
  if (hasFamily) {
    return (
      <main className="grid min-h-screen place-items-center bg-islamic-grid p-4 font-sans" dir="rtl">
        <Card className="w-full max-w-md p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-9 w-9 text-emerald-700" />
          </div>
          <h1 className="text-xl font-black text-slate-800">إعداداتك مكتملة!</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            عيلة{" "}
            <span className="font-bold text-emerald-800">"{savedFamily}"</span>{" "}
            جاهزة، يمكنك الدخول للوحة التحكم.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-700 py-3.5 text-sm font-bold text-white shadow transition hover:from-emerald-700 hover:to-emerald-800"
          >
            الذهاب للوحة التحكم
          </button>
        </Card>
      </main>
    );
  }

  const selectedPurpose = PURPOSES.find(p => p.key === purposeKey) ?? PURPOSES[0];
  const TOTAL_STEPS = 4;

  // ── Wizard ───────────────────────────────────────────────────────────────────
  return (
    <main
      className="grid min-h-screen place-items-center bg-islamic-grid p-4 sm:p-6 font-sans antialiased"
      dir="rtl"
    >
      <Card className="relative flex w-full max-w-2xl flex-col overflow-hidden border border-slate-200/60 p-6 shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-xl" />

        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">
            {step} / {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-emerald-950">إعداد الختمة الأولى</span>
            <BookOpen className="h-4 w-4 text-emerald-700" />
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-8 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 === step ? "scale-y-125 bg-emerald-700" :
                i + 1 < step  ? "bg-emerald-700/40" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 1 — WELCOME
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 py-4 text-center duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-50 to-emerald-100 shadow-inner">
              <Sparkles className="h-8 w-8 animate-pulse text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
                أهلاً بك في ختمة عيلة 🕊️
              </h2>
              <p className="mx-auto max-w-sm text-sm font-medium leading-relaxed text-slate-500">
                سنساعدك على إعداد أول ختمة لعيلتك في ثلاث خطوات بسيطة.
              </p>
            </div>
            <div className="mx-auto max-w-sm rounded-2xl border border-slate-100 bg-slate-50 p-4 text-right">
              <p className="text-xs font-semibold leading-relaxed text-slate-500">
                ستختار اسم العيلة ونية الختمة، ثم تضيف الأفراد — وبعدها الختمة جاهزة للجميع.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 2 — اسم العيلة + نية الختمة
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
            <div>
              <h2 className="text-xl font-black text-slate-800 sm:text-2xl">الختمة</h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">اسم العيلة + نية الختمة الأولى</p>
            </div>

            <Input
              label="اسم العيلة أو مجموعة القراءة"
              value={familyName}
              onChange={setFamilyName}
              placeholder="مثال: عيلة الحاج محمود"
              required
            />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">نية الختمة</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PURPOSES.map(p => {
                  const Icon = p.icon;
                  const sel  = purposeKey === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPurposeKey(p.key)}
                      className={`flex items-start gap-3 rounded-2xl border p-3 text-right transition hover:border-emerald-300 ${
                        sel ? "border-emerald-700 bg-emerald-50/40 shadow-sm" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                        sel ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{p.label}</p>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-400">{p.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {purposeKey === "other" && (
              <div className="animate-in fade-in duration-200">
                <Input
                  label="اكتب نيّتك"
                  value={purposeNote}
                  onChange={setPurposeNote}
                  placeholder="مثال: ختمة شكر لله على نعمة..."
                />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 3 — أفراد العيلة
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300">
            <div>
              <h2 className="text-xl font-black text-slate-800 sm:text-2xl">أفراد العيلة</h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                أضف من سيشاركون في الختمة — سيأخذ كل فرد ورده تلقائياً.
              </p>
            </div>

            {/* "أنا الفرد الأول" quick-add */}
            {!selfAdded && (
              <button
                type="button"
                onClick={addSelf}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4 text-right transition hover:border-emerald-500 hover:bg-emerald-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-800">أنا الفرد الأول من العيلة</p>
                  <p className="text-xs font-medium text-emerald-600">
                    أضف نفسك ({userFullName || "باسمك في الحساب"})
                  </p>
                </div>
              </button>
            )}

            {/* Add-member form */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="mb-3 text-xs font-bold text-slate-500">أضف فرداً آخر</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  ref={nameRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMember())}
                  placeholder="الاسم الكامل"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-right text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addMember())}
                  placeholder="واتساب (اختياري)"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-right text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-36"
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-95"
                >
                  + أضف
                </button>
              </div>
              {memberError && (
                <p className="mt-2 text-xs font-bold text-rose-600">{memberError}</p>
              )}
            </div>

            {/* Members list */}
            {members.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500">
                  الأفراد المضافون ({members.length}){" "}
                  <span className="font-medium text-slate-400">— كل فرد سيأخذ صفحة في اليوم الأول</span>
                </p>
                {members.map((m, idx) => (
                  <div
                    key={m.tempId}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <span className="w-5 text-center text-xs font-black text-slate-300">{idx + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{m.name}</p>
                      {m.phone && <p className="text-xs text-slate-400">{m.phone}</p>}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      صفحة {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.tempId)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-6 text-center">
                <p className="text-sm font-semibold text-slate-400">لا يوجد أفراد بعد — أضف واحداً على الأقل</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 4 — ملخص + submit
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300">
            <div>
              <h2 className="text-xl font-black text-slate-800 sm:text-2xl">ختمتك جاهزة!</h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">راجع البيانات ثم اضغط "ابدأ الختمة".</p>
            </div>

            {/* Summary card */}
            <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
              <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-700" />
                <span className="text-sm font-black text-emerald-900">ملخص الختمة</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{familyName}</span>
                  <span className="text-xs font-semibold text-slate-400">اسم العيلة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {selectedPurpose.label}
                    {purposeKey === "other" && purposeNote && ` — ${purposeNote}`}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">النية</span>
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {members.map((m, i) => (
                      <p key={m.tempId} className="font-bold text-slate-800">
                        {m.name}{" "}
                        <span className="font-normal text-emerald-600 text-xs">(صفحة {i + 1})</span>
                      </p>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">الأفراد</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold leading-relaxed text-slate-500">
                سيحصل كل فرد على رابط خاص لتأكيد قراءته. يمكنك إضافة المزيد من الأفراد بعد الإنشاء.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          {/* Back */}
          {step > 1 ? (
            <Btn variant="ghost" onClick={() => { setError(""); setStep(s => s - 1); }} disabled={saving}>
              <ArrowRight className="h-4 w-4" />
              السابق
            </Btn>
          ) : <div />}

          {/* Next / Submit */}
          {step < TOTAL_STEPS ? (
            <Btn variant="primary" onClick={next} className="px-6 py-3 text-xs">
              التالي
              <ArrowLeft className="h-4 w-4" />
            </Btn>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-xs font-bold text-white shadow shadow-emerald-950/15 transition hover:from-emerald-700 hover:to-emerald-800 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  جاري إنشاء الختمة...
                </>
              ) : (
                <>
                  ابدأ الختمة 🕌
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </main>
  );
}
