import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChannelTalk from "@/components/common/ChannelTalk";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "리호밍센터 (Rehoming Center) - 프리미엄 입양 공간",
  description: "유기동물을 위한 가장 안심하고 신뢰할 수 있는 입양 연계 플랫폼, 리호밍센터입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body
        className="font-sans antialiased flex flex-col min-h-screen bg-[#FAF9F6]"
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ChannelTalk />
      </body>
    </html>
  );
}
