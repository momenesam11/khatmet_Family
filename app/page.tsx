import Link from "next/link";
import { Button, Card, MiniInfo, Progress } from "@/components/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-slate-900">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800">
            ✦ بدون اشتراك شهري — دفع مرة واحدة
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight lg:text-6xl">نظّم ختمة عيلتك من غير عشوائية</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              ختمة عيلة تساعدك توزع القراءة بين أفراد العيلة، تتابع الإنجاز، وتحافظوا على الاستمرارية بسهولة.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup"><Button>ابدأ الآن</Button></Link>
            <Link href="/login"><Button variant="secondary">تسجيل الدخول</Button></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["مين قرأ؟ ومين لسه؟", "الختمة بتبدأ وبعدين بتقف", "المتابعة على واتساب عشوائية"].map((item) => (
              <Card key={item} className="p-4"><p className="font-bold text-slate-800">{item}</p></Card>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden p-5">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-100" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">لوحة مسؤول العيلة</p>
                <h2 className="text-2xl font-black">ورد العيلة اليومي</h2>
              </div>
              <div className="rounded-2xl bg-emerald-700 p-3 text-white">▣</div>
            </div>
            <Progress value={67} />
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniInfo label="إنجاز اليوم" value="67%" />
              <MiniInfo label="تمت القراءة" value="2" />
              <MiniInfo label="لسه" value="1" />
            </div>
            {["أحمد", "مريم", "عمر"].map((name, index) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-800">{name[0]}</div>
                  <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-xs text-slate-500">من صفحة {42 + index * 2} إلى صفحة {43 + index * 2}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${index === 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {index === 1 ? "تمت القراءة" : "لم يقرأ بعد"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Card className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-bold text-emerald-700">باقة واحدة بسيطة</p>
            <h3 className="mt-2 text-3xl font-black">حساب عيلة</h3>
            <p className="mt-2 text-slate-600">شراء مرة واحدة، بدون اشتراك شهري.</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {["إضافة أفراد العيلة", "إنشاء ختمات وأوراد متعددة", "رابط خاص لكل فرد", "متابعة التقدم", "رسائل واتساب جاهزة", "لوحة تحكم للمسؤول"].map((feature) => (
                <li key={feature} className="flex items-center gap-2"><span className="text-emerald-700">✓</span>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-6 text-center">
            <p className="text-4xl font-black text-emerald-900">299 جنيه</p>
            <p className="mt-1 text-sm font-bold text-emerald-700">دفع مرة واحدة</p>
            <Link href="/signup"><Button className="mt-5 w-full">اشتري حساب العيلة</Button></Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
