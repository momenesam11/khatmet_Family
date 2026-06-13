"use client";

import React from "react";
import Image from "next/image";
import {
  Navbar,
  DashboardMockup,
  WhatsAppMessageCard,
  MemberExperienceMockup,
  FAQSection,
  Footer,
  ScrollReveal,
  IslamicBackground,
} from "@/components/landing-components";
import {
  AlertOctagon,
  Users,
  Clock,
  Lock,
  Sparkles,
  Link2,
  TrendingUp,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  Heart,
  ChevronLeft,
  Check,
  Shield,
  Zap,
} from "lucide-react";

function IslamicDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <svg width="130" height="14" viewBox="0 0 130 14" fill="none">
        <line x1="0"   y1="7" x2="45"  y2="7" stroke="#047857" strokeWidth="0.8" opacity="0.35"/>
        <polygon points="50,7 53,4 56,7 53,10" fill="#047857" opacity="0.4"/>
        <polygon points="59,7 62,4 65,7 62,10" fill="#047857" opacity="0.65"/>
        <polygon points="68,7 71,4 74,7 71,10" fill="#047857" opacity="0.4"/>
        <line x1="79"  y1="7" x2="130" y2="7" stroke="#047857" strokeWidth="0.8" opacity="0.35"/>
      </svg>
    </div>
  );
}

