import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "ختمة عيلة — تنظيم أوراد القرآن الكريم للعائلات",
  description: "خدمة دينية بسيطة ومحترمة تساعد العائلات على تقسيم ومتابعة ختمات القرآن الكريم بسهولة وبشكل منظم.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased text-slate-800 bg-[#FAF9F5]">
        {children}
      </body>
    </html>
  );
}

