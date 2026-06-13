"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input, MiniInfo, Progress, Select, StatusPill } from "@/components/ui";
import { StatsBar } from "@/components/StatsBar";
import { KhatmaGrid } from "@/components/KhatmaGrid";
import { MemberCards } from "@/components/MemberCards";
import { WardShareCard } from "@/components/WardShareCard";
import { MemberProfileDrawer } from "@/components/MemberProfileDrawer";
import { KhatmaHistoryTab } from "@/components/KhatmaHistoryTab";
import { KhatmaShareCard, getDua } from "@/components/KhatmaShareCard";
import { toPng } from "html-to-image";
import {
  Home,
  Users,
  ListChecks,
  MessageCircle,
  BookOpen,
  MoreVertical,
  X,
  Eye,
  Link2,
  Send,
  Copy,
  CheckCircle2,
  Clock,
  UserX,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Heart,
  ChevronLeft,
  Bell,
} from "lucide-react";

type Family = {
  id: string;
  name: string;
  active: boolean;
  payment_status: string;
  owner_id: string;
  current_start_page: number;
  current_round: number;
  khatmas_completed: number;
  last_ward_date: string | null;
  created_at: string;
};

type CharityPayment = { id: string; created_at: string; note: string | null };
type Member = { id: string; name: string; phone: string | null; level: string; access_token: string; family_id: string };
type Plan = { id: string; name: string; start_date: string; end_date: string; type: string; method: string; active: boolean; family_id: string; purpose: string | null; purpose_note: string | null };
type Assignment = {
  id: string;
  member_id?: string;
  start_page?: number | null;
  end_page?: number | null;
  reading_text: string;
  due_date: string;
  status: string;
  note: string | null;
  completed_at: string | null;
  members?: { name: string; phone: string | null; access_token: string } | null;
};

function getMemberLink(token: string) {
  return `${window.location.origin}/member/${token}`;
}

// ── Khatma Completion Modal ──────────────────────────────────────────────────

const PURPOSES_MODAL = [
  { key: "family_ongoing", label: "ختمة عائلية مستمرة" },
  { key: "deceased",       label: "ختمة على روح متوفّى" },
  { key: "intention",      label: "ختمة بنية (شفاء / فرج / توفيق)" },
  { key: "ramadan",        label: "ختمة رمضان" },
  { key: "other",          label: "أخرى — اكتب نيّتك" },
] as const;

type ModalPurposeKey = (typeof PURPOSES_MODAL)[number]["key"];

const MAIN_DUA = "اللهم ارحمنا بالقرآن واجعله لنا إماماً ونوراً وهدى ورحمة";

