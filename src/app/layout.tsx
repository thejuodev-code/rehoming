import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";
import Script from "next/script";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "\uB9AC\uD638\uBC0D\uC13C\uD130 (Rehoming Center) - \uD504\uB9AC\uBBF8\uC5C5 \uC785\uC591 \uACF5\uAC04",
  description: "\uC720\uAE30\uB3D9\uBB3C\uC744 \uC704\uD55C \uAC00\uC7A5 \uC548\uC2EC\uD558\uACE0 \uC2E0\uB8B0\uD560 \uC218 \uC788\uB294 \uC785\uC591 \uC5F0\uACC4 \uD50C\uB7AB\uD3FC, \uB9AC\uD638\uBC0D\uC13C\uD130\uC785\uB2C8\uB2E4.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID || '';

  return (
    <html lang="ko" className={notoSansKr.variable}>
      <head>
        {kakaoAppKey && (
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoAppKey}&autoload=false`}
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-[#FAF9F6]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
