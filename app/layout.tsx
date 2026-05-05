import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ختمة عيلة",
  description: "نظّم ختمات وأوراد عيلتك من غير عشوائية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
