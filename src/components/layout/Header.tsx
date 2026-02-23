"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

// 메뉴 데이터 구조 확장 (서브메뉴 포함)
const navigation = [
  {
    name: "보호소 소개", href: "/about",
    subItems: [] // 서브메뉴 제거 (다일 페이지)
  },
  {
    name: "입양", href: "/adopt",
    subItems: [
      { name: "입양 공고", href: "/adopt", desc: "새로운 가족을 찾는 천사들" },
      { name: "입양 절차", href: "/process", desc: "입양 전 필수 확인 사항" },
      { name: "입양 상담 신청", href: "/process#apply", desc: "전문가와 함께하는 매칭 상담" },
      { name: "입양 후기", href: "/reviews", desc: "가족이 된 아이들의 따뜻한 이야기" }
    ]
  },
  {
    name: "지원 사업", href: "/impact",
    subItems: [] // 서브메뉴 제거 (다일 페이지)
  },
  {
    name: "후원 및 봉사", href: "/donate",
    subItems: [] // 서브메뉴 제거 (단일 페이지)
  },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 네비게이션 영역 전체에 마우스가 벗어날 때만 메뉴 닫기
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-700 flex items-center ${scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm shadow-black/5 h-20"
          : isHome
            ? "bg-transparent h-24"
            : "bg-white/95 backdrop-blur-lg shadow-sm h-24"
        }`}
    >
      <div className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex-shrink-0 w-1/4 flex items-center">
            <Link href="/" className="flex items-center">
              <span
                className={`text-[24px] font-extrabold tracking-tight transition-colors hover:opacity-80 ${isTransparent ? "text-white drop-shadow-md" : "text-gray-900"}`}
              >
                리호밍센터
              </span>
            </Link>
          </div>

          {/* 데스크탑 내비게이션 (메가 메뉴 컨테이너) */}
          <div
            className="hidden md:flex flex-1 justify-center h-full"
            onMouseLeave={handleMouseLeave}
          >
            <nav className="flex space-x-7 lg:space-x-10 h-full items-center">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                const isHovered = activeMenu === index;

                return (
                  <div
                    key={item.href}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setActiveMenu(index)}
                  >
                    <Link
                      href={item.href}
                      className={`relative py-8 text-[16px] xl:text-[17px] tracking-wide transition-colors whitespace-nowrap ${isTransparent
                        ? isActive || isHovered ? "text-white font-extrabold drop-shadow-md" : "text-white/90 font-medium hover:text-white drop-shadow"
                        : isActive || isHovered ? "text-blue-700 font-extrabold" : "text-gray-700 font-medium hover:text-blue-700"
                        }`}
                    >
                      {item.name}
                      {/* 활성화 표시 언더라인 애니메이션 - 굵고 강렬한 그라디언트 톤 */}
                      {(isActive || isHovered) && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-[20px] left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>

                    {/* 드롭다운 서브메뉴 패널 (Hover 애니메이션) */}
                    <AnimatePresence>
                      {isHovered && item.subItems.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="absolute top-[85px] left-1/2 -translate-x-1/2 w-[340px] bg-white/95 backdrop-blur-3xl border border-gray-100/50 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden py-3 z-50 pointer-events-auto"
                        >
                          <div className="flex flex-col">
                            {item.subItems.map((subItem, idx) => (
                              <Link
                                key={idx}
                                href={subItem.href}
                                className="group px-6 py-4 flex flex-col gap-1 hover:bg-blue-50/60 transition-colors border-l-4 border-transparent hover:border-blue-600"
                                onClick={() => setActiveMenu(null)} // 클릭 시 닫힘
                              >
                                <span className="text-gray-900 font-bold text-[17px] group-hover:text-blue-700 transition-colors">
                                  {subItem.name}
                                </span>
                                <span className="text-gray-500 text-sm font-medium">
                                  {subItem.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* 서브메뉴가 열렸을 때 뒷배경을 살짝 어둡게 해주는 오버레이 (옵션) */}
          <AnimatePresence>
            {activeMenu !== null && navigation[activeMenu]?.subItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-[85px] h-screen w-screen bg-black/5 backdrop-blur-[2px] -z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* 오른쪽 버튼 */}
          <div className="flex-shrink-0 w-1/4 flex justify-end items-center gap-4">
            <Link
              href="/adopt"
              className={`hidden md:inline-flex items-center justify-center px-7 py-2.5 text-[15px] font-bold rounded-full transition-all whitespace-nowrap ${isTransparent
                ? "text-white border-2 border-white/60 hover:bg-white/20 hover:border-white backdrop-blur-sm"
                : "text-white bg-gradient-to-r from-brand-trust to-blue-600 hover:from-blue-700 hover:to-indigo-600 shadow-lg hover:shadow-brand-trust/30 hover:-translate-y-0.5"
                }`}
            >
              입양하기
            </Link>

            <button
              type="button"
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-full ${isTransparent ? "text-white" : "text-gray-900 hover:bg-gray-100"
                }`}
            >
              <span className="sr-only">메뉴 열기</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
