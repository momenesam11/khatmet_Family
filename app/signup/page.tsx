"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-emerald-50 p-6">
      <Card className="w-full max-w-md">
        <Link href="/" className="mb-5 block text-sm font-bold text-slate-500">→ رجوع</Link>
        <h1 className="text-3xl font-black">إنشاء حساب</h1>
        <p className="mt-2 text-slate-600">المسؤول فقط هو اللي يحتاج حساب. أفراد العيلة يستخدمون رابط مباشر.</p>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <Input label="الاسم" value={name} onChange={setName} required />
          <Input label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" required />
          <Input label="كلمة المرور" value={password} onChange={setPassword} type="password" required />
          {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}</Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          عندك حساب؟ <Link href="/login" className="font-bold text-emerald-700">تسجيل الدخول</Link>
        </p>
      </Card>
    </main>
  );
}
