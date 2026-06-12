"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card } from "@/components/ui";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
};

type Family = {
  id: string;
  name: string;
  active: boolean;
  payment_status: string;
  owner_id: string;
  created_at: string;
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

const methodLabels: Record<string, string> = {
  vodafone_cash: "Vodafone Cash",
  instapay: "InstaPay",
  bank_transfer: "تحويل بنكي",
};

export default function AdminPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState("جاري التحميل...");
  const [loading, setLoading] = useState(true);
  const [rejectingFamilyId, setRejectingFamilyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const profilesById = useMemo(() => {
    const map = new Map<string, Profile>();
    profiles.forEach((item) => map.set(item.id, item));
    return map;
  }, [profiles]);

  const latestPaymentByFamily = useMemo(() => {
    const map = new Map<string, Payment>();
    payments.forEach((p) => {
      const existing = map.get(p.family_id);
      if (!existing || new Date(p.created_at) > new Date(existing.created_at)) {
        map.set(p.family_id, p);
      }
    });
    return map;
  }, [payments]);

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", userData.user.id)
        .single();

      if (profileError || !profileData) {
        setMessage(profileError?.message || "لم يتم العثور على بيانات المستخدم.");
        setLoading(false);
        return;
      }

      setProfile(profileData as Profile);

      if (profileData.role !== "super_admin") {
        setMessage("هذه الصفحة متاحة لمالك النظام فقط.");
        setLoading(false);
        return;
      }

      await loadData();
      setMessage("");
      setLoading(false);
    }

    init();
  }, [router]);

  async function loadData() {
    const { data: familiesData, error: familiesError } = await supabase
      .from("families")
      .select("id, name, active, payment_status, owner_id, created_at")
      .order("created_at", { ascending: false });

    if (familiesError) {
      setMessage(familiesError.message);
      return;
    }

    const safeFamilies = (familiesData || []) as Family[];
    setFamilies(safeFamilies);

    const ownerIds = Array.from(new Set(safeFamilies.map((f) => f.owner_id)));

    if (ownerIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .in("id", ownerIds);
      setProfiles((profilesData || []) as Profile[]);
    } else {
      setProfiles([]);
    }

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    setPayments((paymentsData || []) as Payment[]);
  }

  async function handleApprove(family: Family) {
    setActionLoading(family.id);
    const latestPayment = latestPaymentByFamily.get(family.id);

    if (latestPayment) {
      await supabase
        .from("payments")
        .update({ status: "approved" })
        .eq("id", latestPayment.id);
    }

    const { error } = await supabase
      .from("families")
      .update({ active: true, payment_status: "paid" })
      .eq("id", family.id);

    if (error) setMessage(error.message);

    setActionLoading(null);
    await loadData();
  }

  async function handleDeactivate(family: Family) {
    setActionLoading(family.id);
    const { error } = await supabase
      .from("families")
      .update({ active: false, payment_status: "pending" })
      .eq("id", family.id);

    if (error) setMessage(error.message);

    setActionLoading(null);
    await loadData();
  }

  async function handleReject(family: Family) {
    if (!rejectionReason.trim()) return;
    setActionLoading(family.id);

    const latestPayment = latestPaymentByFamily.get(family.id);

    if (latestPayment) {
      await supabase
        .from("payments")
        .update({ status: "rejected", rejection_reason: rejectionReason.trim() })
        .eq("id", latestPayment.id);
    }

    await supabase
      .from("families")
      .update({ active: false, payment_status: "rejected" })
      .eq("id", family.id);

    setRejectingFamilyId(null);
    setRejectionReason("");
    setActionLoading(null);
    await loadData();
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <p className="font-bold text-slate-700">جاري التحميل...</p>
      </main>
    );
  }

  if (profile?.role !== "super_admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-black">غير مسموح</h1>
          <p className="mt-2 text-slate-600">{message}</p>
          <Link href="/dashboard">
            <Button className="mt-5">العودة للوحة العميل</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">مراجعة طلبات الدفع وتفعيل حسابات العملاء.</p>
          </div>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">لوحة العميل</Button>
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
            {message}
          </div>
        )}

        <Card>
          {/* Mobile card list */}
          <div className="space-y-4 lg:hidden">
            {families.map((family) => {
              const owner = profilesById.get(family.owner_id);
              const latestPayment = latestPaymentByFamily.get(family.id);
              const isRejecting = rejectingFamilyId === family.id;
              const isLoading = actionLoading === family.id;

              return (
                <div key={family.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900">{family.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        family.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {family.active ? "مفعل" : "منتظر"}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p><span className="font-semibold text-slate-700">العميل: </span>{owner?.full_name || "—"}</p>
                    <p className="break-all"><span className="font-semibold text-slate-700">الإيميل: </span>{owner?.email || "—"}</p>
                    <p><span className="font-semibold text-slate-700">طريقة الدفع: </span>
                      {latestPayment?.method ? (methodLabels[latestPayment.method] || latestPayment.method) : "—"}
                    </p>
                    <p className="font-mono"><span className="font-sans font-semibold text-slate-700">رقم العملية: </span>{latestPayment?.reference || "—"}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-semibold text-slate-700">حالة الدفع:</span>
                      <PaymentStatusPill status={family.payment_status} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {family.active ? (
                      <Button variant="danger" onClick={() => handleDeactivate(family)} disabled={isLoading} className="flex-1 min-w-[120px]">
                        {isLoading ? "..." : "إيقاف"}
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => handleApprove(family)} disabled={isLoading} className="flex-1 min-w-[120px]">
                          {isLoading ? "..." : "تفعيل"}
                        </Button>
                        {(family.payment_status === "submitted" || family.payment_status === "pending") && (
                          <Button
                            variant="danger"
                            onClick={() => {
                              setRejectingFamilyId(isRejecting ? null : family.id);
                              setRejectionReason("");
                            }}
                            disabled={isLoading}
                            className="flex-1 min-w-[120px]"
                          >
                            رفض
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                  {isRejecting && (
                    <div className="space-y-2 rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="سبب الرفض (مثال: رقم العملية غير صحيح)"
                        dir="rtl"
                        className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm text-right outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      />
                      <div className="flex gap-2">
                        <Button variant="danger" onClick={() => handleReject(family)} disabled={!rejectionReason.trim() || isLoading} className="flex-1">
                          {isLoading ? "..." : "تأكيد الرفض"}
                        </Button>
                        <button onClick={() => setRejectingFamilyId(null)} className="px-4 text-sm text-slate-500 hover:text-slate-700">
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {families.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">لا توجد عائلات حتى الآن.</p>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-auto lg:block">
            <table className="w-full min-w-[1000px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">العيلة</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">الإيميل</th>
                  <th className="p-3">طريقة الدفع</th>
                  <th className="p-3">رقم العملية</th>
                  <th className="p-3">حالة الدفع</th>
                  <th className="p-3">التفعيل</th>
                  <th className="p-3">إجراء</th>
                </tr>
              </thead>

              <tbody>
                {families.map((family) => {
                  const owner = profilesById.get(family.owner_id);
                  const latestPayment = latestPaymentByFamily.get(family.id);
                  const isRejecting = rejectingFamilyId === family.id;
                  const isLoading = actionLoading === family.id;

                  return (
                    <>
                      <tr key={family.id} className="border-t border-slate-100">
                        <td className="p-3 font-bold">{family.name}</td>
                        <td className="p-3">{owner?.full_name || "—"}</td>
                        <td className="p-3">{owner?.email || "—"}</td>
                        <td className="p-3">
                          {latestPayment?.method
                            ? (methodLabels[latestPayment.method] || latestPayment.method)
                            : "—"}
                        </td>
                        <td className="p-3 font-mono text-xs">
                          {latestPayment?.reference || "—"}
                        </td>
                        <td className="p-3">
                          <PaymentStatusPill status={family.payment_status} />
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              family.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {family.active ? "مفعل" : "منتظر"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {family.active ? (
                              <Button
                                variant="danger"
                                onClick={() => handleDeactivate(family)}
                                disabled={isLoading}
                              >
                                {isLoading ? "..." : "إيقاف"}
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleApprove(family)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? "..." : "تفعيل"}
                                </Button>
                                {(family.payment_status === "submitted" ||
                                  family.payment_status === "pending") && (
                                  <Button
                                    variant="danger"
                                    onClick={() => {
                                      setRejectingFamilyId(isRejecting ? null : family.id);
                                      setRejectionReason("");
                                    }}
                                    disabled={isLoading}
                                  >
                                    رفض
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Inline rejection reason input */}
                      {isRejecting && (
                        <tr className="bg-rose-50/60">
                          <td colSpan={8} className="px-4 pb-4 pt-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="سبب الرفض (مثال: رقم العملية غير صحيح)"
                                dir="rtl"
                                className="min-w-[200px] flex-1 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm text-right outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                              />
                              <Button
                                variant="danger"
                                onClick={() => handleReject(family)}
                                disabled={!rejectionReason.trim() || isLoading}
                              >
                                {isLoading ? "..." : "تأكيد الرفض"}
                              </Button>
                              <button
                                onClick={() => setRejectingFamilyId(null)}
                                className="text-sm text-slate-500 hover:text-slate-700"
                              >
                                إلغاء
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}

                {families.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-slate-500" colSpan={8}>
                      لا توجد عائلات حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

function PaymentStatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "لم يُرسَل بعد", cls: "bg-slate-100 text-slate-600" },
    submitted: { label: "قيد المراجعة", cls: "bg-amber-50 text-amber-700" },
    paid: { label: "مدفوع", cls: "bg-emerald-50 text-emerald-700" },
    rejected: { label: "مرفوض", cls: "bg-rose-50 text-rose-700" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>{label}</span>
  );
}
