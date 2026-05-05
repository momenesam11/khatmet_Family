"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-emerald-50 p-6">
      <Card className="w-full max-w-md">
        <Link href="/" className="mb-5 block text-sm font-bold text-slate-500">→ رجوع</Link>
        <h1 className="text-3xl font-black">تسجيل الدخول</h1>
        <p className="mt-2 text-slate-600">ادخل على لوحة تحكم العيلة.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Input label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" required />
          <Input label="كلمة المرور" value={password} onChange={setPassword} type="password" required />
          {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "جاري الدخول..." : "دخول"}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          لسه معندكش حساب؟ <Link href="/signup" className="font-bold text-emerald-700">إنشاء حساب</Link>
        </p>
      </Card>
    </main>
  );
}
