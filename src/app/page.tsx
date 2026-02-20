"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Abstract Background Gradient Graphic */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]"
          >
            새로운 가족을 만나는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-600">
              가장 완벽한 여정
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl font-light leading-relaxed"
          >
            리호밍센터는 아름답고 신뢰할 수 있는 입양 문화를 만듭니다. 당신의 평생 반려가족을 지금 찾아보세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/adopt"
              className="group relative inline-flex items-center justify-center bg-brand-trust text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:shadow-brand-trust/20 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                입양 프로필 보기
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center justify-center bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              입양 절차 안내
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Identity Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight"
            >
              우리는 동물을 <span className="text-brand-trust">보호</span>하지 않습니다.<br />
              새로운 <span className="text-brand-warmth">가족</span>을 찾아줍니다.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-1 bg-brand-trust mx-auto mb-10 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed font-light break-keep"
            >
              리호밍센터는 단순한 안식처를 넘어, 동물과 사람 모두가 행복해질 수 있는 완벽한 매칭을 추구합니다. 버림받은 상처를 치유하고, 전문적인 행동 교정과 세심한 건강 관리를 통해 아이들이 평생 배려받고 사랑받을 수 있는 진정한 '집'을 찾아주는 것. 그것이 리호밍센터의 유일한 사명이자 존재 이유입니다.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Adoption Profiles Preview */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">가족을 기다리는 아이들</h2>
              <p className="text-xl text-gray-600 font-light">당신의 작은 관심이 이 아이들에겐 기적이 됩니다.</p>
            </div>
            <Link
              href="/adopt"
              className="hidden md:inline-flex items-center text-brand-trust font-semibold hover:text-blue-800 transition-colors group"
            >
              전체 아이들 보기
              <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image Aspect Ratio Container */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-700 ease-out">
                    <span className="text-sm tracking-widest uppercase">Photo {item}</span>
                  </div>
                  {/* Overlay Gradient for readability if text was on top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    구조 {item}개월 차
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">멍멍이 {item}</h3>
                    <span className="flex items-center text-sm font-medium text-brand-trust bg-blue-50 px-2.5 py-1 rounded-md">
                      #입양가능
                    </span>
                  </div>

                  <ul className="flex flex-wrap gap-2 mb-6">
                    <li className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">믹스견</li>
                    <li className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">2살 추정</li>
                    <li className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">수컷</li>
                  </ul>

                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                    사람을 무척 좋아하고 산책 매너가 훌륭한 아이입니다. 따뜻하게 품어주실 평생 가족을 기다리고 있습니다.
                  </p>

                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Link
                      href={`/adopt/${item}`}
                      className="flex items-center justify-between text-gray-900 font-semibold group-hover:text-brand-trust transition-colors"
                    >
                      상세 프로필 확인
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-trust group-hover:text-white transition-colors">
                        &rarr;
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              href="/adopt"
              className="inline-block w-full border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              더 많은 아이들 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features Section */}
      <section className="py-24 bg-brand-trust text-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">투명하고 안전한<br />프리미엄 입양 서비스</h2>
              <p className="text-blue-100 text-xl leading-relaxed mb-8 font-light max-w-lg">
                리호밍센터는 기존 유기동물 보호소의 한계를 넘어, 전문적인 케어 시스템과 데이터 기반의 매칭을 제공합니다.
              </p>

              <ul className="space-y-6">
                {[
                  { title: "전담 수의사 건강검진 완료", desc: "입양 전 모든 아이들의 종합 건강검진을 진행합니다." },
                  { title: "전문 훈련사 행동교정", desc: "가정 환경에 빠르게 적응할 수 있도록 기초 교육을 마칩니다." },
                  { title: "1:1 맞춤형 매칭 시스템", desc: "입양자의 라이프스타일과 동물의 성향을 고려해 연결합니다." }
                ].map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-brand-warmth" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{feature.title}</h4>
                      <p className="text-blue-100 text-sm font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {/* Visual Decorative Element for Features */}
              <motion.div
                initial={{ opacity: 0, rotate: 5, y: 50 }}
                whileInView={{ opacity: 1, rotate: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="aspect-square bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center relative shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="text-center">
                  <div className="text-8xl font-bold text-white mb-2">98<span className="text-4xl text-brand-warmth">%</span></div>
                  <p className="text-blue-100 text-xl font-medium">성공적인 입양 유지율</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
