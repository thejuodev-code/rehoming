"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { name: "보호소 소개", href: "/about" },
  { name: "입양 절차", href: "/process" },
  { name: "입양 공고", href: "/adopt" },
  { name: "입양 후기", href: "/reviews" },
  { name: "지원 사업", href: "/impact" },
  { name: "후원 안내", href: "/donate" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-200 h-20 flex items-center ${scrolled
        ? "bg-white/95 backdrop-blur-lg shadow-sm shadow-black/5"
        : "bg-white"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Text Logo (Left Aligned) */}
          <div className="flex-shrink-0 w-1/4 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-[22px] font-extrabold tracking-tight text-gray-900 hover:text-brand-trust transition-colors">
                리호밍센터
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Centered) */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex space-x-10">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 text-[16px] ${isActive
                      ? "text-brand-trust font-bold"
                      : "text-gray-600 font-medium hover:text-brand-trust"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Button & Mobile Menu Toggle (Right Aligned) */}
          <div className="flex-shrink-0 w-1/4 flex justify-end items-center gap-4">
            <Link
              href="/adopt"
              className="hidden md:inline-flex items-center justify-center px-7 py-2.5 text-[15px] font-bold rounded-full text-white bg-brand-trust hover:bg-blue-800 shadow-sm"
            >
              입양하기
            </Link>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-900 hover:bg-gray-100 rounded-full"
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
