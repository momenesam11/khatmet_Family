"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";
import { BookOpen, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
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
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    router.push("/setup");
  }

  return (
    <main
      className="grid min-h-screen place-items-center bg-islamic-grid p-4 sm:p-6 font-sans antialiased"
      dir="rtl"
    >
      <Card className="relative w-full max-w-md overflow-hidden border border-emerald-500/10 p-6 shadow-xl sm:p-8 text-right">
        <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-xl" />

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition hover:text-emerald-700"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow shadow-emerald-950/10">
            <BookOpen className="h-5 w-5 text-amber-100" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-emerald-950">ختمة عيلة</span>
            <span className="mr-2 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600">
              بساطة وبركة
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-black text-slate-800 sm:text-3xl">إنشاء الحساب</h1>
          <p className="text-sm font-medium leading-relaxed text-slate-500">
            ثلاث خطوات بسيطة، وستُكمل إعداد الختمة في الخطوة التالية.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="الاسم الكامل"
            value={fullName}
            onChange={setFullName}
            placeholder="مثال: أحمد محمود"
            required
          />

          <Input
            label="البريد الإلكتروني"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="name@domain.com"
            required
          />

          <Input
            label="كلمة المرور"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-xs font-bold text-rose-700">
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-3.5 font-bold shadow-md shadow-emerald-900/15 hover:from-emerald-700 hover:to-emerald-800"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب والمتابعة →"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-slate-400">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-emerald-700 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </Card>
    </main>
  );
}
