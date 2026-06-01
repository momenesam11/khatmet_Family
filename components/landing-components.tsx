"use client";

import React, { useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  MessageCircle, 
  Users, 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Link2, 
  Smartphone, 
  ShieldCheck, 
  Check, 
  Menu, 
  X,
  Share2,
  Lock,
  ArrowRightLeft
} from "lucide-react";

// --- Header/Navbar ---
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", href: "#" },
    { name: "المزايا", href: "#features" },
    { name: "كيف يعمل؟", href: "#how-it-works" },
    { name: "الأسئلة الشائعة", href: "#faq" },
    { name: "الأسعار", href: "#pricing" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-amber-900/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Right: Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-md shadow-emerald-900/10">
              <BookOpen className="h-6 w-6 text-amber-100" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-900 font-sans">ختمة عيلة</span>
              <span className="mr-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">خدمة عائلية</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[15px] font-semibold text-slate-600 hover:text-emerald-700 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Left: Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="#login" 
              className="rounded-2xl px-5 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50 border border-emerald-100 transition-all duration-200"
            >
              دخول المسؤول
            </a>
            <a 
              href="#pricing" 
              className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 hover:shadow-md transition-all duration-200"
            >
              ابدأ ختمة العيلة
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition"
              >
                {link.name}
              </a>
            ))}
            <hr className="my-2 border-slate-100" />
            <div className="grid grid-cols-2 gap-3 mt-2">
              <a 
                href="#login" 
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-emerald-100 px-4 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition"
              >
                دخول المسؤول
              </a>
              <a 
                href="#pricing" 
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-800 transition"
              >
                ابدأ الختمة
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// --- WhatsApp Message Chat Bubble ---
export function WhatsAppMessageCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#E8F8F2] border border-[#d2efe2] p-4 shadow-sm relative text-right max-w-sm ${className}`}>
      {/* Small WhatsApp Header */}
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-950/5">
        <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
          <MessageCircle className="h-3.5 w-3.5 fill-white" />
        </div>
        <span className="text-[11px] font-bold text-emerald-800">تذكير ختمة العيلة</span>
        <span className="mr-auto text-[9px] text-slate-400">8:30 ص</span>
      </div>
      
      {/* Message Content */}
      <p className="text-[13px] leading-relaxed text-slate-700 font-medium">
        السلام عليكم، تذكير هادئ بورد اليوم من صفحة <span className="font-bold text-emerald-900 bg-white/70 px-1 rounded">43</span> إلى <span className="font-bold text-emerald-900 bg-white/70 px-1 rounded">45</span>، جزاك الله خيرًا. 🌸
      </p>
      
      {/* Bottom Triangle Indicator mimicking chat speech bubble */}
      <div className="absolute right-4 -bottom-2 w-3 h-3 bg-[#E8F8F2] border-r border-b border-[#d2efe2] transform rotate-45"></div>
    </div>
  );
}

