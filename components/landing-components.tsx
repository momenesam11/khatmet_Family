"use client";

import React, { useState, useEffect, useRef } from "react";
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
        <div className="flex h-16 items-center justify-between sm:h-20">
          <a href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <img src="/logo.png" alt="ختمة عيلة" className="h-10 w-10 shrink-0 sm:h-12 sm:w-12 object-contain" />
            <div className="min-w-0 hidden sm:block">
              <span className="text-lg font-black tracking-tight text-emerald-900 font-sans">ختمة عيلة</span>
            </div>
          </a>

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

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="rounded-2xl px-5 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50 border border-emerald-100 transition-all duration-200"
            >
             تسجيل الدخول
            </a>
            <a 
              href="signup" 
              className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 hover:shadow-md transition-all duration-200"
            >
              ابدأ ختمة العيلة
            </a>
          </div>

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

      {isOpen && (
        <>
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setIsOpen(false)} aria-hidden="true" />
        <div className="relative z-50 md:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-xl">
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
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-emerald-100 px-4 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition"
              >
تسجيل الدخول              </a>
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
        </>
      )}
    </nav>
  );
}

export function WhatsAppMessageCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#E8F8F2] border border-[#d2efe2] p-4 shadow-sm relative text-right max-w-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-950/5">
        <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
          <MessageCircle className="h-3.5 w-3.5 fill-white" />
        </div>
        <span className="text-[11px] font-bold text-emerald-800">تذكير ختمة العيلة</span>
        <span className="mr-auto text-[9px] text-slate-400">8:30 ص</span>
      </div>
      
      <p className="text-[13px] leading-relaxed text-slate-700 font-medium">
        السلام عليكم، تذكير هادئ بورد اليوم من صفحة <span className="font-bold text-emerald-900 bg-white/70 px-1 rounded">43</span> إلى <span className="font-bold text-emerald-900 bg-white/70 px-1 rounded">45</span>، جزاك الله خيرًا.
      </p>
      
      <div className="absolute right-4 -bottom-2 w-3 h-3 bg-[#E8F8F2] border-r border-b border-[#d2efe2] transform rotate-45"></div>
    </div>
  );
}

