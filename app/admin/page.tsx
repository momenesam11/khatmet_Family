"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, StatusPill } from "@/components/ui";

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
  profiles?: Profile[] | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [message, setMessage] = useState("جاري التحميل...");

  useEffect(() => {
    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
      setProfile(profileData);

      if (profileData?.role !== "super_admin") {
        setMessage("هذه الصفحة متاحة لمالك النظام فقط.");
        return;
      }

      await loadFamilies();
      setMessage("");
    }

    init();
  }, [router]);

  async function loadFamilies() {
    const { data, error } = await supabase
      .from("families")
      .select("id, name, active, payment_status, owner_id, created_at, profiles(id, email, full_name, role)")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setFamilies((data as unknown as Family[]) || []);
  }

  async function setActivation(family: Family, active: boolean) {
    const { error } = await supabase
      .from("families")
      .update({ active, payment_status: active ? "paid" : "pending" })
      .eq("id", family.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadFamilies();
  }

  if (message && !profile) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6">{message}</main>;
  }

  if (profile?.role !== "super_admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-black">غير مسموح</h1>
          <p className="mt-2 text-slate-600">{message}</p>
          <Link href="/dashboard"><Button className="mt-5">العودة للوحة العميل</Button></Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">Admin Panel</h1>
            <p className="mt-1 text-slate-500">من هنا تفعّل حسابات العملاء بعد الدفع.</p>
          </div>
          <Link href="/dashboard"><Button variant="secondary">لوحة العميل</Button></Link>
        </div>

        {message && <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">{message}</div>}

        <Card>
          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">العيلة</th>
                  <th className="p-3">العميل</th>
                  <th className="p-3">الإيميل</th>
                  <th className="p-3">الدفع</th>
                  <th className="p-3">التفعيل</th>
                  <th className="p-3">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {families.map((family) => (
                  <tr key={family.id} className="border-t border-slate-100">
                    <td className="p-3 font-bold">{family.name}</td>
                    <td className="p-3">{family.profiles?.[0]?.full_name || "—"}</td>
                    <td className="p-3">{family.profiles?.[0]?.email || "—"}</td>
                    <td className="p-3">{family.payment_status}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${family.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {family.active ? "مفعل" : "منتظر"}
                      </span>
                    </td>
                    <td className="p-3">
                      {family.active ? (
                        <Button variant="danger" onClick={() => setActivation(family, false)}>إيقاف</Button>
                      ) : (
                        <Button onClick={() => setActivation(family, true)}>تفعيل</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