// --- Dashboard Mockup ---
export function DashboardMockup({ className = "" }: { className?: string }) {
  const [members, setMembers] = useState([
    { name: "أحمد", status: "read", range: "من صفحة 42 إلى 43" },
    { name: "مريم", status: "read", range: "من صفحة 44 إلى 45" },
    { name: "عمر", status: "unread", range: "من صفحة 46 إلى 47" },
    { name: "سارة", status: "excused", range: "من صفحة 48 إلى 49" },
  ]);

  // Simulate marking a member as read
  const toggleMemberStatus = (index: number) => {
    const updated = [...members];
    if (updated[index].status === "unread") {
      updated[index].status = "read";
    } else if (updated[index].status === "read") {
      updated[index].status = "excused";
    } else {
      updated[index].status = "unread";
    }
    setMembers(updated);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "read":
        return <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">تمت القراءة <Check className="h-3 w-3" /></span>;
      case "excused":
        return <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 flex items-center gap-1">اعتذر اليوم <AlertCircle className="h-3 w-3" /></span>;
      default:
        return <span className="rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-bold text-amber-700 flex items-center gap-1">لم يقرأ بعد <XCircle className="h-3 w-3" /></span>;
    }
  };

  // Calculate statistics dynamically
  const total = members.length;
  const readCount = members.filter(m => m.status === "read").length;
  const progressPercent = Math.round((readCount / total) * 100);

  return (
    <div className={`glass-card-emerald rounded-3xl p-6 shadow-xl relative overflow-hidden text-right border border-emerald-500/10 ${className}`}>
      {/* Decorative top green glow */}
      <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-bold text-emerald-700/80 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">لوحة مسؤول العيلة</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">ورد العيلة اليومي</h3>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-3 text-white shadow-md shadow-emerald-800/10">
            <BookOpen className="h-5 w-5 text-amber-200" />
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">نسبة الإنجاز اليومي</span>
            <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">{progressPercent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/50">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Mini stats info */}
        <div className="grid gap-3 grid-cols-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3 text-center">
            <p className="text-[10px] font-bold text-slate-500">أفراد العيلة</p>
            <p className="mt-1 text-base font-black text-slate-800">{total}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100/50 p-3 text-center">
            <p className="text-[10px] font-bold text-emerald-800">قرأوا اليوم</p>
            <p className="mt-1 text-base font-black text-emerald-700">{readCount}</p>
          </div>
          <div className="rounded-2xl bg-amber-50/50 border border-amber-100/50 p-3 text-center">
            <p className="text-[10px] font-bold text-amber-800">متبقي</p>
            <p className="mt-1 text-base font-black text-amber-700">{total - readCount}</p>
          </div>
        </div>

        {/* Member status list */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400">قائمة الأعضاء (انقر لتغيير الحالة محاكاةً)</p>
          {members.map((member, index) => (
            <div 
              key={member.name} 
              onClick={() => toggleMemberStatus(index)}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 hover:border-emerald-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-800 border border-emerald-100">
                  {member.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{member.range}</p>
                </div>
              </div>
              {getStatusBadge(member.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Interactive Mobile Mockup for Member Experience ---
export function MemberExperienceMockup() {
  const [status, setStatus] = useState<"idle" | "read" | "excused">("idle");

  return (
    <div className="relative mx-auto w-full max-w-[280px] h-[520px] rounded-[40px] border-[8px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-right font-sans">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-2xl flex justify-center items-center z-20">
        <div className="w-16 h-3 bg-slate-950 rounded-full" />
      </div>

      {/* Screen Container */}
      <div className="h-full w-full bg-[#FAF9F5] p-5 pt-10 flex flex-col justify-between overflow-y-auto relative text-slate-800">
        {/* Top App Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">ختمة العيلة</span>
          <span className="text-xs font-medium text-slate-400">وردك اليومي</span>
        </div>

        {status === "idle" && (
          <div className="my-auto space-y-6 flex flex-col justify-center">
            {/* Greeting */}
            <div className="text-center space-y-1 animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center rounded-full font-black text-lg">أ</div>
              <h4 className="text-base font-black text-slate-800">مرحبًا أحمد 👋</h4>
              <p className="text-xs text-slate-500">تقبل الله طاعتكم وصالح أعمالكم</p>
            </div>

            {/* Ward Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center space-y-3 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700" />
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">وردك لليوم</span>
              <p className="text-2xl font-black text-emerald-900 font-sans">من صفحة 44 إلى 45</p>
              <p className="text-[11px] text-slate-400">سورة النساء • جزء 4</p>
            </div>

            {/* Interactive Actions */}
            <div className="space-y-2.5">
              <button 
                onClick={() => setStatus("read")}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                تمت القراءة بنجاح
              </button>
              <button 
                onClick={() => setStatus("excused")}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                <XCircle className="h-4 w-4" />
                مش قادر أقرأ اليوم
              </button>
            </div>
          </div>
        )}

        {status === "read" && (
          <div className="my-auto text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-emerald-900">تقبل الله منك!</h4>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                تم تسجيل قراءتك لليوم بنجاح، جزاك الله خيرًا وكتب لك الأجر كاملًا.
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400">تحديث اللوحة</span>
              <p className="text-xs font-bold text-emerald-800 mt-0.5">لقد ساهمت في تقدم ختمة عيلتك بنسبة 8% 🚀</p>
            </div>

            <button 
              onClick={() => setStatus("idle")}
              className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
            >
              تراجع أو تعديل
            </button>
          </div>
        )}

        {status === "excused" && (
          <div className="my-auto text-center space-y-5 py-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-amber-900">يسرّ الله لك!</h4>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                لا بأس أبدًا، تم تسجيل اعتذارك لليوم وسيظهر لمسؤول العيلة لترتيب الورد بدقة. 
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center">
              <p className="text-xs font-bold text-amber-800">
                "إنما الأعمال بالنيات"
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                سيعاد توزيع الصفحات تلقائيًا لضمان استمرارية الختمة.
              </p>
            </div>

            <button 
              onClick={() => setStatus("idle")}
              className="mt-2 text-xs font-bold text-amber-700 hover:underline"
            >
              تراجع أو تعديل
            </button>
          </div>
        )}

        {/* Brand Signoff */}
        <div className="border-t border-slate-100 pt-3 text-center">
          <p className="text-[9px] text-slate-400 font-medium">خطوة واحدة بسيطة • ختمة عيلة 🕊️</p>
        </div>
      </div>
    </div>
  );
}

// --- Interactive FAQ Accordion ---
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "هل يحتاج الأعضاء تسجيل دخول؟",
      a: "لا، كل عضو يدخل من رابط خاص ومباشر يُرسل له على واتساب بدون الحاجة لإنشاء حساب أو تذكر كلمة مرور."
    },
    {
      q: "هل تظهر حالة كل فرد لباقي العيلة؟",
      a: "مسؤول العيلة هو من يتابع الحالة والتفاصيل كاملة من لوحته الخاصة، ويمكن للمسؤول مشاركة ملخص يومي مبسط كبطاقة مشاركة إذا رغب في ذلك."
    },
    {
      q: "ماذا لو اعتذر أحد الأعضاء؟",
      a: "يسجل العضو اعتذاره بسهولة بضغطة زر، وسيظهر ذلك فورًا للمسؤول، ليقوم النظام بتعديل التوزيع تلقائيًا لتفادي توقف الختمة."
    },
    {
      q: "هل يعمل التطبيق على جميع الأجهزة؟",
      a: "نعم، ختمة عيلة تطبيق ويب متجاوب بالكامل يعمل على جميع الموبايلات والتابلت والكمبيوتر دون الحاجة لتحميل تطبيقات ثقيلة."
    },
    {
      q: "لماذا يوجد اشتراك رمزي؟",
      a: "الاشتراك رمزي ويُدفع مرة واحدة فقط، وذلك لتغطية تكاليف الاستضافة، السيرفرات، الصيانة الفنية، والتحسينات المستمرة للخدمة."
    },
    {
      q: "هل جزء من الاشتراك يخرج كصدقة؟",
      a: "نعم، نؤمن بالبركة والنية الطيبة في البرمجيات الإسلامية، لذلك يُستقطع جزء من كل اشتراك ليوجه كصدقة جارية بإذن الله لدعم وجوه الخير المختلفة."
    }
  ];

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">الإجابات المباشرة</span>
        <h2 className="text-3xl font-black text-slate-800">الأسئلة الشائعة</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">كل ما تود معرفته عن طريقة عمل ختمة عيلة والاشتراك الرمزي.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`rounded-2xl border transition-all duration-200 ${isOpen ? "border-emerald-200 bg-emerald-50/20 shadow-sm" : "border-slate-200 bg-white"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-right font-bold text-slate-800 hover:text-emerald-700 transition"
              >
                <span className="text-base font-sans">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-emerald-600" : ""}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 border-t border-slate-100" : "max-h-0"}`}
              >
                <div className="px-6 py-4 text-sm leading-relaxed text-slate-600 font-medium">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- Footer ---
export function Footer() {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900 py-16 text-right">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* Col 1: Brand & Desc */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800">
                <BookOpen className="h-5 w-5 text-amber-200" />
              </div>
              <span className="text-lg font-black text-amber-100">ختمة عيلة</span>
            </div>
            <p className="text-emerald-200/70 text-sm leading-relaxed max-w-sm font-medium">
              خدمة بسيطة ومحترمة تساعد العائلات على الاستمرار في ختمة القرآن الكريم بشكل منظم وبكل راحة، وبدون إحراج أو عشوائية في المتابعة اليومية.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">✓ خصوصية وأمان</span>
              <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">✓ بدون إعلانات</span>
              <span className="bg-emerald-900/60 text-amber-300 px-3 py-1 rounded-full border border-emerald-800">✓ جزء من الاشتراك صدقة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-amber-100 font-bold text-base">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li><a href="#" className="hover:text-amber-200 transition">الرئيسية</a></li>
              <li><a href="#features" className="hover:text-amber-200 transition">المزايا والمواصفات</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-200 transition">كيف يعمل التطبيق؟</a></li>
              <li><a href="#pricing" className="hover:text-amber-200 transition">الأسعار والباقات</a></li>
              <li><a href="#faq" className="hover:text-amber-200 transition">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Col 3: Safe Info */}
          <div className="space-y-4">
            <h4 className="text-amber-100 font-bold text-base">عن الخدمة</h4>
            <p className="text-emerald-200/60 text-xs leading-relaxed font-medium">
              الاشتراك رمزي لمرة واحدة لتغطية مصاريف الاستضافة والصيانة، مع تخصيص جزء من كل اشتراك كصدقة جارية بإذن الله لدعم القرآن وأهله.
            </p>
            <div className="pt-3 border-t border-emerald-900 text-[10px] text-emerald-200/40">
              جميع الحقوق محفوظة © {new Date().getFullYear()} ختمة عيلة.
            </div>
          </div>

        </div>

        <hr className="my-10 border-emerald-900" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-emerald-200/50 gap-4">
          <p>بُني بكل إخلاص لخدمة العائلات المحبة للقرآن الكريم.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#terms" className="hover:underline">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
