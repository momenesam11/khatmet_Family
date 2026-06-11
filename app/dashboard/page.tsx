"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input, MiniInfo, Progress, Select, StatusPill } from "@/components/ui";

type Family = {
  id: string;
  name: string;
  active: boolean;
  payment_status: string;
  owner_id: string;
  current_start_page: number;
  current_round: number;
  khatmas_completed: number;
};
type Member = { id: string; name: string; phone: string | null; level: string; access_token: string; family_id: string };
type Plan = { id: string; name: string; start_date: string; end_date: string; type: string; method: string; active: boolean; family_id: string };
type Assignment = {
  id: string;
  start_page?: number | null;
  end_page?: number | null;
  reading_text: string;
  due_date: string;
  status: string;
  note: string | null;
  completed_at: string | null;
  members?: { name: string; phone: string | null; access_token: string } | null;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ── Khatma Completion Modal ──────────────────────────────────────────────────

function KhatmaCompletionModal({
  khatmaNumber,
  familyName,
  onClose,
}: {
  khatmaNumber: number;
  familyName: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700" />

        <div className="space-y-5 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-4xl">
            🕌
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-emerald-950">
              مبروك! عيلتكم ختمت القرآن كاملاً 🤍
            </h2>
            <p className="text-base font-semibold text-emerald-700">
              تقبّل الله منكم، وجعله في ميزان حسناتكم.
            </p>
            <p className="text-sm font-medium text-slate-400">
              الختمة رقم {khatmaNumber} لعيلة {familyName}
            </p>
          </div>

          <div className="border-t border-slate-100" />

          <div className="rounded-2xl border border-amber-100/80 bg-amber-50 p-4 text-right">
            <p className="text-sm font-semibold leading-relaxed text-amber-900">
              ختمة عيلة بيتشغّل بتبرعات أهله، وجزء من كل تبرع يخرج كصدقة جارية. لو حابين تدعموا استمرار المشروع، ده اختياري تماماً.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/payment-pending"
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:from-emerald-800 hover:to-emerald-900"
            >
              ادعم المشروع
            </Link>
            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50"
            >
              تمام، شكراً 🤍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WardShareCard ────────────────────────────────────────────────────────────
// Displays today's ward as a shareable card. "حفظ كصورة" uses html-to-image
// (RTL-safe, Tailwind-compatible) to export the card as a PNG.

function formatPagesShort(
  start: number | null | undefined,
  end: number | null | undefined,
  fallback: string
): string {
  if (start == null || end == null) return fallback;
  if (start === end) return `صفحة ${start}`;
  return `صفحة ${start}–${end}`;
}

function WardShareCard({
  familyName,
  planName,
  assignments,
}: {
  familyName: string;
  planName: string;
  assignments: Assignment[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function saveAsImage() {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        style: { direction: "rtl" },
      });

      // Try Web Share API first (mobile)
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `ورد-${familyName}.png`, { type: "image/png" });
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ title: `ورد ${familyName}`, files: [file] });
        return;
      }

      // Fallback: download
      const link = document.createElement("a");
      link.download = `ورد-${familyName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Silent — user may have dismissed the share sheet
    }
  }

  return (
    <div className="space-y-3">
      {/* Capturable card */}
      <div ref={cardRef} dir="rtl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white">
          {/* Header */}
          <div className="mb-5 text-center">
            <p className="text-xs font-bold tracking-widest text-emerald-200 uppercase">
              ختمة عيلة
            </p>
            <h2 className="mt-1 text-2xl font-black">ورد {familyName}</h2>
            <p className="mt-1 text-sm text-emerald-200">{planName}</p>
            <p className="mt-2 rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 inline-block">
              {today}
            </p>
          </div>

          {/* Member rows */}
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white">
                    {assignment.members?.name || "—"}
                  </p>
                  <p className="mt-0.5 text-sm text-emerald-200">
                    {formatPagesShort(
                      assignment.start_page,
                      assignment.end_page,
                      assignment.reading_text
                    )}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                    assignment.status === "done"
                      ? "bg-emerald-300 text-emerald-950"
                      : assignment.status === "excused"
                      ? "bg-amber-200 text-amber-950"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {assignment.status === "done"
                    ? "✓ قرأ"
                    : assignment.status === "excused"
                    ? "اعتذر"
                    : "لم يقرأ"}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-[10px] text-emerald-300">
            شارك هذه الصورة مع جروب واتساب العيلة
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <Button onClick={saveAsImage} className="w-full">
        📸 حفظ كصورة ومشاركة
      </Button>
    </div>
  );
}

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
  const [planName, setPlanName] = useState("ورد العيلة اليومي");
  const [planType, setPlanType] = useState("توزيع بالصفحات");
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedKhatmaNumber, setCompletedKhatmaNumber] = useState(0);

  const activePlan = plans[0] || null;
  const completedCount = assignments.filter((assignment) => assignment.status === "done").length;
  const excusedCount = assignments.filter((assignment) => assignment.status === "excused").length;
  const delayedCount = Math.max(0, assignments.length - completedCount - excusedCount);
  const progress = Math.round((completedCount / Math.max(assignments.length, 1)) * 100);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      
      // Smart check: if user has no family row, redirect to onboarding /setup
      const { data: familyData } = await supabase
        .from("families")
        .select("*")
        .eq("owner_id", data.user.id)
        .maybeSingle();

      if (!familyData) {
        router.push("/setup");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profileData) setUserRole(profileData.role);

      setFamily(familyData);
      await Promise.all([loadMembers(familyData.id), loadPlans(familyData.id)]);
      setLoading(false);
    }

    init();
  }, [router]);

  // Auto-refresh assignments every 30 s so admin sees member updates without manual reload.
  // To upgrade to instant push updates, replace this interval with a Supabase Realtime subscription:
  //   supabase.channel('assignments-rt')
  //     .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' },
  //         () => activePlan?.id && loadAssignments(activePlan.id))
  //     .subscribe()
  // Requires enabling Replication for the assignments table in the Supabase Dashboard first.
  useEffect(() => {
    if (!activePlan?.id) return;
    const planId = activePlan.id;
    const timer = setInterval(() => loadAssignments(planId), 30_000);
    return () => clearInterval(timer);
  }, [activePlan?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadFamily(currentUserId = userId) {
  const { data: familyData } = await supabase
    .from("families")
    .select("*")
    .eq("owner_id", currentUserId)
    .maybeSingle();

  setFamily(familyData);

  if (familyData) {
    await Promise.all([loadMembers(familyData.id), loadPlans(familyData.id)]);
  }
}

  async function loadMembers(familyId: string) {
    const { data } = await supabase.from("members").select("*").eq("family_id", familyId).order("created_at", { ascending: false });
    setMembers(data || []);
  }

  async function loadPlans(familyId: string) {
    const { data } = await supabase.from("plans").select("*").eq("family_id", familyId).eq("active", true).order("created_at", { ascending: false });
    setPlans(data || []);

    if (data && data[0]) {
      await loadAssignments(data[0].id);
    } else {
      setAssignments([]);
    }
  }

  async function loadAssignments(planId: string) {
  const { data } = await supabase
    .from("assignments")
    .select("id, start_page, end_page, reading_text, due_date, status, note, completed_at, members(name, phone, access_token)")
    .eq("plan_id", planId)
    .order("created_at", { ascending: true });

  type AssignmentFromSupabase = Omit<Assignment, "members"> & {
    members?:
      | { name: string; phone: string | null; access_token: string }
      | { name: string; phone: string | null; access_token: string }[]
      | null;
  };

  const normalizedAssignments = ((data ?? []) as unknown as AssignmentFromSupabase[]).map((item) => ({
    ...item,
    members: Array.isArray(item.members) ? item.members[0] ?? null : item.members ?? null,
  }));

  setAssignments(normalizedAssignments);
}

  async function addMember(event: FormEvent) {
    event.preventDefault();
    if (!family) return;

    const { error } = await supabase.from("members").insert({
      family_id: family.id,
      name: memberName,
      phone: memberPhone || null,
      level: memberLevel,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMemberName("");
    setMemberPhone("");
    setMemberLevel("صفحة يوميًا");
    await loadMembers(family.id);
  }

  async function createPlan(event: FormEvent) {
  event.preventDefault();
  if (!family || members.length === 0) return;

  if (plans.length > 0) {
    setMessage("الحساب له ختمة واحدة فقط. يمكنك إنهاء الورد الحالي وإنشاء ورد جديد داخل نفس الختمة.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data: planData, error: planError } = await supabase
    .from("plans")
    .insert({
      family_id: family.id,
      name: family.name,
      type: planType,
      method: "توزيع تلقائي",
      start_date: today,
      end_date: endDate,
      active: true,
    })
    .select("*")
    .single();

  if (planError || !planData) {
    setMessage(planError?.message || "لم يتم إنشاء الختمة");
    return;
  }

  const startPage = family.current_start_page || 1;

  const rows = members.map((member, index) => {
    const from = startPage + index;
    const to = from;

    return {
      plan_id: planData.id,
      member_id: member.id,
      reading_text: `صفحة ${from}`,
      due_date: today,
      status: "assigned",
      start_page: from,
      end_page: to,
    };
  });

  const { error: assignmentError } = await supabase
    .from("assignments")
    .insert(rows);

  if (assignmentError) {
    setMessage(assignmentError.message);
    return;
  }

  // Set last_ward_date so the lazy transition in get_member_portal
  // does not create a duplicate ward if a member opens their portal today.
  await supabase
    .from("families")
    .update({ last_ward_date: today })
    .eq("id", family.id);

  await loadPlans(family.id);
  setActiveTab("tracking");
}

  async function updateAssignment(id: string, status: "done" | "excused" | "assigned") {
    if (!activePlan) return;

    await supabase.from("assignments").update({
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
    }).eq("id", id);

    await loadAssignments(activePlan.id);
  }


  async function finishCurrentWardAndCreateNew() {
  if (!family || !activePlan || members.length === 0) return;

  const today = new Date().toISOString().slice(0, 10);
  const pagesPerWard = members.length;
  const currentStart = family.current_start_page || 1;
  // nextStartPage = start of the new ward (current_start_page + pagesPerWard)
  const nextStartPage = currentStart + pagesPerWard;

  // ── Past page 604: check if all pages are truly done ──────────────────────
  if (nextStartPage > 604) {
    // Count excused assignments (confirmed unread)
    const { count: excusedCount } = await supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("plan_id", activePlan.id)
      .eq("status", "excused");

    // Count stale-assigned from previous wards (member missed their ward)
    const { count: staleCount } = await supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("plan_id", activePlan.id)
      .eq("status", "assigned")
      .lt("due_date", today);

    const undoneCount = (excusedCount ?? 0) + (staleCount ?? 0);

    if (undoneCount > 0) {
      // Some pages were not read — khatma not yet complete.
      // Unread pages are available to any volunteer via "أزيد وردي".
      setMessage(
        `لم تكتمل الختمة بعد — ${undoneCount} صفحة لم تُقرأ. يمكن لأي عضو المطالبة بها عبر "أزيد وردي".`
      );
      return;
    }

    // ── TRUE khatma completion ────────────────────────────────────────────
    const newKhatmasCompleted = (family.khatmas_completed || 0) + 1;

    const { error: familyError } = await supabase
      .from("families")
      .update({
        current_start_page: 1,
        current_round: 1,
        khatmas_completed: newKhatmasCompleted,
        last_ward_date: null, // Reset so lazy transition starts fresh next khatma
      })
      .eq("id", family.id);

    if (familyError) { setMessage(familyError.message); return; }

    await loadFamily();
    setCompletedKhatmaNumber(newKhatmasCompleted);
    setShowCompletionModal(true);
    return;
  }

  // ── Normal case: create next ward ─────────────────────────────────────────
  const rows = members.map((member, index) => {
    const from = nextStartPage + index;
    const to = from;
    return {
      plan_id: activePlan.id,
      member_id: member.id,
      reading_text: `صفحة ${from}`,
      due_date: today,
      status: "assigned",
      start_page: from,
      end_page: to,
    };
  });

  const { error: assignmentError } = await supabase.from("assignments").insert(rows);
  if (assignmentError) { setMessage(assignmentError.message); return; }

  const { error: familyError } = await supabase
    .from("families")
    .update({
      current_start_page: nextStartPage,
      current_round: (family.current_round || 1) + 1,
      last_ward_date: today,
    })
    .eq("id", family.id);

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
    setMessage("تم النسخ");
    setTimeout(() => setMessage(""), 1500);
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6">جاري التحميل...</main>;
  }

  // init() redirects to /setup if !family — this guard is for TypeScript narrowing only
  if (!family) return null;

const latestAssignmentsByMember = new Map<string, Assignment>();

assignments.forEach((assignment) => {
  const memberName = assignment.members?.name || "";
  if (!memberName) return;
  latestAssignmentsByMember.set(memberName, assignment);
});

const sortedAssignments = [...assignments].sort((a, b) => {
  if (a.status === "assigned" && b.status !== "assigned") return -1;
  if (a.status !== "assigned" && b.status === "assigned") return 1;
  return 0;
});


  const tabs: [string, string, string][] = [
    ["dashboard", "الرئيسية", "⌂"],
    ["members", "أفراد", "👥"],
    ["plans", "الختمات", "▣"],
    ["tracking", "المتابعة", "▤"],
    ["messages", "الرسائل", "✉"],
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── Mobile top header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold text-slate-500">{family.name}</p>
        <p className="text-lg font-black text-emerald-900">ختمة عيلة</p>
        <div className="relative">
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="القائمة"
          >
            <span className="text-xl leading-none">⋮</span>
          </button>
          {mobileMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-44 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
              {userRole === "super_admin" && (
                <Link
                  href="/admin"
                  className="block px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="block w-full px-4 py-2.5 text-right text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-l border-slate-200 bg-white p-5 lg:block">
          <div className="mb-8">
            <p className="text-2xl font-black">ختمة عيلة</p>
            <p className="mt-1 text-sm text-slate-500">{family.name}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${family.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {family.active ? "الحساب مفعل" : "في انتظار التفعيل"}
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["dashboard", "الرئيسية", "⌂"],
              ["members", "أفراد العيلة", "👥"],
              ["plans", "الختمات والأوراد", "▣"],
              ["tracking", "المتابعة", "▤"],
              ["messages", "الرسائل", "✉"],
            ].map(([key, label, icon]: string[]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === key ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-2">
            {userRole === "super_admin" && (
              <Link href="/admin" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Admin Panel</Link>
            )}
            <Button variant="ghost" onClick={logout} className="w-full">تسجيل الخروج</Button>
          </div>
        </aside>

        <section className="p-4 pb-24 lg:p-8 lg:pb-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black lg:text-3xl">لوحة التحكم</h1>
              <p className="mt-1 text-sm text-slate-500">إدارة أفراد العيلة والختمات والمتابعة.</p>
            </div>
            {message && <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">{message}</div>}
          </header>

          {activeTab === "dashboard" && (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <p className="text-sm text-slate-500">أفراد العيلة</p>
        <p className="mt-2 text-3xl font-black">{members.length}</p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">الختمة الحالية</p>
        <p className="mt-2 text-2xl font-black">
          {activePlan?.name || "لم تبدأ بعد"}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">إنجاز الورد الحالي</p>
        <p className="mt-2 text-3xl font-black">{progress}%</p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">لم يقرأوا بعد</p>
        <p className="mt-2 text-3xl font-black">{delayedCount}</p>
      </Card>
    </div>

    <Card>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">الورد الحالي للأفراد</h2>
          <p className="mt-1 text-sm text-slate-500">
            الأشخاص الذين لم يقرأوا يظهرون في أول الجدول.
          </p>
        </div>

        <Button
          onClick={finishCurrentWardAndCreateNew}
          disabled={!activePlan || members.length === 0}
        >
          إنهاء الورد وإنشاء ورد جديد
        </Button>
      </div>

      <Progress value={progress} />

      <div className="mt-6 overflow-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">الفرد</th>
              <th className="p-3">الورد الحالي</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">إجراء</th>
            </tr>
          </thead>

          <tbody>
            {sortedAssignments.map((assignment) => (
              <tr key={assignment.id} className="border-t border-slate-100">
                <td className="p-3 font-bold">
                  {assignment.members?.name || "—"}
                </td>

                <td className="p-3">
                  {assignment.reading_text}
                </td>

                <td className="p-3">
                  <StatusPill status={assignment.status} />
                </td>

                <td className="p-3">
                  {assignment.status === "assigned" ? (
                    <Button
                      variant="secondary"
                      onClick={() => updateAssignment(assignment.id, "done")}
                    >
                      تسجيل كتم
                    </Button>
                  ) : (
                    <span className="text-sm text-slate-400">تم</span>
                  )}
                </td>
              </tr>
            ))}

            {sortedAssignments.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={4}>
                  لا يوجد ورد حالي. أضف أفراد العيلة ثم أنشئ الختمة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>

    <WardShareCard
      familyName={family.name}
      planName={activePlan?.name || "الختمة الحالية"}
      assignments={sortedAssignments}
    />
  </div>
)}

          {activeTab === "members" && (
            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <Card>
                <h2 className="mb-5 text-xl font-black">أفراد العيلة</h2>
                <div className="overflow-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[760px] text-right text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr><th className="p-3">الاسم</th><th className="p-3">واتساب</th><th className="p-3">المستوى</th><th className="p-3">رابط العضو</th></tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-t border-slate-100">
                          <td className="p-3 font-bold">{member.name}</td>
                          <td className="p-3">{member.phone || "—"}</td>
                          <td className="p-3">{member.level}</td>
                          <td className="p-3">
                            <Button variant="secondary" onClick={() => copyText(`${siteUrl}/member/${member.access_token}`)}>نسخ الرابط</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <h2 className="mb-5 text-xl font-black">إضافة فرد</h2>
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
                  <Button type="submit" className="w-full">حفظ الفرد</Button>
                </form>
              </Card>
            </div>
          )}

          {activeTab === "plans" && (
  <Card className="max-w-2xl">
    <h2 className="text-2xl font-black">الختمة الحالية</h2>

    {activePlan ? (
      <div className="mt-6 rounded-3xl bg-emerald-50 p-5">
        <h3 className="text-xl font-black text-emerald-900">
          {activePlan.name}
        </h3>
        <p className="mt-2 text-sm text-emerald-700">
          الحساب له ختمة واحدة فقط. يمكنك إنشاء ورد جديد من زر "إنهاء الورد وإنشاء ورد جديد" في الرئيسية.
        </p>

        <Button
          className="mt-5"
          onClick={() => setActiveTab("dashboard")}
        >
          الذهاب للرئيسية
        </Button>
      </div>
    ) : (
      <>
        <p className="mt-2 text-slate-600">
          سيتم إنشاء ختمة واحدة لهذا الحساب وتوزيع أول ورد على أفراد العيلة.
        </p>

        <form onSubmit={createPlan} className="mt-6 space-y-4">
          <Input
            label="اسم الختمة"
            value={planName}
            onChange={setPlanName}
            required
          />

          <Select
            label="طريقة التوزيع"
            value={planType}
            onChange={setPlanType}
          >
            <option>توزيع بالصفحات</option>
            <option>توزيع بالأجزاء</option>
            <option>توزيع بالأحزاب</option>
            <option>توزيع مخصص</option>
          </Select>

          <Button type="submit" disabled={members.length === 0}>
            إنشاء الختمة
          </Button>
        </form>

        {members.length === 0 && (
          <p className="mt-4 text-sm font-bold text-amber-700">
            أضف أفراد العيلة الأول.
          </p>
        )}
      </>
    )}
  </Card>
)}
          {activeTab === "tracking" && (
            <Card>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">{activePlan?.name || "المتابعة"}</h2>
                  <p className="mt-1 text-slate-500">تابع مين قرأ ومين لسه.</p>
                </div>
                <Button variant="secondary" onClick={() => setActiveTab("messages")}>رسائل التذكير</Button>
              </div>
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <MiniInfo label="نسبة الإنجاز" value={`${progress}%`} />
                <MiniInfo label="تموا القراءة" value={completedCount} />
                <MiniInfo label="اعتذروا اليوم" value={excusedCount} />
                <MiniInfo label="متأخرين" value={delayedCount} />
              </div>
              <Progress value={progress} />
              <div className="mt-6 overflow-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[760px] text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr><th className="p-3">الفرد</th><th className="p-3">ورد اليوم</th><th className="p-3">الحالة</th><th className="p-3">الإجراء</th></tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="border-t border-slate-100">
                        <td className="p-3 font-bold">{assignment.members?.name || "—"}</td>
                        <td className="p-3">{assignment.reading_text}</td>
                        <td className="p-3"><StatusPill status={assignment.status} /></td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => updateAssignment(assignment.id, "done")}>تم</Button>
                            <Button variant="ghost" onClick={() => updateAssignment(assignment.id, "excused")}>اعتذار</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "messages" && (
            <div className="grid gap-4 lg:grid-cols-2">
              {assignments.filter((a) => a.status === "assigned").map((assignment) => {
                const link = `${siteUrl}/member/${assignment.members?.access_token}`;
                const text = `السلام عليكم يا ${assignment.members?.name}، وردك اليوم في ${activePlan?.name}: ${assignment.reading_text}. بعد القراءة اضغط هنا للتأكيد: ${link}`;
                return (
                  <Card key={assignment.id}>
                    <h3 className="font-black">تذكير إلى {assignment.members?.name}</h3>
                    <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7">{text}</div>
                    <Button className="mt-4" variant="secondary" onClick={() => copyText(text)}>نسخ الرسالة</Button>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── Khatma Completion Modal ──────────────────────────────────────── */}
      {showCompletionModal && (
        <KhatmaCompletionModal
          khatmaNumber={completedKhatmaNumber}
          familyName={family.name}
          onClose={() => setShowCompletionModal(false)}
        />
      )}

      {/* ── Mobile bottom tab bar ────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white lg:hidden" dir="rtl">
        {tabs.map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold transition ${
              activeTab === key ? "text-emerald-700" : "text-slate-400"
            }`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

    </main>
  );
}
