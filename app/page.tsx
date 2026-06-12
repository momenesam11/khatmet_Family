import React from "react";
import Image from "next/image";
import { 
  Navbar, 
  DashboardMockup, 
  WhatsAppMessageCard, 
  MemberExperienceMockup, 
  FAQSection, 
  Footer 
} from "@/components/landing-components";
import { 
  AlertOctagon, 
  Users, 
  Clock, 
  Lock, 
  HelpCircle,
  Sparkles,
  Link2,
  TrendingUp,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  Heart,
  ChevronLeft,
  Check
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-islamic-grid relative antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-16 lg:pb-32">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Hero Content (Right aligned RTL) */}
          <div className="space-y-8 text-right order-first lg:order-last">
            {/* Trust pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              ✦ بدون اشتراك شهري — دعم وتكامل عائلي
            </div>
            
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-emerald-950 font-sans">
                خلّي ختمة العيلة <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
                  تكمل للنهاية
                </span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
                نظّم الورد بين أفراد العيلة، وخلي المتابعة أسهل من غير إحراج، عشوائية، أو رسائل مفقودة وسط مجموعات واتساب.
              </p>
            </div>

            {/* Trust message pill */}
            <div className="glass-card-gold rounded-2xl p-4 border border-amber-500/10 flex items-center gap-4 max-w-xl shadow-sm">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Heart className="h-5 w-5 fill-amber-500/20" />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-amber-900 font-semibold text-right">
                "الاشتراك رمزي لتغطية مصاريف التشغيل والصيانة الفنية، وجزء من كل اشتراك يخرج كصدقة جارية بإذن الله."
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="signup"
                className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 px-8 py-4 text-center text-base font-bold text-white shadow-lg shadow-emerald-900/15 hover:shadow-xl active:scale-98 transition-all duration-200"
              >
                ابدأ ختمة العيلة الآن
              </a>
              <a 
                href="#how-it-works"
                className="rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 px-8 py-4 text-center text-base font-bold text-slate-700 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>شاهد كيف يعمل</span>
                <ChevronLeft className="h-5 w-5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Hero Visual Mockup + Corner Illustration (Left aligned) */}
          <div className="relative order-last lg:order-first flex flex-col items-center justify-center">
            
            {/* Soft Quran stand corner visual */}
            <div className="absolute -right-12 -bottom-10 w-44 h-44 opacity-25 lg:opacity-75 z-0 pointer-events-none transition-all duration-300">
              <Image 
                src="/quran_illustration.png" 
                alt="قرآن كريم" 
                width={176} 
                height={176} 
                className="object-contain" 
              />
            </div>
            
            {/* Dashboard Mockup (Main element) */}
            <div className="w-full max-w-md z-10">
              <DashboardMockup />
            </div>

            {/* Floating WhatsApp Reminder Preview */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 hidden sm:block scale-95 lg:scale-100 hover:scale-105 transition-all duration-300">
              <WhatsAppMessageCard className="shadow-xl" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Section 1 — Problem */}
      <section className="bg-slate-50/50 border-y border-slate-200/50 py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">تحديات التنظيم</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              الختمة على واتساب تبدأ بحماس… وبعدها بتتلخبط
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">
              الكل يحب يشارك في قراءة القرآن، لكن الطريقة التقليدية تواجه عقبات مستمرة:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-right space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">التنظيم يدوي</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                توزيع الصفحات ومتابعتها يدويًا يستهلك وقت ومجهود كبير من مسؤول الختمة كل يوم.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-right space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">المتابعة صعبة</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                مفيش طريقة واضحة أو لوحة تفاعلية تعرف بيها مين قرأ ورده اليوم ومين لسه متأخر.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-right space-y-4">
              <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">الخصوصية مفقودة</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                بعض أفراد العيلة يتأخرون في القراءة ويشعرون بالحرج أمام الجميع داخل المجموعة.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-right space-y-4">
              <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">التذكير العشوائي</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                الرسائل تضيع وسط الكلام اليومي، والتذكير الفردي يصبح مرهقًا ومحرجًا للغاية.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section 2 — Solution / Features */}
      <section id="features" className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">الحل الذكي والحديث</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              ختمة عيلة بتنظّم كل ده ببساطة
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">
              أدوات مصممة خصيصًا لتوفير الراحة، التنظيم، والخصوصية لكل أفراد العائلة:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300 text-right space-y-3 border border-emerald-500/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">توزيع تلقائي للورد</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                توزيع ذكي ومتوازن لصفحات القرآن يوميًا بين أفراد العيلة بالتساوي والتسلسل التلقائي.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300 text-right space-y-3 border border-emerald-500/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <Link2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">رابط خاص لكل فرد</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                كل عضو في العيلة له رابط خاص وبسيط يدخل منه بلمسة واحدة ليرى ورده وحالته اليومية.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300 text-right space-y-3 border border-emerald-500/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">متابعة التقدم</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                لوحة تحكم واضحة ومباشرة للمسؤول توضح نسبة الإنجاز والورد التالي والمتأخرين.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300 text-right space-y-3 border border-emerald-500/5">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">تذكيرات واتساب ذكية</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                تجهيز رسائل وصور تذكيرية هادئة ولطيفة ترسلها بضغطة واحدة دون إحراج أو إزعاج.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card-emerald rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300/50 transition-all duration-300 text-right space-y-3 border border-emerald-500/5 sm:col-span-2 lg:col-span-1">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-850">بطاقة مشاركة يومية</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                توليد بطاقة جميلة وملخصة لحالة الختمة لمشاركتها مع العيلة لتحفيز الجميع والاستمرار.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section 3 — How It Works */}
      <section id="how-it-works" className="bg-[#FAF8F2] py-20 border-y border-amber-900/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block">سهولة بالغة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-850">
              كيف يعمل؟ 4 خطوات بسيطة
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">
              الخطوات مصممة لتكون خالية من التعقيد ومناسبة لجميع الفئات والأعمار:
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Desktop Dotted Connecting Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 border-t-2 border-dashed border-emerald-700/10 -translate-y-1/2 hidden lg:block z-0" />
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center relative flex flex-col items-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 right-4 h-9 w-9 bg-emerald-700 border-4 border-[#FAF8F2] rounded-full flex items-center justify-center font-black text-white text-sm">
                  1
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">أنشئ ختمة العيلة</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  حدد اسم العيلة وهدف الختمة (أجزاء، صفحات) ونوع التوزيع بسهولة تامة.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center relative flex flex-col items-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 right-4 h-9 w-9 bg-emerald-700 border-4 border-[#FAF8F2] rounded-full flex items-center justify-center font-black text-white text-sm">
                  2
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Link2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">ندعو أفراد العيلة</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  ارسل الرابط الخاص والمنفرد لكل عضو في العائلة بضغطة زر عبر الواتساب.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center relative flex flex-col items-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 right-4 h-9 w-9 bg-emerald-700 border-4 border-[#FAF8F2] rounded-full flex items-center justify-center font-black text-white text-sm">
                  3
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">كل فرد يقرأ يوميًا</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  يفتح رابطه الخاص، يرى ورده اليومي بوضوح، ويسجل قراءته بلمسة واحدة.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm text-center relative flex flex-col items-center space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-4 right-4 h-9 w-9 bg-emerald-700 border-4 border-[#FAF8F2] rounded-full flex items-center justify-center font-black text-white text-sm">
                  4
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">المتابعة والتذكير</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  شاهد تقدم الختمة بشكل لحظي، وذكّر المتأخرين بأسلوب لطيف وصور جاهزة.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 4 — Member Experience */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Visual (Left): Interactive Phone Mockup */}
            <div className="flex justify-center order-last lg:order-first">
              <div className="relative">
                {/* Visual indicator of clicking */}
                <div className="absolute -right-4 -top-4 bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full border border-amber-200 shadow-sm animate-bounce z-30">
                  👆 جرب الضغط على الأزرار بالداخل!
                </div>
                <MemberExperienceMockup />
              </div>
            </div>

            {/* Content (Right) */}
            <div className="space-y-8 text-right order-first lg:order-last">
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">بساطة مطلقة للأعضاء</span>
                <h2 className="text-3xl font-black text-emerald-950">
                  كل فرد يدخل من رابط بسيط
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                  بدون تسجيل، بدون كلمة مرور، وبدون خطوات معقدة. كل فرد يفتح الرابط الخاص به ويعرف ورده اليومي فورًا ويسجل حالته بضغطة زر واحدة.
                </p>
              </div>

              {/* Bullets Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-sm">رابط بسيط للجميع</h4>
                    <p className="text-[11px] text-slate-400">لا يتطلب تحميل تطبيقات أو تسجيل حسابات</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-sm">مناسب لكبار السن</h4>
                    <p className="text-[11px] text-slate-400">واجهة واضحة بخطوط كبيرة وخطوات مباشرة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-sm">لا يحتاج حساب</h4>
                    <p className="text-[11px] text-slate-400">كل مستخدم له رابط مشفر وآمن مسبقًا</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200/60">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-800 text-sm">تسجيل بخطوة واحدة</h4>
                    <p className="text-[11px] text-slate-400">تأكيد القراءة بلمسة واحدة يحدّث لوحة العائلة</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Section 5 — Family Owner Dashboard */}
      <section className="bg-slate-50/50 border-y border-slate-200/50 py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Content (Right) */}
            <div className="space-y-6 text-right">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block">التحكم والترتيب للمسؤول</span>
              <h2 className="text-3xl font-black text-slate-850">
                لوحة بسيطة لمسؤول العيلة
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                كل شيء واضح أمامك في مكان واحد: تقدم الورد، المتأخرون، التذكيرات الذكية، وإنشاء ورد جديد أو إغلاق الختمة الحالية بضغطة زر.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">✓</div>
                  <p className="text-slate-600 text-sm font-semibold">متابعة إنجاز الورد اليومي ومشاركة بطاقات النجاح.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">✓</div>
                  <p className="text-slate-600 text-sm font-semibold">تعديل الورد أو إسناد قراءات بشكل يدوي في حال رغبة العضو.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-1">✓</div>
                  <p className="text-slate-600 text-sm font-semibold">أتمتة إرسال تذكيرات لطيفة على الخاص أو المجموعات.</p>
                </div>
              </div>

              {/* Sample Actions Bar mimicking Dashboard Controls */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition">
                  💬 إرسال تذكير واتساب
                </button>
                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition">
                  ✏️ تسجيل قراءة يدوية
                </button>
                <button className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs py-2.5 px-4 rounded-xl transition">
                  🔄 إنهاء الورد وتوزيع جديد
                </button>
              </div>
            </div>

            {/* Visual (Left): Stats card + members list representation */}
            <div className="flex justify-center">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-800" />
                <div className="space-y-5 text-right">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-400">لوحة المتابعة العامة</span>
                    <h4 className="font-bold text-slate-800 text-sm">مؤشرات التقدم الكلية</h4>
                  </div>

                  {/* Circular & Linear Progress Mockup */}
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

                  {/* List Mockup preview */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">قرأ</span>
                      <p className="text-xs font-bold text-slate-700">أحمد — من صفحة 42 إلى 43</p>
                    </div>
                    <div className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">لم يقرأ</span>
                      <p className="text-xs font-bold text-slate-700">عمر — من صفحة 46 إلى 47</p>
                    </div>
                    <div className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">اعتذر</span>
                      <p className="text-xs font-bold text-slate-700">سارة — من صفحة 48 إلى 49</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Section 6 — WhatsApp Support */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">التكامل الذكي</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-850">
              يساعدك تستخدم واتساب بشكل أذكى
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">
              التطبيق لا يستبدل واتساب، لكنه ينظم المتابعة ويجهز لك رسائل لطيفة وواضحة ترسلها بضغطة زر واحدة.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            
            {/* Visual (Left): Central WhatsApp Icon Visual */}
            <div className="flex justify-center">
              <div className="h-44 w-44 rounded-full bg-emerald-50 border-4 border-dashed border-emerald-200 flex items-center justify-center relative p-8 shadow-inner animate-pulse">
                <div className="h-28 w-28 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                  <MessageCircle className="h-16 w-16 fill-white text-emerald-500" />
                </div>
                {/* Small decoration badges */}
                <div className="absolute top-1 right-2 bg-white text-slate-700 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-slate-100 shadow-sm">
                  تنظيم تلقائي
                </div>
                <div className="absolute bottom-2 left-1 bg-amber-50 text-amber-800 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200 shadow-sm">
                  رسائل جاهزة
                </div>
              </div>
            </div>

            {/* Grid of benefits (Right) */}
            <div className="grid gap-4 sm:grid-cols-2 text-right">
              
              <div className="bg-white border border-slate-200/70 p-5 rounded-2xl space-y-2 hover:border-emerald-300 transition shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">إرسال التذكيرات بأسلوب لطيف</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  رسائل تذكير لطيفة ومدروسة للغاية لا تحتوي على أي إحراج للأعضاء.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-5 rounded-2xl space-y-2 hover:border-emerald-300 transition shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">رسائل جاهزة بدون إحراج</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  النظام يقوم بتصميم وصياغة رسالة الورد الفردي تلقائيًا لتشاركها بضغطة زر.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-5 rounded-2xl space-y-2 hover:border-emerald-300 transition shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">بطاقات مشاركة يومية</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  احصل على بطاقة إنجاز مبسطة لمشاركتها في جروب العيلة لرفع المعنويات.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-5 rounded-2xl space-y-2 hover:border-emerald-300 transition shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">تنظيم بين الخاص والعام</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  يظل التنسيق والمتابعة الدقيقة في لوحتك الخاصة، بينما يشارك الجروب التفاعل والحماس.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 9. Section 7 — Pricing */}
      <section id="pricing" className="bg-[#FAF8F2] py-20 border-y border-amber-900/5 relative">
        <div className="absolute inset-0 bg-radial-gradient-glow pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block">مساهمة رمزية ودائمة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-850">
              اشتراك رمزي يساعد الخدمة تكمل
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base font-medium">
              نحن لا نهدف للربح التجاري الصرف؛ الاشتراك رمزي ولدفعة واحدة لتغطية تكاليف السيرفرات والتطوير المستمر.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md glass-card-gold rounded-3xl p-8 border border-amber-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative text-center">
              
              {/* Decorative top ribbon */}
              <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-black tracking-wider px-4 py-1.5 rounded-full shadow border border-amber-400/20 uppercase font-sans">
                حساب العائلة مدى الحياة
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-emerald-950">باقة عيلة واحدة متكاملة</h3>
                  <p className="text-xs text-slate-400 mt-1">شراء لمرة واحدة فقط — لا اشتراك شهري أو سنوي</p>
                </div>

                <div className="py-4 bg-[#FAF9F5]/80 rounded-2xl border border-amber-900/5">
                  <p className="text-5xl font-black text-emerald-900 font-sans">299 جنيه</p>
                  <p className="text-xs font-bold text-amber-700 mt-1.5">دفع مرة واحدة ومدى الحياة</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">اشتراك رمزي لتغطية مصاريف التشغيل</p>
                </div>

                {/* Features List */}
                <ul className="text-right space-y-3.5 px-2">
                  <li className="flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>عدد غير محدود من أفراد العائلة</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>إنشاء أوراد وختمات متعددة ومتتالية</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>لوحة متابعة وإحصائيات متكاملة للمسؤول</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>روابط خاصة لكافة الأعضاء بدون كلمات مرور</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-semibold">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>دعم فني متواصل وتحديثات دائمة مجانًا</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="pt-2">
                  <a 
                    href="#pay"
                    className="block w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 py-4 text-center text-sm font-bold text-white shadow-md active:scale-98 transition-all duration-200"
                  >
                    اشترك الآن وابدأ ختمتك
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Section 8 — Charity / Sadaqah */}
      <section className="py-20 relative bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="glass-card-gold rounded-3xl p-8 sm:p-12 border border-amber-500/15 shadow-md flex flex-col md:flex-row items-center gap-8 text-right relative overflow-hidden bg-gradient-to-br from-amber-50/20 via-white to-white">
            
            {/* Background design accents */}
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Icon (Right aligned/Center) */}
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
              <Heart className="h-10 w-10 fill-amber-500/10 text-amber-600" />
            </div>

            {/* Content text */}
            <div className="space-y-4 flex-1">
              <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">بركة الورد القرآني</span>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950">جزء من كل اشتراك يخرج كصدقة جارية</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                نؤمن يقيناً أن التقنية عندما توظف لخدمة كتاب الله عز وجل، يجب أن تفيض بالبركة وتتحلى بالصدق والأمانة والنية الواضحة. لذلك نلتزم باقتطاع جزء محدد من قيمة كل مساهمة رمزية تخرج كصدقة جارية بإذن الله لدعم المشاريع والجمعيات الخيرية.
              </p>
              <div className="flex gap-2 text-xs font-bold text-amber-800 pt-1">
                <span>✦ شاركنا في الأجر</span>
                <span>•</span>
                <span>ختمة عيلتك سبب لخيرٍ مستمر للجميع</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. Section 9 — FAQ */}
      <FAQSection />

      {/* 12. Final CTA Section */}
      <section className="bg-[#FAF8F2] border-t border-amber-900/5 py-24 relative overflow-hidden text-center">
        {/* Soft geometric styling in background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 leading-tight">
              ابدأ ختمة عيلتك من غير عشوائية
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-medium">
              نظّم الورد، تابع التقدم اليومي بكل أمان وخصوصية، وخلّي العيلة تكمل قراءة القرآن الكريم للنهاية بإذن الله.
            </p>
          </div>

          <div className="pt-2">
            <a 
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-emerald-900/20 active:scale-98 transition-all duration-200"
            >
              <span>ابدأ الآن ودعنا ننظم ختمتك</span>
              <ArrowRight className="h-5 w-5 transform rotate-180" />
            </a>
          </div>

          {/* Minimal footer visual element */}
          <div className="pt-10 max-w-sm mx-auto flex items-center justify-center gap-4 text-xs font-semibold text-slate-400">
            <span>✓ تفعيل فوري للحساب</span>
            <span>•</span>
            <span>✓ ضمان استرداد 100%</span>
            <span>•</span>
            <span>✓ بدون التزام شهري</span>
          </div>

        </div>
      </section>

      {/* 13. Footer */}
      <Footer />

    </main>
  );
}
