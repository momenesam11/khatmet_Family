"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui";
import { 
  BookOpen, 
  Heart, 
  Sparkles, 
  Users, 
  Moon, 
  Gift, 
  Calendar,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export default function OnboardingSetupPage() {
  const router = useRouter();

  // Authentication & DB checks
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [error, setError] = useState("");

  // Step states (1 to 4)
  const [step, setStep] = useState(1);

  // Form states
  const [familyName, setFamilyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("ختمة عائلية مستمرة");

  // Load auth state and check if onboarding/setup was already done
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      
      // Check if user already has a family row in the database
      const { data: familyData } = await supabase
        .from("families")
        .select("*")
        .eq("owner_id", data.user.id)
        .maybeSingle();

      if (familyData) {
        setHasFamily(true);
        setFamilyName(familyData.name);
      } else {
        // Pre-fill fields from user metadata
        const meta = data.user.user_metadata || {};
        setOwnerName(meta.full_name || `${meta.first_name || ""} ${meta.second_name || ""}`.trim() || "");
        setFamilyName(meta.family_name || "");
        setPhone(meta.phone || "");
      }
      
      setLoading(false);
    }

    checkUser();
  }, [router]);

  // Handle final submission to Supabase
  async function handleSubmitOnboarding() {
    setError("");
    setSaving(true);

    try {
      // 1. Insert the family row in Supabase
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .insert({
          owner_id: userId,
          name: familyName,
          payment_status: "pending",
          active: false,
        })
        .select("*")
        .single();

      if (familyError) {
        throw new Error(familyError.message);
      }

      // 2. Add an optional initial member (the owner themselves) to make the dashboard look active
      await supabase.from("members").insert({
        family_id: familyData.id,
        name: ownerName,
        phone: phone || null,
        level: "صفحة يوميًا",
      });

      // 3. Update user auth metadata to flag onboarding completed
      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          khatma_purpose: purpose,
          setup_step: 4
        }
      });

      // Redirect to dashboard where pending message will show
      router.push("/dashboard?setup_completed=true");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى.");
      setSaving(false);
    }
  }

  // Render Loading State
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-islamic-grid p-6">
        <div className="text-center space-y-3 font-sans">
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
          <p className="font-bold text-slate-600 text-sm">جاري تهيئة مساحة الإعداد...</p>
        </div>
      </main>
    );
  }

  // Render Completed / Already setup blocker screen
  if (hasFamily) {
    return (
      <main className="grid min-h-screen place-items-center bg-islamic-grid p-4 sm:p-6 font-sans">
        <Card className="w-full max-w-lg glass-card-emerald border border-emerald-500/10 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
            <CheckCircle className="h-10 w-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800">إعداداتك مكتملة بنجاح!</h1>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              لقد قمت مسبقاً بإنشاء مساحة العيلة الخاصة بك باسم <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">“{familyName}”</span>. 
              يمكنك الدخول مباشرة إلى لوحة التحكم للبدء بتوزيع القراءة.
            </p>
          </div>

          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold"
          >
            الذهاب للوحة التحكم
          </Button>
        </Card>
      </main>
    );
  }

  const purposes = [
    { name: "ختمة عائلية مستمرة", icon: Users, desc: "توزيع يومي متتالي لختم القرآن باستمرار" },
    { name: "ختمة رمضان", icon: Moon, desc: "ورد مكثف وخاص بشهر رمضان المبارك" },
    { name: "ختمة لروح متوفي", icon: Heart, desc: "صدقة جارية ودعاء لروح فقيد غالي" },
    { name: "ختمة بنية معينة", icon: Sparkles, desc: "ختم القرآن بنية الشفاء، التوفيق، أو الفرج" },
    { name: "ورد يومي للعيلة", icon: Calendar, desc: "ورد يومي بسيط للمتابعة وربط القلوب بالقرآن" },
    { name: "جروب أصحاب أو مقرأة", icon: Compass, desc: "تنظيم القراءة لمجموعة أصدقاء أو مسجد" },
  ];

  return (
    <main className="grid min-h-screen place-items-center bg-islamic-grid p-4 sm:p-6 font-sans antialiased text-right">
      <Card className="w-full max-w-2xl glass-card border border-slate-200/60 shadow-xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
        {/* Soft decorative visual */}
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />

        {/* Top Progress bar and steps */}
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              الخطوة {step} من 4
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-emerald-950">إعداد الختمة الأولى</span>
              <BookOpen className="h-4 w-4 text-emerald-700" />
            </div>
          </div>

          {/* Steps Visual Progress indicators */}
          <div className="flex items-center gap-1.5 mb-8 justify-end">
            {[4, 3, 2, 1].map((i) => (
              <span 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === step 
                    ? "bg-emerald-700 scale-y-110" 
                    : i < step 
                      ? "bg-emerald-700/40" 
                      : "bg-slate-150"
                }`}
              />
            ))}
          </div>

          {/* STEP 1: WELCOME SCREEN */}
          {step === 1 && (
            <div className="space-y-6 text-center py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">أهلاً بيك في ختمة عيلة 🕊️</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto font-medium">
                  نحن هنا لمساعدتكم على الاستمرار في ختم القرآن الكريم كعائلة واحدة، بدون تعقيد، وبكل راحة وخصوصية.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-md mx-auto">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  "خلينا نجهز أول ختمة لعيلتك في خطوات بسيطة، من غير أي إحراج أو عشوائية في جروبات واتساب."
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: FAMILY DETAILS FORM */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">تأكيد بيانات العيلة</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold">تأكد من صحة بيانات مسؤول العيلة والمساحة الخاصة بكم.</p>
              </div>
              
              <div className="space-y-4 pt-2">
                <Input
                  label="اسم العيلة"
                  value={familyName}
                  onChange={setFamilyName}
                  placeholder="مثال: عيلة الحاج محمود"
                  required
                />
                
                <Input
                  label="اسم المسؤول"
                  value={ownerName}
                  onChange={setOwnerName}
                  placeholder="الاسم الكامل"
                  required
                />

                <Input
                  label="رقم واتساب للتواصل (اختياري)"
                  value={phone}
                  onChange={setPhone}
                  placeholder="01012345678"
                />
              </div>
            </div>
          )}

          {/* STEP 3: KHATMA PURPOSE GRID */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">الختمة دي معمولة ليه؟</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold">اختر نية وهدف الختمة الأولى لمساعدتنا على ضبط التوزيع بالشكل الأنسب.</p>
              </div>

              {/* Grid Layout of Selectable Options */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {purposes.map((p) => {
                  const Icon = p.icon;
                  const isSelected = purpose === p.name;
                  return (
                    <div 
                      key={p.name}
                      onClick={() => setPurpose(p.name)}
                      className={`border rounded-2xl p-4 text-right cursor-pointer transition hover:border-emerald-300 ${
                        isSelected 
                          ? "border-emerald-700 bg-emerald-50/30 shadow-sm" 
                          : "border-slate-200/80 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800"
                        }`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{p.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TRIAL AND ACCOUNT STATUS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800">تفعيل حساب العيلة</h2>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold">اللمسات الأخيرة لربط عيلتك بمجلس القراءة القرآني.</p>
              </div>

              <div className="bg-amber-50/40 border border-amber-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-amber-700 fill-amber-500/10 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-900 text-sm">حسابك بانتظار التفعيل</h4>
                    <p className="text-xs leading-relaxed text-amber-800 font-semibold">
                      بعد تأكيد مساحة العيلة، سيقوم المسؤول بمراجعة وتفعيل الحساب. الاشتراك رمزي لمرة واحدة فقط لتغطية مصاريف التشغيل، وجزء من كل اشتراك يخرج كصدقة جارية بإذن الله.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">ملخص أول ختمة للعيلة:</h4>
                <ul className="text-xs text-slate-500 space-y-1.5 font-medium pr-1">
                  <li>• اسم العيلة: <span className="font-bold text-slate-700">{familyName}</span></li>
                  <li>• نية الختمة: <span className="font-bold text-slate-700">{purpose}</span></li>
                  <li>• مالك الختمة: <span className="font-bold text-slate-700">{ownerName}</span></li>
                </ul>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-bold text-rose-700">
                  ⚠️ {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic CTAs Bottom bar */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Back button */}
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={saving}
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          {/* Next / Submit button */}
          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 2 && (!familyName || !ownerName)) {
                  setError("يرجى ملء جميع الحقول المطلوبة للمتابعة.");
                  setTimeout(() => setError(""), 2000);
                  return;
                }
                setStep(step + 1);
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow shadow-emerald-950/5 active:scale-95"
            >
              <span>التالي</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitOnboarding}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow shadow-emerald-950/15 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>جاري إنشاء الختمة...</span>
                </>
              ) : (
                <>
                  <span>إرسال بيانات التفعيل وتأكيد الختمة</span>
                  <ArrowLeft className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </main>
  );
}