function SectionHeader({ badge, badgeColor = "emerald", title, subtitle }: {
  badge: string;
  badgeColor?: "emerald" | "amber" | "rose";
  title: string;
  subtitle?: string;
}) {
  const colors = {
    emerald: "text-emerald-800 bg-emerald-50 border-emerald-100",
    amber:   "text-amber-700  bg-amber-50  border-amber-100",
    rose:    "text-rose-700   bg-rose-50   border-rose-100",
  };
  return (
    <ScrollReveal animation="reveal" className="text-center space-y-3 mb-16">
      <IslamicDivider />
      <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${colors[badgeColor]}`}>
        {badge}
      </span>
      <h2 className="text-2xl sm:text-3xl font-black text-slate-800">{title}</h2>
      {subtitle && (
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}

export default function Home() {
  return (
    <main
      className="min-h-screen bg-islamic-grid relative antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-950 font-sans"
      style={{ animation: "page-enter 0.6s ease-out both" }}
    >
      <IslamicBackground />

      <Navbar />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-32">
        {/* Soft background glows */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0  w-80 h-80 bg-amber-500/5  rounded-full blur-3xl pointer-events-none" />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* Hero content */}
          <ScrollReveal animation="reveal" className="space-y-8 text-right order-first lg:order-last">

            {/* "مجاني" pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" style={{ animation: "glow-pulse 2s ease-in-out infinite" }}/>
              مجاني بالكامل — بدون بطاقة ائتمان
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-emerald-950 font-sans">
                خلّي ختمة العيلة <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
                  تكمل للنهاية
                </span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
                نظّم الورد بين أفراد العيلة، وتابع التقدم يومياً بسهولة — بدون عشوائية أو رسائل مفقودة.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/signup"
                className="rounded-2xl bg-emerald-800 hover:bg-emerald-900 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-emerald-900/15 transition-all duration-200"
                style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
              >
                ابدأ مجاناً الآن
              </a>
              <a
                href="#how-it-works"
                className="rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 px-8 py-4 text-center text-base font-bold text-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>شاهد كيف يعمل</span>
                <ChevronLeft className="h-5 w-5 text-slate-400" />
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { icon: <Shield className="h-3.5 w-3.5"/>,  text: "مجاني 100%"       },
                { icon: <Zap     className="h-3.5 w-3.5"/>,  text: "بدون تسجيل للأعضاء" },
                { icon: <Lock    className="h-3.5 w-3.5"/>,  text: "خاص وآمن"         },
              ].map(({ icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-100 px-3 py-1.5 rounded-full">
                  {icon} {text}
                </span>
              ))}
            </div>

          </ScrollReveal>

          {/* Hero visual */}
          <ScrollReveal animation="reveal-right" delay={150}
            className="relative order-last lg:order-first flex flex-col items-center justify-center">

            {/* Quran illustration */}
            <div className="absolute -right-4 -bottom-6 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 opacity-60 z-0 pointer-events-none"
              style={{ animation: "float-gentle 6s ease-in-out infinite" }}>
              <Image src="/quran_illustration.png" alt="قرآن كريم" width={176} height={176} className="object-contain"/>
            </div>

            {/* Dashboard mockup */}
            <div className="w-full max-w-md z-10"
              style={{ animation: "float-gentle 7s ease-in-out infinite", animationDelay: "1s" }}>
              <DashboardMockup />
            </div>

            {/* WhatsApp reminder card */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:block"
              style={{ animation: "float-gentle 5s ease-in-out infinite", animationDelay: "0.5s" }}>
              <WhatsAppMessageCard className="shadow-xl" />
            </div>

          </ScrollReveal>

        </div>
      </section>

      <section className="bg-white/60 border-y border-slate-200/50 py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="تحديات التنظيم"
            badgeColor="rose"
            title="الختمة على واتساب تبدأ بحماس… وبعدها بتتلخبط"
            subtitle="الكل يحب يشارك في قراءة القرآن، لكن الطريقة التقليدية تواجه عقبات مستمرة:"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Clock className="h-6 w-6"/>,        color: "amber", title: "التنظيم يدوي",       desc: "توزيع الصفحات ومتابعتها يدويًا يستهلك وقت ومجهود كبير من مسؤول الختمة كل يوم." },
              { icon: <Users className="h-6 w-6"/>,        color: "emerald", title: "المتابعة صعبة",     desc: "مفيش طريقة واضحة تعرف بيها مين قرأ ورده اليوم ومين لسه متأخر." },
              { icon: <Lock className="h-6 w-6"/>,         color: "rose",  title: "الخصوصية مفقودة",   desc: "بعض أفراد العيلة يتأخرون ويشعرون بالحرج أمام الجميع داخل المجموعة." },
              { icon: <AlertOctagon className="h-6 w-6"/>, color: "sky",   title: "التذكير العشوائي",   desc: "الرسائل تضيع وسط الكلام اليومي والتذكير الفردي يصبح مرهقًا جداً." },
            ].map(({ icon, color, title, desc }, i) => (
              <ScrollReveal key={title} animation="reveal" delay={i * 80}>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-right space-y-4 h-full">
                  <div className={`h-12 w-12 rounded-xl bg-${color}-50 border border-${color}-100 flex items-center justify-center text-${color}-700`}>
                    {icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="الحل البسيط والمجاني"
            badgeColor="emerald"
            title="ختمة عيلة بتنظّم كل ده بسهولة"
            subtitle="أدوات مصممة لتوفير الراحة والتنظيم والخصوصية لكل أفراد العائلة:"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Sparkles className="h-5 w-5"/>,      title: "توزيع تلقائي للورد",      desc: "توزيع ذكي ومتوازن لصفحات القرآن يومياً بين أفراد العيلة تلقائياً." },
              { icon: <Link2 className="h-5 w-5"/>,         title: "رابط خاص لكل فرد",       desc: "كل عضو له رابط خاص يدخل منه بلمسة واحدة بدون كلمة مرور." },
              { icon: <TrendingUp className="h-5 w-5"/>,    title: "متابعة التقدم لحظياً",    desc: "لوحة تحكم واضحة للمسؤول توضح نسبة الإنجاز والمتأخرين." },
              { icon: <MessageCircle className="h-5 w-5"/>, title: "تذكيرات واتساب جاهزة",   desc: "رسائل تذكيرية لطيفة جاهزة ترسلها بضغطة واحدة بدون إحراج." },
              { icon: <ImageIcon className="h-5 w-5"/>,     title: "بطاقة مشاركة يومية",     desc: "بطاقة إنجاز جميلة لمشاركتها في جروب العيلة لتحفيز الجميع." },
              { icon: <Heart className="h-5 w-5"/>,         title: "مناسب للجميع",           desc: "واجهة بسيطة بخطوط كبيرة مناسبة لكبار السن وصغيرهم." },
            ].map(({ icon, title, desc }, i) => (
              <ScrollReveal key={title} animation="reveal-scale" delay={i * 70}>
                <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 hover:-translate-y-1 transition-all duration-300 text-right space-y-3 border border-emerald-500/5 h-full">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                    {icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#FAF8F2] py-20 border-y border-amber-900/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="سهولة بالغة"
            badgeColor="amber"
            title="كيف يعمل؟ 3 خطوات بسيطة"
            subtitle="مصممة لتكون خالية من التعقيد ومناسبة لجميع الفئات والأعمار:"
          />
          <div className="relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 border-t-2 border-dashed border-emerald-700/10 -translate-y-1/2 hidden lg:block z-0" />
            <div className="grid gap-8 sm:grid-cols-3 relative z-10">
              {[
                { num: "1", icon: <Sparkles className="h-6 w-6"/>, title: "أنشئ ختمة العيلة",  desc: "حدد اسم العيلة وهدف الختمة وعدد الأعضاء بسهولة تامة." },
                { num: "2", icon: <Link2 className="h-6 w-6"/>,    title: "شارك الروابط",       desc: "ارسل الرابط الخاص لكل عضو في العائلة بضغطة زر عبر الواتساب." },
                { num: "3", icon: <TrendingUp className="h-6 w-6"/>, title: "تابع وذكّر",        desc: "شاهد تقدم الختمة بشكل لحظي وذكّر المتأخرين بأسلوب لطيف." },
              ].map(({ num, icon, title, desc }, i) => (
                <ScrollReveal key={num} animation="reveal" delay={i * 120}>
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center relative flex flex-col items-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute -top-4 right-6 h-9 w-9 bg-emerald-800 border-4 border-[#FAF8F2] rounded-full flex items-center justify-center font-black text-white text-sm"
                      style={{ animation: `glow-pulse 2.5s ease-in-out infinite ${i * 0.6}s` }}>
                      {num}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mt-2">
                      {icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <ScrollReveal animation="reveal-left" className="flex justify-center order-last lg:order-first">
              <div className="relative">
                <div className="absolute -right-4 -top-4 bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full border border-amber-200 shadow-sm z-30"
                  style={{ animation: "float-gentle 3s ease-in-out infinite" }}>
                  جرب الضغط
                </div>
                <MemberExperienceMockup />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="reveal-right" delay={100} className="space-y-8 text-right order-first lg:order-last">
              <div className="space-y-3">
                <IslamicDivider />
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">بساطة مطلقة للأعضاء</span>
                <h2 className="text-2xl font-black text-emerald-950 sm:text-3xl">كل فرد يدخل من رابط بسيط</h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                  بدون تسجيل، بدون كلمة مرور. كل فرد يفتح رابطه ويعرف ورده اليومي فوراً.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "رابط بسيط للجميع",     sub: "لا يتطلب تحميل تطبيقات" },
                  { title: "مناسب لكبار السن",      sub: "واجهة واضحة وخطوات مباشرة" },
                  { title: "لا يحتاج حساب",         sub: "رابط مشفر وآمن مسبقًا" },
                  { title: "تسجيل بخطوة واحدة",     sub: "تأكيد القراءة بلمسة واحدة" },
                ].map(({ title, sub }) => (
                  <div key={title} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60 hover:border-emerald-200 transition-colors">
                    <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <section className="bg-white/60 border-y border-slate-200/50 py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <ScrollReveal animation="reveal" className="space-y-6 text-right">
              <div className="space-y-3">
                <IslamicDivider />
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block">التحكم والترتيب للمسؤول</span>
                <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">لوحة بسيطة لمسؤول العيلة</h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                  كل شيء واضح في مكان واحد: تقدم الورد، المتأخرون، والتذكيرات الذكية.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "متابعة إنجاز الورد اليومي ومشاركة بطاقات النجاح",
                  "تعديل الورد أو إسناد قراءات يدويًا عند الحاجة",
                  "إرسال تذكيرات لطيفة بضغطة واحدة",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5"><Check className="h-3 w-3" /></div>
                    <p className="text-slate-600 text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition">
                  إرسال تذكير واتساب
                </button>
                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition">
                  تسجيل قراءة يدوية
                </button>
                <button className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs py-2.5 px-4 rounded-xl transition">
                  توزيع ورد جديد
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="reveal-right" delay={120} className="flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-800" />
                <div className="space-y-5 text-right">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-400">لوحة المتابعة</span>
                    <h4 className="font-bold text-slate-800 text-sm">مؤشرات التقدم الكلية</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-xl font-black text-emerald-700">67%</p>
                      <p className="text-[10px] text-slate-400 font-medium">تقدم الختمة</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-xl font-black text-slate-700">15</p>
                      <p className="text-[10px] text-slate-400 font-medium">أفراد العيلة</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-xl font-black text-rose-600">5</p>
                      <p className="text-[10px] text-slate-400 font-medium">لم يقرأوا بعد</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { status: "قرأ",    color: "emerald", name: "أحمد — من صفحة 42 إلى 43" },
                      { status: "لم يقرأ", color: "amber",   name: "عمر — من صفحة 46 إلى 47"  },
                      { status: "اعتذر",  color: "slate",   name: "سارة — من صفحة 48 إلى 49"  },
                    ].map(({ status, color, name }) => (
                      <div key={name} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">
                        <span className={`text-xs font-bold text-${color}-700 bg-${color}-50 px-2 py-0.5 rounded`}>{status}</span>
                        <p className="text-xs font-bold text-slate-700">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#FAF8F2] py-20 border-y border-amber-900/5 relative">
        <div className="absolute inset-0 bg-radial-gradient-glow pointer-events-none" />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <ScrollReveal animation="reveal" className="space-y-3 mb-10">
            <IslamicDivider />
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
              مجاني بالكامل
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">ختمة عيلة مجانية بالكامل</h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium max-w-md mx-auto">
              نشغّلها بتبرعات أهلها. لو التطبيق نفعك، فكّر تدعم استمراره.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="reveal-scale" delay={100}>
            <div className="glass-card-gold rounded-3xl p-8 sm:p-10 border border-amber-500/15 shadow-md text-right space-y-6">
              <ul className="space-y-3">
                {[
                  "عدد غير محدود من أفراد العائلة",
                  "ختمات متعددة ومتتالية بدون قيود",
                  "لوحة متابعة وإحصائيات كاملة",
                  "روابط خاصة للأعضاء بدون كلمات مرور",
                  "بدون إعلانات أو بيانات مباعة",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a href="/signup" className="flex-1 rounded-2xl bg-emerald-700 py-4 text-center text-sm font-bold text-white shadow-md transition hover:bg-emerald-800">
                  ابدأ مجاناً الآن
                </a>
                <a href="/payment-pending" className="flex-1 rounded-2xl border border-emerald-200 bg-white py-4 text-center text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
                  ادعم المشروع
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      <section className="py-20 bg-white relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="reveal-scale">
            <div className="glass-card-gold rounded-3xl p-8 sm:p-12 border border-amber-500/15 shadow-md flex flex-col md:flex-row items-center gap-8 text-right relative overflow-hidden">
              <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm"
                style={{ animation: "float-gentle 5s ease-in-out infinite" }}>
                <Heart className="h-10 w-10 fill-amber-500/10" />
              </div>
              <div className="space-y-4 flex-1">
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">صدقتنا الجارية</span>
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950">جزء من كل تبرع يخرج كصدقة جارية بإذن الله</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                  نؤمن أن التقنية عندما توظف لخدمة كتاب الله يجب أن تفيض بالبركة.
                  لذلك نلتزم باقتطاع جزء من كل تبرع ليخرج صدقة جارية لدعم وجوه الخير.
                </p>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm font-semibold text-amber-800">
                  سيتم الإعلان عن أول صدقة قريباً إن شاء الله
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FAQSection />

      <section className="bg-[#FAF8F2] border-t border-amber-900/5 py-24 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/4 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Islamic tile overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cta-tile" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="18,0 42,0 60,18 60,42 42,60 18,60 0,42 0,18" fill="none" stroke="#047857" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-tile)"/>
          </svg>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <ScrollReveal animation="reveal" className="space-y-5">
            <IslamicDivider />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 leading-tight">
              ابدأ ختمة عيلتك من غير عشوائية
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-medium">
              نظّم الورد، تابع التقدم، وخلّي عيلتك تكمل قراءة القرآن الكريم للنهاية بإذن الله.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="reveal-scale" delay={120}>
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200"
              style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
            >
              <span>ابدأ مجاناً الآن</span>
              <ArrowRight className="h-5 w-5 rotate-180" />
            </a>
          </ScrollReveal>

          <ScrollReveal animation="reveal" delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
              <span>مجاني بالكامل</span>
              <span className="hidden sm:inline">•</span>
              <span>تفعيل فوري</span>
              <span className="hidden sm:inline">•</span>
              <span>بدون التزام</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