export function DashboardMockup({ className = "" }: { className?: string }) {
  const [members, setMembers] = useState([
    { name: "أحمد", status: "read", range: "من صفحة 42 إلى 43" },
    { name: "مريم", status: "read", range: "من صفحة 44 إلى 45" },
    { name: "عمر", status: "unread", range: "من صفحة 46 إلى 47" },
    { name: "سارة", status: "excused", range: "من صفحة 48 إلى 49" },
  ]);

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

  const total = members.length;
  const readCount = members.filter(m => m.status === "read").length;
  const progressPercent = Math.round((readCount / total) * 100);

  return (
    <div className={`glass-card-emerald rounded-3xl p-6 shadow-xl relative overflow-hidden text-right border border-emerald-500/10 ${className}`}>
      {/* Decorative top green glow */}
      <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
      
      <div className="relative space-y-6">
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
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-3 hover:border-emerald-200 hover:shadow-sm transition-all duration-200 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-800 border border-emerald-100">
                  {member.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="truncate text-[11px] text-slate-400 font-medium">{member.range}</p>
                </div>
              </div>
              <div className="self-start sm:self-auto">{getStatusBadge(member.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          <p className="text-[9px] text-slate-400 font-medium">خطوة واحدة بسيطة • ختمة عيلة</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "هل التطبيق مجاني؟",
      a: "نعم، ختمة عيلة مجانية بالكامل لجميع العائلات. لا يوجد اشتراك شهري أو سنوي أو أي رسوم مخفية."
    },
    {
      q: "إيه الغرض من التبرع؟",
      a: "التبرع اختياري تماماً، والهدف منه تغطية مصاريف تشغيل الخوادم والتطوير المستمر. وجزء من كل تبرع يخرج كصدقة جارية بإذن الله."
    },
    {
      q: "هل بياناتي آمنة؟",
      a: "نعم، كل عيلة عندها مساحة خاصة ومحمية. لا نشارك بياناتك مع أي طرف ثالث، ولا تظهر بياناتك لعائلات أخرى."
    },
    {
      q: "ممكن أستخدمه بره مصر؟",
      a: "آه، التطبيق شغّال من أي مكان في العالم على أي جهاز. كل ما تحتاجه متصفح ويب وإنترنت."
    },
    {
      q: "إزاي أبدأ؟",
      a: "سجّل حساب مجاني، ضيف أسماء أفراد العيلة، وابدأ ختمتك — العملية كلها بتاخد أقل من 3 دقائق."
    }
  ];

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">الإجابات المباشرة</span>
        <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">الأسئلة الشائعة</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">كل ما تود معرفته عن طريقة عمل ختمة عيلة.</p>
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
                className="w-full px-4 py-4 sm:px-6 flex items-center justify-between gap-3 text-right font-bold text-slate-800 hover:text-emerald-700 transition"
              >
                <span className="text-sm font-sans sm:text-base">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-emerald-600" : ""}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"}`}
              >
                <div className="px-4 py-4 sm:px-6 text-sm leading-relaxed text-slate-600 font-medium">
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
              <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">خصوصية وأمان</span>
              <span className="bg-emerald-900/60 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800">بدون إعلانات</span>
              <span className="bg-emerald-900/60 text-amber-300 px-3 py-1 rounded-full border border-emerald-800">جزء من التبرعات صدقة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-amber-100 font-bold text-base">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/80">
              <li><a href="#" className="hover:text-amber-200 transition">الرئيسية</a></li>
              <li><a href="#features" className="hover:text-amber-200 transition">المزايا والمواصفات</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-200 transition">كيف يعمل التطبيق؟</a></li>
              <li><a href="/payment-pending" className="hover:text-amber-200 transition">ادعم المشروع</a></li>
              <li><a href="#faq" className="hover:text-amber-200 transition">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Col 3: Safe Info */}
          <div className="space-y-4">
            <h4 className="text-amber-100 font-bold text-base">عن الخدمة</h4>
            <p className="text-emerald-200/60 text-xs leading-relaxed font-medium">
              ختمة عيلة مجانية بالكامل. بتشتغل بتبرعات طوعية من أهلها، وجزء من كل تبرع يخرج صدقة جارية بإذن الله.
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

export function ScrollReveal({
  children,
  className = "",
  animation = "reveal",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "reveal" | "reveal-left" | "reveal-right" | "reveal-scale";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${animation} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function IslamicLantern({ size = 110, opacity = 0.18 }: { size?: number; opacity?: number }) {
  const c = "#8B6914";
  const s = size; const h = s * 1.85;
  return (
    <svg width={s} height={h} viewBox="0 0 110 204" fill="none" style={{ opacity }}>
      <line x1="55" y1="0" x2="55" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M40 20 Q55 15 70 20 L73 29 Q55 23 37 29 Z" fill="none" stroke={c} strokeWidth="1.2"/>
      <ellipse cx="55" cy="29" rx="18" ry="4.5" fill="none" stroke={c} strokeWidth="1.2"/>
      <path d="M37 29 Q30 48 28 65 L82 65 Q80 48 73 29 Z" fill="none" stroke={c} strokeWidth="1.2"/>
      <ellipse cx="55" cy="65" rx="27" ry="6" fill="none" stroke={c} strokeWidth="1.2"/>
      <path d="M28 65 Q20 93 23 120 L87 120 Q90 93 82 65 Z" fill="none" stroke={c} strokeWidth="1.2"/>
      <path d="M35 74 Q37 66 42 72 Q47 78 41 84 Z" fill="none" stroke={c} strokeWidth="0.9"/>
      <path d="M52 70 Q55 62 58 70 Q61 78 55 82 Z" fill="none" stroke={c} strokeWidth="0.9"/>
      <path d="M68 74 Q73 66 75 72 Q77 78 71 84 Z" fill="none" stroke={c} strokeWidth="0.9"/>
      <ellipse cx="55" cy="120" rx="32" ry="6.5" fill="none" stroke={c} strokeWidth="1.2"/>
      <path d="M23 120 Q25 138 31 149 L79 149 Q85 138 87 120 Z" fill="none" stroke={c} strokeWidth="1.2"/>
      <path d="M31 149 Q55 155 79 149 L74 159 Q55 165 36 159 Z" fill="none" stroke={c} strokeWidth="1.2"/>
      <ellipse cx="55" cy="159" rx="19" ry="4.5" fill="none" stroke={c} strokeWidth="1.2"/>
      <line x1="44" y1="163" x2="41" y2="181" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <line x1="55" y1="163" x2="55" y2="185" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <line x1="66" y1="163" x2="69" y2="181" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="41" cy="183" r="2" fill={c} opacity="0.6"/>
      <circle cx="55" cy="187" r="2" fill={c} opacity="0.6"/>
      <circle cx="69" cy="183" r="2" fill={c} opacity="0.6"/>
      <ellipse cx="55" cy="96" rx="18" ry="20" fill={c} opacity="0.04"/>
    </svg>
  );
}

function CrescentMoon({ size = 60, opacity = 0.15 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity }}>
      <path d="M38 8 A24 24 0 1 1 22 52 A18 18 0 1 0 38 8 Z" fill="none" stroke="#047857" strokeWidth="1.5"/>
      <circle cx="46" cy="12" r="2.5" fill="#047857" opacity="0.6"/>
      <circle cx="50" cy="22" r="1.5" fill="#047857" opacity="0.45"/>
    </svg>
  );
}

function TinyStar({ size = 12, opacity = 0.2 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ opacity }}>
      <polygon points="7,0 8.3,4.7 13,7 8.3,9.3 7,14 5.7,9.3 1,7 5.7,4.7" fill="#047857"/>
    </svg>
  );
}

export function IslamicBackground() {
  return (
    <div className="pointer-events-none select-none fixed inset-0 overflow-hidden" style={{ zIndex: -10 }} aria-hidden>

      {/* Soft radial glow */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 65% 45% at 12% 18%, rgba(4,120,87,0.04) 0%, transparent 55%),
          radial-gradient(ellipse 55% 45% at 88% 72%, rgba(4,120,87,0.035) 0%, transparent 55%)
        `
      }}/>

      {/* Mosque silhouette — bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl opacity-[0.05]">
        <svg viewBox="0 0 900 380" fill="none" className="w-full">
          <path d="M450 380 L450 210 Q450 95 380 58 Q310 95 310 210 L310 380 Z" fill="#047857"/>
          <ellipse cx="380" cy="58" rx="22" ry="30" fill="#047857"/>
          <line x1="380" y1="28" x2="380" y2="8" stroke="#047857" strokeWidth="4" strokeLinecap="round"/>
          <rect x="165" y="155" width="28" height="225" rx="4" fill="#047857"/>
          <path d="M165 155 Q179 108 193 155 Z" fill="#047857"/>
          <rect x="707" y="155" width="28" height="225" rx="4" fill="#047857"/>
          <path d="M707 155 Q721 108 735 155 Z" fill="#047857"/>
          <path d="M310 380 L310 278 Q310 235 278 218 Q246 235 246 278 L246 380 Z" fill="#047857" opacity="0.65"/>
          <path d="M450 380 L450 278 Q450 235 482 218 Q514 235 514 278 L514 380 Z" fill="#047857" opacity="0.65"/>
          <rect x="65" y="362" width="770" height="18" rx="2" fill="#047857" opacity="0.4"/>
          {[90,145,200,255,310,365,420,475,530,585,640,695,750].map((x, i) => (
            <path key={i} d={`M${x} 362 L${x} 348 Q${x+27} 334 ${x+54} 348 L${x+54} 362 Z`} fill="#047857" opacity="0.22"/>
          ))}
        </svg>
      </div>

      {/* Left lantern — big */}
      <div className="absolute top-0 left-[2%] hidden lg:block"
        style={{ animation: "sway 5.5s ease-in-out infinite" }}>
        <IslamicLantern size={105} opacity={0.16}/>
      </div>
      {/* Left lantern — small */}
      <div className="absolute top-0 left-[9%] hidden lg:block"
        style={{ animation: "sway 7s ease-in-out infinite", animationDelay: "1.4s" }}>
        <IslamicLantern size={68} opacity={0.1}/>
      </div>
      {/* Right lantern — big */}
      <div className="absolute top-0 right-[2%] hidden lg:block"
        style={{ animation: "sway 6s ease-in-out infinite", animationDelay: "0.7s" }}>
        <IslamicLantern size={105} opacity={0.16}/>
      </div>
      {/* Right lantern — small */}
      <div className="absolute top-0 right-[9%] hidden lg:block"
        style={{ animation: "sway 8s ease-in-out infinite", animationDelay: "2s" }}>
        <IslamicLantern size={68} opacity={0.1}/>
      </div>

      {/* Crescent moon */}
      <div className="absolute top-[7%] right-[19%] hidden lg:block"
        style={{ animation: "float-slow 9s ease-in-out infinite" }}>
        <CrescentMoon size={68} opacity={0.14}/>
      </div>

      {/* Scattered tiny stars */}
      {[
        { t:"10%", l:"26%", s:10, d:"0s",   dur:"5s"  },
        { t:"16%", l:"71%", s:8,  d:"1s",   dur:"7s"  },
        { t:"7%",  l:"54%", s:12, d:"2s",   dur:"6s"  },
        { t:"33%", l:"4%",  s:8,  d:"0.5s", dur:"8s"  },
        { t:"58%", l:"91%", s:10, d:"1.5s", dur:"6s"  },
        { t:"72%", l:"14%", s:8,  d:"3s",   dur:"9s"  },
        { t:"28%", l:"87%", s:10, d:"1s",   dur:"5.5s"},
        { t:"82%", l:"58%", s:7,  d:"0s",   dur:"8s"  },
      ].map((st, i) => (
        <div key={i} className="absolute"
          style={{ top: st.t, left: st.l, animation: `twinkle ${st.dur} ease-in-out infinite`, animationDelay: st.d }}>
          <TinyStar size={st.s} opacity={0.18}/>
        </div>
      ))}

    </div>
  );
}
