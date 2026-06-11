"use client";

import { FormEvent, Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";
import { CheckCircle } from "lucide-react";

// Inner component that reads search params (must be inside Suspense)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("signup_success") === "true") {
      setSignupSuccess(true);
    }
  }, [searchParams]);

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
    <Card className="w-full max-w-md">
      <Link href="/" className="mb-5 block text-sm font-bold text-slate-500">
        → رجوع
      </Link>

      <h1 className="text-2xl font-black sm:text-3xl">تسجيل الدخول</h1>
      <p className="mt-2 text-slate-600">ادخل على لوحة تحكم العيلة.</p>

      {signupSuccess && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-800">
            تم إنشاء الحساب بنجاح! سجّل دخولك بالبريد وكلمة المرور اللي اخترتهم.
          </p>
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <Input label="البريد الإلكتروني" value={email} onChange={setEmail} type="email" required />
        <Input label="كلمة المرور" value={password} onChange={setPassword} type="password" required />
        {error && (
          <div className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري الدخول..." : "دخول"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        لسه معندكش حساب؟{" "}
        <Link href="/signup" className="font-bold text-emerald-700">
          إنشاء حساب
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-emerald-50 p-4 sm:p-6" dir="rtl">
      <Suspense fallback={<div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
