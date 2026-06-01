"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";
import { BookOpen, Heart, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [phone, setPhone] = useState("");
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
        data: {
          first_name: firstName,
          second_name: secondName,
          full_name: `${firstName} ${secondName}`.trim(),
          family_name: familyName,
          phone,
        },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    // Redirect to login with successful signup query param
    router.push("/login?signup_success=true");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-islamic-grid p-4 sm:p-6 font-sans antialiased">
      <Card className="w-full max-w-xl glass-card border border-emerald-500/10 shadow-xl p-6 sm:p-8 text-right relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow shadow-emerald-950/10">
            <BookOpen className="h-5 w-5 text-amber-100" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-emerald-950">ختمة عيلة</span>
            <span className="mr-2 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">بساطة وبركة</span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">ابدأ ختمة عيلتك بسهولة</h1>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            أنشئ حسابك وجهّز أول ختمة للعيلة في خطوات بسيطة، وبكل راحة وخصوصية.
          </p>
        </div>

        {/* Trust Pill */}
        <div className="bg-amber-50/50 border border-amber-500/10 rounded-2xl p-3.5 mb-6 flex items-start gap-3 text-right">
          <Heart className="h-4 w-4 text-amber-600 fill-amber-500/10 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-amber-900 font-semibold">
            "الاشتراك رمزي لتغطية مصاريف التشغيل والصيانة الفنية، وجزء من كل اشتراك يخرج كصدقة جارية بإذن الله."
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="الاسم الأول"
              value={firstName}
              onChange={setFirstName}
              placeholder="مثال: أحمد"
              required
            />

            <Input
              label="الاسم الثاني"
              value={secondName}
              onChange={setSecondName}
              placeholder="مثال: محمود"
              required
            />
          </div>

          <Input
            label="اسم العيلة / اسم الختمة"
            value={familyName}
            onChange={setFamilyName}
            placeholder="مثال: عيلة الحاج محمود"
            required
          />

          <Input
            label="رقم تليفون عليه واتساب"
            value={phone}
            onChange={setPhone}
            placeholder="مثال: 01012345678"
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
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-700">
              ⚠️ {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold shadow-md shadow-emerald-900/15"
          >
            {loading ? "جاري إنشاء حساب العيلة..." : "إنشاء حساب العيلة"}
          </Button>
        </form>

        {/* Existing account link */}
        <p className="mt-6 text-center text-xs font-semibold text-slate-400">
          عندك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-emerald-700 hover:underline">
            تسجيل الدخول من هنا
          </Link>
        </p>
      </Card>
    </main>
  );
}