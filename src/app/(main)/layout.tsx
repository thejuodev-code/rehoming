import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChannelTalk from "@/components/common/ChannelTalk";

/**
 * 메인 사이트 레이아웃
 * Header, Footer, ChannelTalk를 포함합니다.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChannelTalk />
    </>
  );
}
