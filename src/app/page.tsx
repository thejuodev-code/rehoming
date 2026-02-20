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
      <section className="relative py-32 bg-slate-50 overflow-hidden border-b border-gray-100">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-trust/5 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-brand-warmth/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-brand-trust shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-trust animate-pulse" />
                OUR MISSION
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-extrabold text-center text-gray-900 mb-16 leading-tight tracking-tight relative z-10"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute -top-16 -left-12 text-[12rem] text-brand-trust font-serif leading-none select-none"
              >
                "
              </motion.span>
              상처받은 어제를 지나,<br className="hidden md:block" />
              사랑받을 <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-warmth to-orange-500">내일</span>
                <motion.svg
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                  className="absolute w-[120%] h-4 -bottom-1 -left-2 text-brand-warmth/40 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                </motion.svg>
              </span>을 <span className="text-brand-trust">이어줍니다.</span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 0.3, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute -bottom-16 -right-12 text-[12rem] text-brand-trust font-serif leading-none select-none rotate-180"
              >
                "
              </motion.span>
            </motion.h2>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 relative z-10">
              {[
                {
                  title: "상처 치유",
                  desc: "버림받은 상처를 세심하게 어루만지고 몸과 마음의 건강을 회복합니다.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  ),
                  bgClass: "bg-gradient-to-br from-brand-trust to-blue-600",
                  delay: 0.2
                },
                {
                  title: "행동 교정",
                  desc: "전문 훈련사를 통해 사람과 함께 살아가는 행복한 방법을 배웁니다.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  ),
                  bgClass: "bg-gradient-to-br from-brand-warmth to-orange-500",
                  delay: 0.4
                },
                {
                  title: "완벽한 매칭",
                  desc: "입양자와 아이의 성향을 분석하여 평생을 함께할 수 있는 가족을 찾아줍니다.",
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  ),
                  bgClass: "bg-gradient-to-br from-gray-700 to-gray-900",
                  delay: 0.6
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: item.delay, ease: "easeOut" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-brand-trust/5 hover:shadow-2xl hover:shadow-brand-trust/20 transition-all duration-500 border border-gray-100 group relative overflow-hidden flex flex-col items-center text-center z-10"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform group-hover:scale-150 rotate-12">
                    {/* Darker shadow icon on hover */}
                    <svg className="w-48 h-48 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  </div>

                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500 ${item.bgClass}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand-trust transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed break-keep">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 text-center text-lg text-gray-500 font-light max-w-2xl mx-auto break-keep"
            >
              단순한 안식처를 넘어, 동물과 사람 모두가 행복해질 수 있는 진정한 '집'을 찾아주는 것. 그것이 리호밍센터의 유일한 사명이자 존재 이유입니다.
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
