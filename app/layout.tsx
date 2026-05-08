import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상우리 — 시니어 일자리 매칭",
  description: "시니어와 일자리를 연결하는 자동 매칭 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex gap-6 items-center overflow-x-auto">
            <a href="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors shrink-0">상상우리</a>
            <a href="/register" className="text-base font-medium text-slate-400 hover:text-white transition-colors shrink-0">프로필 등록</a>
            <a href="/seniors" className="text-base font-medium text-slate-400 hover:text-white transition-colors shrink-0">시니어 목록</a>
            <a href="/recommendations" className="text-base font-medium text-slate-400 hover:text-white transition-colors shrink-0">추천 일자리</a>
            <a href="/admin" className="text-base font-medium text-slate-400 hover:text-white transition-colors shrink-0">담당자 대시보드</a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