function KhatmaCompletionModal({
  khatmaNumber, familyName, purpose, purposeNote, activePlanId, onClose,
}: {
  khatmaNumber: number; familyName: string; purpose?: string | null;
  purposeNote?: string | null; activePlanId?: string | null; onClose: () => void;
}) {
  const [phase, setPhase] = useState<"celebration" | "share" | "intention">("celebration");
  const [newPurpose, setNewPurpose] = useState<ModalPurposeKey>("family_ongoing");
  const [newPurposeNote, setNewPurposeNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const extraDua = getDua(purpose, purposeNote);

  async function handleSaveImage() {
    if (!shareCardRef.current) return;
    setCapturing(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 3, style: { direction: "rtl" } });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `ختمة-${familyName}-${khatmaNumber}.png`, { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: `ختمة عيلة ${familyName} رقم ${khatmaNumber}`, text: "بسم الله، اكتملت ختمتنا — ختمة عيلة 🤍", files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = `ختمة-${familyName}-${khatmaNumber}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) { console.error("share error", err); }
    finally { setCapturing(false); }
  }

  async function saveNewIntention() {
    if (!activePlanId) { onClose(); return; }
    setSaving(true);
    await supabase.from("plans").update({
      purpose: newPurpose,
      purpose_note: newPurpose === "deceased" || newPurpose === "other" ? newPurposeNote.trim() || null : null,
    }).eq("id", activePlanId);
    setSaving(false);
    onClose();
  }

  if (phase === "celebration") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" dir="rtl">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ animation: "fade-up 0.3s ease-out" }}>
          <div className="h-1.5 bg-linear-to-r from-emerald-500 to-emerald-700" />
          <div className="space-y-5 p-5 text-center sm:p-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-4xl">🕌</div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-emerald-950">مبروك! عيلتكم ختمت القرآن 🤍</h2>
              <p className="text-sm font-semibold text-emerald-700">تقبّل الله منكم، وجعله في ميزان حسناتكم.</p>
              <p className="text-xs font-medium text-slate-400">الختمة رقم {khatmaNumber} لعيلة {familyName}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-right">
              <p className="text-[11px] font-bold text-slate-500 mb-1">دعاء الختم</p>
              <p className="text-sm font-semibold leading-relaxed text-emerald-900">{MAIN_DUA}</p>
            </div>
            {extraDua && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-right">
                <p className="text-[11px] font-bold text-slate-500 mb-1">دعاء النية</p>
                <p className="text-sm font-semibold leading-relaxed text-amber-900">{extraDua}</p>
              </div>
            )}
            <div className="space-y-2.5 pt-1">
              <button onClick={() => setPhase("share")} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800">
                🎉 شارك الإنجاز
              </button>
              <Link href="/payment-pending" className="flex w-full items-center justify-center rounded-2xl border border-emerald-200 bg-white px-6 py-3.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
                ادعم المشروع
              </Link>
              <button onClick={onClose} className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">
                تمام، شكراً 🤍
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "share") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" dir="rtl">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ animation: "fade-up 0.3s ease-out" }}>
          <div className="h-1.5 bg-linear-to-r from-emerald-500 to-emerald-700" />
          <div className="space-y-5 p-5 sm:p-6">
            <div className="text-center">
              <h2 className="text-lg font-black text-slate-800">بطاقة الإنجاز</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-400">احفظها وشاركها مع العيلة على واتساب 📲</p>
            </div>
            <div className="flex justify-center overflow-x-auto rounded-2xl bg-slate-100 p-3">
              <KhatmaShareCard ref={shareCardRef} familyName={familyName} khatmaNumber={khatmaNumber} purpose={purpose} purposeNote={purposeNote} />
            </div>
            <div className="space-y-2.5">
              <button onClick={handleSaveImage} disabled={capturing} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50">
                {capturing ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />جاري التصدير...</>) : "📥 حفظ ومشاركة"}
              </button>
              <button onClick={() => setPhase("intention")} className="w-full rounded-2xl border border-emerald-200 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
                اختر نية الختمة الجديدة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" style={{ animation: "fade-up 0.3s ease-out" }}>
        <div className="h-1.5 bg-linear-to-r from-emerald-500 to-emerald-700" />
        <div className="space-y-5 p-5 sm:p-8">
          <div className="text-center">
            <h2 className="text-lg font-black text-slate-800">ما نية ختمتكم القادمة؟</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-400">اختر النية وسنذكّركم بها في كل ورد.</p>
          </div>
          <div className="grid gap-2">
            {PURPOSES_MODAL.map((p) => {
              const sel = newPurpose === p.key;
              return (
                <button key={p.key} type="button" onClick={() => setNewPurpose(p.key)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-right text-sm font-bold transition ${sel ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"}`}>
                  <span className={`h-4 w-4 shrink-0 rounded-full border-2 ${sel ? "border-emerald-700 bg-emerald-700" : "border-slate-300"}`} />
                  {p.label}
                </button>
              );
            })}
          </div>
          {(newPurpose === "deceased" || newPurpose === "other") && (
            <div className="animate-in fade-in duration-200">
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                {newPurpose === "deceased" ? "اسم المتوفّى (اختياري)" : "اكتب نيّتك"}
              </label>
              <input type="text" value={newPurposeNote} onChange={(e) => setNewPurposeNote(e.target.value)}
                placeholder={newPurpose === "deceased" ? "مثال: الحاج أحمد محمود" : "مثال: ختمة شكر لله على نعمة..."}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-right text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </div>
          )}
          <div className="space-y-2.5 pt-1">
            <button onClick={saveNewIntention} disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50">
              {saving ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />جاري الحفظ...</>) : "حفظ النية"}
            </button>
            <button onClick={onClose} className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">لاحقاً</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberLevel, setMemberLevel] = useState("صفحة يوميًا");
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedKhatmaNumber, setCompletedKhatmaNumber] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showSupportBanner, setShowSupportBanner] = useState(false);
  const [initError, setInitError] = useState(false);
  const [charityPayments, setCharityPayments] = useState<CharityPayment[]>([]);
  const [charityLoading, setCharityLoading] = useState(false);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);

  const activePlan = plans[0] || null;
  const completedCount = assignments.filter((a) => a.status === "done").length;
  const excusedCount = assignments.filter((a) => a.status === "excused").length;
  const delayedCount = Math.max(0, assignments.length - completedCount - excusedCount);
  const progress = Math.round((completedCount / Math.max(assignments.length, 1)) * 100);
  const overallProgress = Math.round((completedCount / 604) * 100);

  let encourageMessage = "";
  if (overallProgress < 25)      encourageMessage = "بداية موفقة، بارك الله في عيلتكم 🤍";
  else if (overallProgress < 50) encourageMessage = "في المنتصف، ربنا يتمم عليكم ويتقبل منكم 🙌";
  else if (overallProgress <= 75) encourageMessage = "أكثر من النص، ربنا يكمّل همّتكم بالخير ✨";
  else                            encourageMessage = "قاربتم على الختم، بشراكم وعقبال الختمات الجاية 🎉";

  useEffect(() => {
    async function init() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) { router.push("/login"); return; }
        setUserId(data.user.id);

        const { data: familyData } = await supabase.from("families").select("*").eq("owner_id", data.user.id).maybeSingle();
        if (!familyData) { router.push("/setup"); return; }

        const { data: profileData } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        if (profileData) setUserRole(profileData.role);

        setFamily(familyData);
        await Promise.all([loadMembers(familyData.id), loadPlans(familyData.id)]);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isOldEnough = familyData.created_at < sevenDaysAgo.toISOString();
        const dismissed = typeof window !== "undefined" && !!localStorage.getItem("support_banner_dismissed");
        if (isOldEnough && !dismissed) {
          const { count: paymentCount } = await supabase.from("payments").select("id", { count: "exact", head: true }).eq("user_id", data.user.id);
          if ((paymentCount ?? 0) === 0) setShowSupportBanner(true);
        }

        setCharityLoading(true);
        const { data: charityData } = await supabase.from("payments").select("id, created_at, note").eq("status", "approved").order("created_at", { ascending: false }).limit(5);
        setCharityPayments((charityData as CharityPayment[]) ?? []);
        setCharityLoading(false);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard init error:", error);
        setLoading(false);
        setInitError(true);
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!activePlan?.id) return;
    const planId = activePlan.id;
    const timer = setInterval(() => loadAssignments(planId), 30_000);
    return () => clearInterval(timer);
  }, [activePlan?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadFamily(currentUserId = userId) {
    const { data: familyData } = await supabase.from("families").select("*").eq("owner_id", currentUserId).maybeSingle();
    setFamily(familyData);
    if (familyData) await Promise.all([loadMembers(familyData.id), loadPlans(familyData.id)]);
  }

  async function loadMembers(familyId: string) {
    const { data } = await supabase.from("members").select("*").eq("family_id", familyId).order("created_at", { ascending: false });
    setMembers(data || []);
  }

  async function loadPlans(familyId: string) {
    const { data } = await supabase.from("plans").select("*").eq("family_id", familyId).eq("active", true).order("created_at", { ascending: false });
    setPlans(data || []);
    if (data && data[0]) await loadAssignments(data[0].id);
    else setAssignments([]);
  }

  async function loadAssignments(planId: string) {
    const { data } = await supabase.from("assignments")
      .select("id, member_id, start_page, end_page, reading_text, due_date, status, note, completed_at, members(name, phone, access_token)")
      .eq("plan_id", planId).order("created_at", { ascending: true });

    type AssignmentFromSupabase = Omit<Assignment, "members"> & {
      members?: { name: string; phone: string | null; access_token: string } | { name: string; phone: string | null; access_token: string }[] | null;
    };
    const normalized = ((data ?? []) as unknown as AssignmentFromSupabase[]).map((item) => ({
      ...item,
      members: Array.isArray(item.members) ? item.members[0] ?? null : item.members ?? null,
    }));
    setAssignments(normalized);
  }

  async function addMember(event: FormEvent) {
    event.preventDefault();
    if (!family) return;
    const { data: newMember, error } = await supabase.from("members").insert({ family_id: family.id, name: memberName, phone: memberPhone || null, level: memberLevel }).select("id").single();
    if (error) { setMessage(error.message); return; }
    if (activePlan && newMember) {
      await supabase.rpc("assign_ward_to_member", { p_member_id: newMember.id });
      await loadAssignments(activePlan.id);
    }
    setMemberName(""); setMemberPhone(""); setMemberLevel("صفحة يوميًا");
    await loadMembers(family.id);
  }

  async function createDefaultPlan() {
    if (!family || members.length === 0 || plans.length > 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const { data: planData, error: planError } = await supabase.from("plans").insert({ family_id: family.id, name: `ختمة ${family.name}`, type: "توزيع بالصفحات", method: "توزيع تلقائي", start_date: today, active: true }).select("*").single();
    if (planError || !planData) { setMessage(planError?.message || "لم يتم إنشاء الختمة"); return; }
    const startPage = family.current_start_page || 1;
    const rows = members.map((member, index) => ({ plan_id: planData.id, member_id: member.id, reading_text: `صفحة ${startPage + index}`, due_date: today, status: "assigned", start_page: startPage + index, end_page: startPage + index }));
    const { error: assignError } = await supabase.from("assignments").insert(rows);
    if (assignError) { setMessage(assignError.message); return; }
    await supabase.from("families").update({ last_ward_date: today }).eq("id", family.id);
    await loadPlans(family.id);
    setActiveTab("tracking");
  }

  async function updateAssignment(id: string, status: "done" | "excused" | "assigned") {
    if (!activePlan) return;
    await supabase.from("assignments").update({ status, completed_at: status === "done" ? new Date().toISOString() : null }).eq("id", id);
    await loadAssignments(activePlan.id);
  }

  async function finishCurrentWardAndCreateNew() {
    if (!family || !activePlan || members.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const pagesPerWard = members.length;
    const currentStart = family.current_start_page || 1;
    const nextStartPage = currentStart + pagesPerWard;

    if (nextStartPage > 604) {
      const { count: excCount } = await supabase.from("assignments").select("id", { count: "exact", head: true }).eq("plan_id", activePlan.id).eq("status", "excused");
      const { count: staleCount } = await supabase.from("assignments").select("id", { count: "exact", head: true }).eq("plan_id", activePlan.id).eq("status", "assigned").lt("due_date", today);
      const undoneCount = (excCount ?? 0) + (staleCount ?? 0);
      if (undoneCount > 0) { setMessage(`لم تكتمل الختمة بعد — ${undoneCount} صفحة لم تُقرأ. يمكن لأي عضو المطالبة بها عبر "أزيد وردي".`); return; }

      const newKhatmasCompleted = (family.khatmas_completed || 0) + 1;
      const { error: familyError } = await supabase.from("families").update({ current_start_page: 1, current_round: 1, khatmas_completed: newKhatmasCompleted, last_ward_date: null }).eq("id", family.id);
      if (familyError) { setMessage(familyError.message); return; }
      await loadFamily();
      setCompletedKhatmaNumber(newKhatmasCompleted);
      setShowCompletionModal(true);
      track("khatma_completed", { khatma_number: newKhatmasCompleted });
      return;
    }

    const rows = members.map((member, index) => {
      const from = nextStartPage + index;
      return { plan_id: activePlan.id, member_id: member.id, reading_text: `صفحة ${from}`, due_date: today, status: "assigned", start_page: from, end_page: from };
    });
    const { error: assignmentError } = await supabase.from("assignments").insert(rows);
    if (assignmentError) { setMessage(assignmentError.message); return; }
    const { error: familyError } = await supabase.from("families").update({ current_start_page: nextStartPage, current_round: (family.current_round || 1) + 1, last_ward_date: today }).eq("id", family.id);
    if (familyError) { setMessage(familyError.message); return; }
    await loadFamily();
    setMessage("تم إنهاء الورد الحالي وإنشاء ورد جديد.");
    setActiveTab("dashboard");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function copyText(text: string) {
    navigator.clipboard?.writeText(text);
    setMessage("تم النسخ ✓");
    setTimeout(() => setMessage(""), 1500);
  }

  function openWhatsApp(phone: string | null | undefined, text: string) {
    if (!phone) return;
    const digits = phone.replace(/\D/g, "");
    const normalized = digits.startsWith("0") ? "2" + digits : digits;
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(text)}`, "_blank");
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="text-sm font-bold text-slate-400">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  if (initError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6" dir="rtl">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50"><X className="h-8 w-8 text-rose-500" /></div>
          <p className="text-lg font-bold text-slate-700">حدث خطأ في تحميل البيانات</p>
          <p className="text-sm text-slate-500">تحقق من اتصالك بالإنترنت وحاول مرة أخرى.</p>
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
            <RefreshCw className="h-4 w-4" /> حاول مرة أخرى
          </button>
        </div>
      </main>
    );
  }

  if (!family) return null;

  // ── Tab definitions ──────────────────────────────────────────────────────────
  const TABS = [
    { key: "dashboard", label: "الرئيسية", icon: Home },
    { key: "members",   label: "أفراد",    icon: Users },
    { key: "tracking",  label: "المتابعة", icon: ListChecks },
    { key: "messages",  label: "الرسائل",  icon: MessageCircle },
  ] as const;

  const pendingMessages = assignments.filter((a) => a.status === "assigned").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">

      {/* ── Mobile top header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-4 py-3 lg:hidden">
        <div className="relative">
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 active:scale-95"
            aria-label="القائمة"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {mobileMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl z-50" style={{ animation: "fade-up 0.15s ease-out" }}>
              {userRole === "super_admin" && (
                <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>
                  <ShieldCheck className="h-4 w-4 text-slate-400" /> Admin Panel
                </Link>
              )}
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50">
                <LogOut className="h-4 w-4" /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-black text-emerald-900 leading-tight">ختمة عيلة</p>
          <p className="text-[10px] font-semibold text-slate-400 truncate max-w-30">{family.name}</p>
        </div>

        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <span className="text-emerald-700 font-black text-sm">{family.name.charAt(0)}</span>
        </div>
      </header>

      {/* ── Toast message ─────────────────────────────────────────────────── */}
      {message && (
        <div className="fixed top-16 left-1/2 z-50 -translate-x-1/2 lg:top-6" style={{ animation: "fade-up 0.2s ease-out" }}>
          <div className="rounded-2xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20">
            {message}
          </div>
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">

        {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
        <aside className="hidden border-l border-slate-200 bg-white p-5 lg:flex lg:flex-col">
          <div className="mb-8">
            <p className="text-2xl font-black text-emerald-900">ختمة عيلة</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{family.name}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${family.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {family.active ? "الحساب مفعل" : "في انتظار التفعيل"}
            </p>
          </div>

          <nav className="space-y-1.5 flex-1">
            {[
              { key: "dashboard", label: "الرئيسية",    Icon: Home },
              { key: "members",   label: "أفراد العيلة", Icon: Users },
              { key: "tracking",  label: "المتابعة",     Icon: ListChecks },
              { key: "messages",  label: "الرسائل",      Icon: MessageCircle, badge: pendingMessages },
              { key: "history",   label: "سجل الختمات",  Icon: BookOpen },
            ].map(({ key, label, Icon, badge }) => (
              <button key={key} type="button" onClick={() => setActiveTab(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === key ? "bg-emerald-700 text-white shadow-sm shadow-emerald-900/20" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-right">{label}</span>
                {badge != null && badge > 0 && (
                  <span className={`h-5 min-w-5 rounded-full px-1.5 text-center text-[10px] font-black leading-5 ${activeTab === key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"}`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {userRole === "super_admin" && (
              <Link href="/admin" className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition">
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            <button onClick={logout} className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition">
              <LogOut className="h-4 w-4" /> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <section className="p-3 pb-24 sm:p-4 lg:p-8 lg:pb-8">

          {/* Page header */}
          <header className="mb-5 hidden lg:flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black lg:text-3xl">لوحة التحكم</h1>
              <p className="mt-1 text-sm text-slate-500">إدارة أفراد العيلة والختمات والمتابعة.</p>
            </div>
          </header>

          {/* Support banner */}
          {showSupportBanner && (
            <div dir="rtl" className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-emerald-900">بقالكم أكتر من أسبوع مع ختمة عيلة 🤍</p>
                <p className="text-xs font-medium text-emerald-700">لو التطبيق نفعكم، فكّروا تدعموا استمراره.</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link href="/payment-pending" className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800">ادعم المشروع</Link>
                <button type="button" onClick={() => { localStorage.setItem("support_banner_dismissed", "1"); setShowSupportBanner(false); }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── DASHBOARD TAB ─────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-4" dir="rtl" style={{ animation: "fade-up 0.25s ease-out" }}>

              {plans.length === 0 && members.length > 0 && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <Button variant="secondary" onClick={createDefaultPlan} className="shrink-0 text-xs">ابدأ ختمة الآن</Button>
                  <p className="text-right text-sm font-semibold text-amber-800">لا توجد ختمة نشطة — اضغط لإنشاء ختمة تلقائية لأفراد العيلة.</p>
                </div>
              )}

              {/* Hero card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,#10b981_0%,transparent_70%)]" />
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg sm:text-2xl font-black text-emerald-950">عائلة {family.name}</h2>
                      <p className="text-sm font-bold text-emerald-800">
                        الختمة: <span className="font-black">{activePlan?.name || "لم تبدأ بعد"}</span>
                      </p>
                    </div>
                    {activePlan && (
                      <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        {overallProgress}%
                      </span>
                    )}
                  </div>

                  {activePlan && (
                    <p className="text-xs font-bold text-emerald-700/90 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {encourageMessage}
                    </p>
                  )}

                  <Button onClick={finishCurrentWardAndCreateNew} disabled={!activePlan || members.length === 0}
                    className="w-full flex items-center justify-center gap-2 shadow-sm shadow-emerald-900/10 font-black text-sm">
                    <RefreshCw className="h-4 w-4" /> إنهاء الورد وإنشاء ورد جديد
                  </Button>

                  {activePlan && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-600">
                        <span className="text-emerald-800 font-extrabold">{completedCount} / 604 صفحة</span>
                        <span>نسبة إنجاز الختمة</span>
                      </div>
                      <Progress value={overallProgress} />
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <StatsBar assignments={assignments} khatmasCompleted={family.khatmas_completed} totalMembers={members.length} />

              {/* Charity card */}
              {!charityLoading && (
                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-xs font-black text-amber-800">صدقتنا الجارية</p>
                  </div>
                  {charityPayments.length === 0 ? (
                    <p className="text-xs font-semibold text-amber-700">سيتم الإعلان عن أول صدقة قريباً إن شاء الله 🤍</p>
                  ) : (
                    <div className="space-y-1.5">
                      {charityPayments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                          <span className="font-semibold text-amber-900">{p.note || "صدقة جارية"}</span>
                          <span className="text-amber-600">{new Date(p.created_at).toLocaleDateString("ar-EG")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <KhatmaGrid assignments={assignments} />
              <MemberCards members={members} assignments={assignments} onUpdateAssignmentStatus={updateAssignment} />
              <WardShareCard familyName={family.name} planName={activePlan?.name || "الختمة الحالية"} assignments={assignments} />
            </div>
          )}

          {/* ── MEMBERS TAB ───────────────────────────────────────────────── */}
          {activeTab === "members" && (
            <div className="grid gap-4 xl:grid-cols-[1fr_360px]" style={{ animation: "fade-up 0.25s ease-out" }}>
              <Card>
                <h2 className="mb-4 text-lg font-black sm:text-xl">أفراد العيلة</h2>

                {/* Mobile card list */}
                <div className="space-y-2.5 md:hidden">
                  {members.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                      <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 font-semibold">لا يوجد أفراد بعد</p>
                    </div>
                  )}
                  {members.map((member, i) => (
                    <div key={member.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm" style={{ animation: `fade-up 0.2s ease-out ${i * 40}ms both` }}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-700 text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{member.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{member.phone || "بدون رقم"}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">{member.level}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Eye className="h-3.5 w-3.5" /> عرض الملف
                        </button>
                        <button
                          onClick={() => copyText(getMemberLink(member.access_token))}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          <Copy className="h-3.5 w-3.5" /> نسخ الرابط
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden overflow-auto rounded-2xl border border-slate-200 md:block">
                  <table className="w-full min-w-150 text-right text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold">
                      <tr><th className="p-3">الاسم</th><th className="p-3">واتساب</th><th className="p-3">المستوى</th><th className="p-3">رابط العضو</th></tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="p-3">
                            <button type="button" onClick={() => setSelectedMember(member)}
                              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 transition hover:text-emerald-900 hover:underline cursor-pointer">
                              {member.name}
                              <Eye className="h-3.5 w-3.5 text-emerald-400" />
                            </button>
                          </td>
                          <td className="p-3 text-slate-500">{member.phone || "—"}</td>
                          <td className="p-3">{member.level}</td>
                          <td className="p-3">
                            <button onClick={() => copyText(getMemberLink(member.access_token))}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition">
                              <Copy className="h-3.5 w-3.5" /> نسخ الرابط
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <h2 className="mb-4 text-lg font-black">إضافة فرد</h2>
                <form onSubmit={addMember} className="space-y-4">
                  <Input label="اسم الفرد" value={memberName} onChange={setMemberName} required />
                  <Input label="رقم واتساب" value={memberPhone} onChange={setMemberPhone} />
                  <Select label="مستوى القراءة" value={memberLevel} onChange={setMemberLevel}>
                    <option>صفحة يوميًا</option>
                    <option>صفحتين يوميًا</option>
                    <option>حزب</option>
                    <option>جزء</option>
                    <option>مخصص</option>
                  </Select>
                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" /> حفظ الفرد
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* ── TRACKING TAB ──────────────────────────────────────────────── */}
          {activeTab === "tracking" && (
            <div style={{ animation: "fade-up 0.25s ease-out" }}>
              <Card>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black sm:text-xl">{activePlan?.name || "المتابعة"}</h2>
                    <p className="mt-0.5 text-xs font-semibold text-slate-400">تابع مين قرأ ومين لسه</p>
                  </div>
                  <button onClick={() => setActiveTab("messages")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition w-full sm:w-auto">
                    <Bell className="h-4 w-4" /> رسائل التذكير
                  </button>
                </div>

                {/* Stats mini grid */}
                <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                    <p className="text-xl font-black text-emerald-700">{progress}%</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">نسبة الإنجاز</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
                    <p className="text-xl font-black text-slate-700">{completedCount}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">أتموا القراءة</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-center">
                    <p className="text-xl font-black text-amber-600">{excusedCount}</p>
                    <p className="text-[10px] font-bold text-amber-600 mt-0.5">اعتذروا</p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-center">
                    <p className="text-xl font-black text-rose-600">{delayedCount}</p>
                    <p className="text-[10px] font-bold text-rose-500 mt-0.5">متأخرون</p>
                  </div>
                </div>

                <Progress value={progress} />

                {/* Mobile card list */}
                <div className="mt-5 space-y-2.5 md:hidden">
                  {assignments.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                      <ListChecks className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 font-semibold">لا توجد أوراد حالياً</p>
                    </div>
                  )}
                  {assignments.map((a, i) => (
                    <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm" style={{ animation: `fade-up 0.2s ease-out ${i * 30}ms both` }}>
                      <div className="flex items-center justify-between gap-2">
                        <StatusPill status={a.status} />
                        <p className="font-bold text-slate-900">{a.members?.name || "—"}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                        <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <p className="text-sm font-semibold text-slate-700">{a.reading_text}</p>
                      </div>
                      {a.status === "assigned" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => updateAssignment(a.id, "done")}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition active:scale-95">
                            <CheckCircle2 className="h-4 w-4" /> تم
                          </button>
                          <button onClick={() => updateAssignment(a.id, "excused")}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 transition active:scale-95">
                            <UserX className="h-4 w-4" /> اعتذار
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="mt-5 hidden overflow-auto rounded-2xl border border-slate-200 md:block">
                  <table className="w-full min-w-150 text-right text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                      <tr><th className="p-3">الفرد</th><th className="p-3">ورد اليوم</th><th className="p-3">الحالة</th><th className="p-3">الإجراء</th></tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="p-3 font-bold">{a.members?.name || "—"}</td>
                          <td className="p-3 text-slate-600">{a.reading_text}</td>
                          <td className="p-3"><StatusPill status={a.status} /></td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="secondary" onClick={() => updateAssignment(a.id, "done")}>تم</Button>
                              <Button variant="ghost" onClick={() => updateAssignment(a.id, "excused")}>اعتذار</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── MESSAGES TAB ──────────────────────────────────────────────── */}
          {activeTab === "messages" && (
            <div style={{ animation: "fade-up 0.25s ease-out" }}>
              <div className="mb-4">
                <h2 className="text-lg font-black">رسائل التذكير</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{pendingMessages} عضو لم يؤكد وردهم بعد</p>
              </div>

              {pendingMessages === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-600">رائع! كل الأفراد أكدوا وردهم اليوم</p>
                  <p className="text-xs text-slate-400 mt-1">لا توجد رسائل تذكير مطلوبة الآن</p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {assignments.filter((a) => a.status === "assigned").map((a, i) => {
                  const link = getMemberLink(a.members?.access_token ?? "");
                  const text = `السلام عليكم يا ${a.members?.name}، وردك اليوم في ${activePlan?.name}: ${a.reading_text}. بعد القراءة اضغط هنا للتأكيد: ${link}`;
                  return (
                    <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm" style={{ animation: `fade-up 0.2s ease-out ${i * 50}ms both` }}>
                      {/* Member info */}
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                        <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-700 text-sm shrink-0">
                          {a.members?.name?.charAt(0) || "؟"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{a.members?.name || "—"}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{a.members?.phone || "بدون رقم"}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1">
                          <BookOpen className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-600">{a.reading_text}</span>
                        </div>
                      </div>

                      {/* Message preview */}
                      <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 text-xs leading-6 text-slate-600 font-medium">
                        {text}
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => copyText(link)}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition active:scale-95">
                          <Link2 className="h-3.5 w-3.5" /> نسخ الرابط
                        </button>
                        <button
                          onClick={() => openWhatsApp(a.members?.phone, text)}
                          disabled={!a.members?.phone}
                          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition active:scale-95 ${
                            a.members?.phone
                              ? "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              : "border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          }`}
                          title={a.members?.phone ? "إرسال عبر واتساب" : "لا يوجد رقم واتساب"}
                        >
                          <Send className="h-3.5 w-3.5" />
                          {a.members?.phone ? "إرسال" : "بدون رقم"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div style={{ animation: "fade-up 0.25s ease-out" }}>
              <KhatmaHistoryTab familyId={family.id} />
            </div>
          )}
        </section>
      </div>

      {/* ── Member Profile Drawer ─────────────────────────────────────────── */}
      {selectedMember && (
        <MemberProfileDrawer member={selectedMember} onClose={() => setSelectedMember(null)} onCopy={copyText} />
      )}

      {/* ── Khatma Completion Modal ───────────────────────────────────────── */}
      {showCompletionModal && (
        <KhatmaCompletionModal khatmaNumber={completedKhatmaNumber} familyName={family.name} purpose={activePlan?.purpose} purposeNote={activePlan?.purpose_note} activePlanId={activePlan?.id} onClose={() => setShowCompletionModal(false)} />
      )}

      {/* ── History Bottom Sheet (mobile) ─────────────────────────────────── */}
      {historySheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" dir="rtl">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setHistorySheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[90dvh] flex-col rounded-t-3xl bg-white shadow-2xl" style={{ animation: "fade-up 0.2s ease-out" }}>
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <button type="button" onClick={() => setHistorySheetOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
              <h2 className="text-base font-black text-slate-800">سجل الختمات</h2>
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-4">
              <KhatmaHistoryTab familyId={family.id} />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom tab bar ─────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm safe-bottom lg:hidden" dir="rtl">
        <div className="flex">
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            const badge = key === "messages" ? pendingMessages : 0;
            return (
              <button key={key} type="button" onClick={() => setActiveTab(key)}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 px-1 transition-all duration-150 active:scale-95">
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${isActive ? "bg-emerald-700 shadow-sm shadow-emerald-900/20 scale-110" : ""}`}>
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-white" : "text-slate-400"}`} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -left-1 h-4 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[9px] font-black leading-4 text-white">{badge}</span>
                  )}
                </div>
                <span className={`text-[10px] font-bold transition-colors ${isActive ? "text-emerald-700" : "text-slate-400"}`}>{label}</span>
              </button>
            );
          })}
          {/* History trigger */}
          <button type="button" onClick={() => setHistorySheetOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 px-1 transition-all duration-150 active:scale-95">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 ${historySheetOpen ? "bg-emerald-700 shadow-sm scale-110" : ""}`}>
              <BookOpen className={`h-4 w-4 transition-colors ${historySheetOpen ? "text-white" : "text-slate-400"}`} />
            </div>
            <span className={`text-[10px] font-bold transition-colors ${historySheetOpen ? "text-emerald-700" : "text-slate-400"}`}>السجل</span>
          </button>
        </div>
      </nav>

    </main>
  );
}
