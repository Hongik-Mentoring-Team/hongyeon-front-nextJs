import type { Metadata } from "next";
import { Noto_Sans_KR, Inter } from "next/font/google";
import "./global.css";
import DefaultLayout from "./(Components)/layouts/DefaultLayout";

// ✅ 기존 폰트 우선 + Inter 추가
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
});
const inter = Inter({ subsets: ["latin"] });

// ✅ 새 코드의 실제 서비스용 metadata 반영
export const metadata: Metadata = {
  title: "홍이음 - 홍익 오픈소스 멘토링 서비스",
  description:
    "홍익대학교 오픈소스 멘토링 서비스, 홍이음에서 당신의 지식을 나누고 함께 성장하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.className} ${inter.className} font-medium antialiased`}
      >
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
