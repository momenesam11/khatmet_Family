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

export default function AdminPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [message, setMessage] = useState("جاري التحميل...");
  const [loading, setLoading] = useState(true);

  const profilesById = useMemo(() => {
    const map = new Map<string, Profile>();
    profiles.forEach((item) => map.set(item.id, item));
    return map;
  }, [profiles]);

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

    const ownerIds = Array.from(new Set(safeFamilies.map((family) => family.owner_id)));

    if (ownerIds.length === 0) {
      setProfiles([]);
      return;
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role")
      .in("id", ownerIds);

    if (profilesError) {
      setMessage(profilesError.message);
      return;
    }

    setProfiles((profilesData || []) as Profile[]);
  }

  async function setActivation(family: Family, active: boolean) {
    const { error } = await supabase
      .from("families")
      .update({
        active,
        payment_status: active ? "paid" : "pending",
      })
      .eq("id", family.id);

    if (error) {
      setMessage(error.message);
      return;
    }

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
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">Admin Panel</h1>
            <p className="mt-1 text-slate-500">
              من هنا تفعّل حسابات العملاء بعد الدفع.
            </p>
          </div>

          <Link href="/dashboard">
            <Button variant="secondary">لوحة العميل</Button>
          </Link>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
            {message}
          </div>
        )}

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
                {families.map((family) => {
                  const owner = profilesById.get(family.owner_id);

                  return (
                    <tr key={family.id} className="border-t border-slate-100">
                      <td className="p-3 font-bold">{family.name}</td>
                      <td className="p-3">{owner?.full_name || "—"}</td>
                      <td className="p-3">{owner?.email || "—"}</td>
                      <td className="p-3">{family.payment_status}</td>
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
                        {family.active ? (
                          <Button
                            variant="danger"
                            onClick={() => setActivation(family, false)}
                          >
                            إيقاف
                          </Button>
                        ) : (
                          <Button onClick={() => setActivation(family, true)}>
                            تفعيل
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {families.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-slate-500" colSpan={6}>
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