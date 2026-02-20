import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChannelTalk from "@/components/common/ChannelTalk";

export const metadata: Metadata = {
  title: "리호밍센터 - 완벽한 가족을 만나는 곳",
  description: "대한민국에서 가장 신뢰할 수 있고 따뜻한 반려동물 입양 연계 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className="font-sans antialiased flex flex-col min-h-screen"
      >
        <Header />
        <main className="pt-20 flex-grow">
          {children}
        </main>
        <Footer />
        <ChannelTalk />
      </body>
    </html>
  );
}
