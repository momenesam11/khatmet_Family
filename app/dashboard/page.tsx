"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input, MiniInfo, Progress, Select, StatusPill } from "@/components/ui";

type Family = { id: string; name: string; active: boolean; payment_status: string; owner_id: string };
type Member = { id: string; name: string; phone: string | null; level: string; access_token: string; family_id: string };
type Plan = { id: string; name: string; start_date: string; end_date: string; type: string; method: string; active: boolean; family_id: string };
type Assignment = {
  id: string;
  reading_text: string;
  due_date: string;
  status: string;
  note: string | null;
  completed_at: string | null;
  members?: { name: string; phone: string | null; access_token: string } | null;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [familyName, setFamilyName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberLevel, setMemberLevel] = useState("صفحة يوميًا");
  const [planName, setPlanName] = useState("ورد العيلة اليومي");
  const [planType, setPlanType] = useState("توزيع بالصفحات");
  const [message, setMessage] = useState("");

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
      await loadFamily(data.user.id);
      setLoading(false);
    }

    init();
  }, [router]);

  async function loadFamily(currentUserId = userId) {
    const { data: familyData } = await supabase.from("families").select("*").eq("owner_id", currentUserId).maybeSingle();
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
      .select("id, reading_text, due_date, status, note, completed_at, members(name, phone, access_token)")
      .eq("plan_id", planId)
      .order("created_at", { ascending: true });

    setAssignments((data as Assignment[]) || []);
  }

  async function createFamily(event: FormEvent) {
    event.preventDefault();

    const { data, error } = await supabase.from("families").insert({
      owner_id: userId,
      name: familyName,
      payment_status: "pending",
      active: false,
    }).select("*").single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setFamily(data);
    setMessage("تم إنشاء مساحة العيلة. في النسخة الحقيقية أنت كمالك النظام هتفعّل الحساب من Admin Panel بعد الدفع.");
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

    const today = new Date().toISOString().slice(0, 10);
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const { data: planData, error: planError } = await supabase.from("plans").insert({
      family_id: family.id,
      name: planName,
      type: planType,
      method: "توزيع تلقائي",
      start_date: today,
      end_date: endDate,
      active: true,
    }).select("*").single();

    if (planError || !planData) {
      setMessage(planError?.message || "لم يتم إنشاء الخطة");
      return;
    }

    const rows = members.map((member, index) => ({
      plan_id: planData.id,
      member_id: member.id,
      reading_text: `من صفحة ${42 + index * 2} إلى صفحة ${43 + index * 2}`,
      due_date: today,
      status: "assigned",
    }));

    const { error: assignmentError } = await supabase.from("assignments").insert(rows);

    if (assignmentError) {
      setMessage(assignmentError.message);
      return;
    }

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

  if (!family) {
    return (
      <main className="grid min-h-screen place-items-center bg-emerald-50 p-6">
        <Card className="w-full max-w-xl">
          <h1 className="text-3xl font-black">إنشاء مساحة العيلة</h1>
          <p className="mt-2 text-slate-600">ابدأ بإنشاء مساحة خاصة بعيلتك. بعدها تقدر تضيف أفراد وتعمل ورد.</p>
          <form onSubmit={createFamily} className="mt-6 space-y-4">
            <Input label="اسم العيلة" value={familyName} onChange={setFamilyName} placeholder="مثال: عيلة الحاج محمود" required />
            <Button type="submit" className="w-full">إنشاء المساحة</Button>
          </form>
          {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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
            ].map(([key, label, icon]) => (
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
            <Link href="/admin" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Admin Panel</Link>
            <Button variant="ghost" onClick={logout} className="w-full">تسجيل الخروج</Button>
          </div>
        </aside>

        <section className="p-4 lg:p-8">
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
                <Card><p className="text-sm text-slate-500">أفراد العيلة</p><p className="mt-2 text-3xl font-black">{members.length}</p></Card>
                <Card><p className="text-sm text-slate-500">الختمات النشطة</p><p className="mt-2 text-3xl font-black">{plans.length}</p></Card>
                <Card><p className="text-sm text-slate-500">إنجاز اليوم</p><p className="mt-2 text-3xl font-black">{progress}%</p></Card>
                <Card><p className="text-sm text-slate-500">متأخرين</p><p className="mt-2 text-3xl font-black">{delayedCount}</p></Card>
              </div>
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black">{activePlan?.name || "لا توجد خطة نشطة"}</h2>
                    <p className="text-sm text-slate-500">{activePlan ? `${activePlan.start_date} - ${activePlan.end_date}` : "ابدأ بإنشاء ورد جديد"}</p>
                  </div>
                  <Button onClick={() => setActiveTab("plans")}>إنشاء ورد</Button>
                </div>
                <Progress value={progress} />
              </Card>
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
              <h2 className="text-2xl font-black">إنشاء ورد / ختمة</h2>
              <p className="mt-2 text-slate-600">سيتم توزيع ورد تجريبي تلقائي على كل أفراد العيلة.</p>
              <form onSubmit={createPlan} className="mt-6 space-y-4">
                <Input label="اسم الورد / الختمة" value={planName} onChange={setPlanName} required />
                <Select label="طريقة التوزيع" value={planType} onChange={setPlanType}>
                  <option>توزيع بالصفحات</option>
                  <option>توزيع بالأجزاء</option>
                  <option>توزيع بالأحزاب</option>
                  <option>توزيع مخصص</option>
                </Select>
                <Button type="submit" disabled={members.length === 0}>إنشاء الخطة</Button>
              </form>
              {members.length === 0 && <p className="mt-4 text-sm font-bold text-amber-700">أضف أفراد العيلة الأول.</p>}
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
    </main>
  );
}
