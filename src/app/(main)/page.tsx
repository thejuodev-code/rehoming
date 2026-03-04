"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from '@apollo/client/react';
import { GET_ANIMALS } from '@/lib/queries';
import { GetAnimalsData, AnimalPost } from '@/types/graphql';

import ImagePlaceholder from "@/components/common/ImagePlaceholder";

// 상위/하위 컴포넌트에 모두 쓰이는 초프리미엄 지연 등장 애니메이션 
const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier (Apple-like smooth out)
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 기존 0.15보다 간격을 넓혀 아이템별로 하나씩 부드럽게 등장하도록 수정
      delayChildren: 0.1
    }
  }
};

export default function Home() {
  const { data, loading } = useQuery<GetAnimalsData>(GET_ANIMALS, {
    variables: { first: 3 }
  });

  // Hero 텍스트 및 배경 Parallax 스크롤 감지
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // heroOpacity: 스크롤 중반까지 유지되도록 범위 조정 (0.6 이후부터 사라짐)
  const heroOpacity = useTransform(heroProgress, [0, 0.85, 1], [1, 0, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);

  // Brand Section Parallax 요소 - Y축 이동만 유지, 투명도 제거하여 항상 선명하게
  const brandRef = useRef(null);
  const { scrollYProgress: brandProgress } = useScroll({
    target: brandRef,
    offset: ["start end", "end start"]
  });
  const brandY = useTransform(brandProgress, [0, 1], [150, -150]);

  // Section 2 콘텐츠 실제 진입시점 기준 progress (화면 85% 지점 진입 → 15% 지점 이탈)
  const { scrollYProgress: brandViewProgress } = useScroll({
    target: brandRef,
    offset: ["start 0.9", "end 0.1"]
  });

  // Section 2 스크롤-스크럽: 실제 보이는 시점 기준 (움직임↑, 블러 추가)
  const s2BadgeOpacity = useTransform(brandViewProgress, [0, 0.15, 0.88, 0.98], [0, 1, 1, 0]);
  const s2BadgeX = useTransform(brandViewProgress, [0, 0.15], [-70, 0]);
  const s2BadgeFilter = useTransform(brandViewProgress, [0, 0.15], ["blur(12px)", "blur(0px)"]);

  const s2HeadingOpacity = useTransform(brandViewProgress, [0.07, 0.22, 0.88, 0.98], [0, 1, 1, 0]);
  const s2HeadingY = useTransform(brandViewProgress, [0.07, 0.22], [120, 0]);
  const s2HeadingFilter = useTransform(brandViewProgress, [0.07, 0.22], ["blur(20px)", "blur(0px)"]);

  const s2SubOpacity = useTransform(brandViewProgress, [0.14, 0.28, 0.88, 0.98], [0, 1, 1, 0]);
  const s2SubFilter = useTransform(brandViewProgress, [0.14, 0.28], ["blur(8px)", "blur(0px)"]);

  const s2Item0Opacity = useTransform(brandViewProgress, [0.22, 0.38, 0.90, 0.99], [0, 1, 1, 0]);
  const s2Item0X = useTransform(brandViewProgress, [0.22, 0.38], [-120, 0]);
  const s2Item0Filter = useTransform(brandViewProgress, [0.22, 0.38], ["blur(14px)", "blur(0px)"]);

  const s2Item1Opacity = useTransform(brandViewProgress, [0.32, 0.48, 0.90, 0.99], [0, 1, 1, 0]);
  const s2Item1Y = useTransform(brandViewProgress, [0.32, 0.48], [120, 0]);
  const s2Item1Filter = useTransform(brandViewProgress, [0.32, 0.48], ["blur(14px)", "blur(0px)"]);

  const s2Item2Opacity = useTransform(brandViewProgress, [0.42, 0.58, 0.90, 0.99], [0, 1, 1, 0]);
  const s2Item2X = useTransform(brandViewProgress, [0.42, 0.58], [120, 0]);
  const s2Item2Filter = useTransform(brandViewProgress, [0.42, 0.58], ["blur(14px)", "blur(0px)"]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">

      {/* 1. Hero Section - Sticky Parallax (화면에 고정되며 서서히 사라짐) */}
      <section ref={heroRef} className="relative h-[120vh] bg-black z-0">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* 동영상 배경 */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/videos/hero_bg.mp4" type="video/mp4" />
            </video>
            {/* 텍스트 영역을 지우는 오른쪽 & 하단 그라디언트 */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          </div>

          {/* 고급스러운 배경 메쉬 그라디언트 & 패턴 (동영상 뒤/옆에 살짝 보일 수 있도록 유지) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/60 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100/50 rounded-full blur-[100px]"
            />

            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear", repeatType: "reverse" }}
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(circle at center, #93c5fd 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 h-screen flex items-end justify-end pb-20 md:pb-28">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-end text-right max-w-2xl xl:max-w-3xl"
            >
              <motion.div variants={fadeInUp as any} className="mb-6 overflow-hidden">
                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-lg">
                  새로운 가족을 만나는<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100 drop-shadow-sm">
                    가장 완벽한 여정
                  </span>
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp as any} className="mb-10">
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed break-keep drop-shadow">
                  리호밍센터는 아름답고 신뢰할 수 있는 입양 문화를 만듭니다.<br className="hidden md:block" />당신의 평생 반려가족을 지금 찾아보세요.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp as any} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/adopt"
                  className="group relative inline-flex items-center justify-center bg-white text-gray-900 px-9 py-4 rounded-full font-bold text-lg hover:bg-amber-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    입양 프로필 보기
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                </Link>
                <Link
                  href="/process"
                  className="inline-flex items-center justify-center text-white/90 border border-white/40 px-9 py-4 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/70 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                >
                  입양 절차 안내
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* 하단 중앙 스크롤 인디케이터 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          >
            {/* 마우스 모양 아이콘 */}
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
              />
            </div>
            <span className="text-white/50 text-[11px] font-semibold tracking-[0.2em] uppercase">Scroll</span>
          </motion.div>
        </motion.div>
      </section>


      {/* 2. Brand Identity Section — 흰 배경, 텍스트 효과 중심 */}
      <section
        ref={brandRef}
        className="relative z-10 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-[20vh] pt-32 md:pt-52 pb-52 overflow-hidden isolate"
      >
        {/* 배경 미세 장식 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            style={{ y: brandY, background: "radial-gradient(ellipse at center, #dbeafe 0%, transparent 70%)" }}
            className="absolute -top-[30%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30"
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

          {/* ── 상단 헤더 ── (스크롤 위치 연동) */}
          <div className="mb-24 md:mb-36">

            {/* 배지 — 스크롤 연동 */}
            <motion.div
              style={{ opacity: s2BadgeOpacity, x: s2BadgeX, filter: s2BadgeFilter }}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase text-brand-trust mb-8"
            >
              <span className="w-8 h-px bg-brand-trust inline-block" />
              Our Philosophy
            </motion.div>

            {/* 메인 헤딩 — 스크롤 연동 */}
            <motion.h2
              style={{ opacity: s2HeadingOpacity, y: s2HeadingY, filter: s2HeadingFilter }}
              className="text-4xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.15] tracking-tight mb-8 text-gray-900"
            >
              상처받은 어제를 지나,<br />
              <span className="relative inline-block">
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)" }}
                >
                  사랑받을 내일
                </span>
                <span
                  className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)" }}
                />
              </span>
              <span className="text-gray-900">을 이어줍니다.</span>
            </motion.h2>

            {/* 부제목 — 스크롤 연동 */}
            <motion.p
              style={{ opacity: s2SubOpacity, filter: s2SubFilter }}
              className="text-xl md:text-2xl text-gray-400 font-light max-w-xl leading-relaxed break-keep"
            >
              리호밍센터는 버려진 생명들이 다시 사랑받는 날까지,<br className="hidden md:block" /> 포기하지 않습니다.
            </motion.p>
          </div>

          {/* ── 가치 행: 각각 스크롤 위치에 연동 ── */}
          <div className="flex flex-col">

            {/* 01 — 왼쪽에서 스크롤 연동 */}
            <motion.div style={{ opacity: s2Item0Opacity, x: s2Item0X, filter: s2Item0Filter }} className="group relative">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16 py-12 md:py-16 px-2 md:px-4">
                <div className="flex-shrink-0 md:w-32">
                  <span className="text-[5rem] md:text-[6rem] font-black leading-none select-none" style={{ WebkitTextStroke: "2px #e5e7eb", color: "transparent", fontVariantNumeric: "tabular-nums" }}>01</span>
                </div>
                <div className="flex-shrink-0 md:w-72">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">Heal with Care</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 leading-tight">상처 치유</h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-500 font-light leading-relaxed break-keep max-w-lg group-hover:text-gray-700 transition-colors duration-300">버림받은 상처를 세심하게 어루만지고, 몸과 마음 모두 안전하게 회복될 때까지 함께합니다.</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 02 — 아래에서 스크롤 연동 */}
            <motion.div style={{ opacity: s2Item1Opacity, y: s2Item1Y, filter: s2Item1Filter }} className="group relative">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16 py-12 md:py-16 px-2 md:px-4">
                <div className="flex-shrink-0 md:w-32">
                  <span className="text-[5rem] md:text-[6rem] font-black leading-none select-none" style={{ WebkitTextStroke: "2px #e5e7eb", color: "transparent", fontVariantNumeric: "tabular-nums" }}>02</span>
                </div>
                <div className="flex-shrink-0 md:w-72">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">Learn to Belong</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-400 leading-tight">행동 교정</h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-500 font-light leading-relaxed break-keep max-w-lg group-hover:text-gray-700 transition-colors duration-300">전문 훈련사와 함께 사람과 어우러지는 법을 배우며, 새로운 가족 안에서 빛날 준비를 합니다.</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 03 — 오른쪽에서 스크롤 연동 */}
            <motion.div style={{ opacity: s2Item2Opacity, x: s2Item2X, filter: s2Item2Filter }} className="group relative">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16 py-12 md:py-16 px-2 md:px-4">
                <div className="flex-shrink-0 md:w-32">
                  <span className="text-[5rem] md:text-[6rem] font-black leading-none select-none" style={{ WebkitTextStroke: "2px #e5e7eb", color: "transparent", fontVariantNumeric: "tabular-nums" }}>03</span>
                </div>
                <div className="flex-shrink-0 md:w-72">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-400 block mb-2">Forever Together</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-400 leading-tight">완벽한 매칭</h3>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-500 font-light leading-relaxed break-keep max-w-lg group-hover:text-gray-700 transition-colors duration-300">입양자의 라이프스타일과 아이의 성향을 정밀하게 분석하여, 진짜 평생 가족을 연결합니다.</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-600 to-rose-400 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. Featured Adoption Profiles - 이전 섹션을 덮는 둥근 배경 */}
      <section className="relative z-20 bg-gray-50 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-30px_60px_rgba(0,0,0,0.2)] -mt-24 pt-32 md:pt-40 pb-40">
        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                가족을 기다리는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-600">아이들</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-500 font-light">당신의 작은 관심이 이 아이들에겐 기적이 됩니다.</p>
            </div>
            <Link
              href="/adopt"
              className="hidden md:inline-flex items-center text-gray-900 bg-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl group border border-gray-100"
            >
              전체 아이들 보기
              <span className="ml-3 bg-gray-100 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">&rarr;</span>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14"
          >
            {loading ? (
              [1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse bg-white rounded-[3rem] h-[500px] shadow-sm" />
              ))
            ) : (
              data?.animals?.nodes
                ?.slice(0, 3)
                .map((animal: AnimalPost) => {
                  const statusNode = animal.animalStatuses?.nodes?.[0];
                  const statusSlug = statusNode?.slug || 'available';
                  const statusName = statusNode?.name || '입양 가능';
                  const isUrgent = statusSlug === 'urgent' || statusName.includes('긴급');
                  const isAdopted = statusSlug === 'adopted' || statusName.includes('입양 완료');
                  const isAvailable = statusSlug === 'available' || statusName.includes('입양 가능');
                  
                  const acfImage = animal.animalFields?.image?.node?.sourceUrl;
                  const featuredImage = animal.featuredImage?.node?.sourceUrl;
                  const contentMatch = animal.content?.match(/<img[^>]+src="([^"]+)"/);
                  const contentImage = contentMatch ? contentMatch[1] : null;
                  const fallbackImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';
                  const imageUrl = acfImage || featuredImage || contentImage || fallbackImage;
                  
                  const age = animal.animalFields?.age || '나이 미상';
                  const gender = animal.animalFields?.gender || '';
                  const breed = animal.animalFields?.breed || '';
                  
                  return (
                  <motion.div
                    key={animal.databaseId}
                    variants={fadeInUp as any}
                    whileHover={{ y: -20, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="group bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] shadow-xl shadow-gray-200/50 transition-all duration-700 border border-gray-100/50 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-full"
                      >
                        <img
                          src={imageUrl}
                          alt={animal.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className={`absolute top-6 left-6 z-10 backdrop-blur-md px-5 py-2 rounded-full text-sm font-bold shadow-lg ${
                        isUrgent ? 'bg-rose-500/95 text-white' :
                        isAdopted ? 'bg-slate-700/90 text-slate-200' :
                        isAvailable ? 'bg-green-500/95 text-white' :
                        'bg-gray-800/95 text-white'
                      }`}>
                        {isUrgent && <span className="animate-pulse mr-2">🚨</span>}
                        {statusName}
                      </div>
                    </div>

                    <div className="p-10 md:p-12 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-bold text-gray-900">{animal.title}</h3>
                        <span className="flex items-center text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
                          {age}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-6 text-sm text-gray-600 font-medium">
                        {breed && (
                          <li className="flex items-center gap-2">
                            <span className="w-5 text-center">🐾</span>
                            {breed}
                          </li>
                        )}
                        {gender && (
                          <li className="flex items-center gap-2">
                            <span className="w-5 text-center">🏷️</span>
                            {gender}
                          </li>
                        )}
                      </ul>

                      <div className="pt-8 border-t border-gray-100/80 mt-auto">
                        <Link
                          href={`/adopt/${animal.slug}`}
                          className="flex items-center justify-between text-gray-900 font-semibold text-lg group-hover:text-brand-trust transition-colors"
                        >
                          상세 프로필 확인
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-trust group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                            &rarr;
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );})
            )}
          </motion.div>

          <div className="text-center mt-16 md:hidden">
            <Link
              href="/adopt"
              className="inline-block w-full border border-gray-200 text-gray-700 px-8 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              더 많은 아이들 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Value Proposition Section - 투명도 다르게 새로운 레이어 느낌 */}
      <section className="relative z-30 py-32 md:py-48 bg-white overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.03)] -mt-10">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]"></div>

        <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">

            {/* Left: Value Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.9, filter: "blur(15px)" }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex-1 w-full"
            >
              <div className="relative w-full aspect-[4/5] max-w-lg mx-auto lg:mr-auto rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/60">
                <video
                  src="/videos/s4_bg.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Right: Value Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-1 bg-brand-trust rounded-full"></div>
                  <span className="text-brand-trust font-bold tracking-widest uppercase text-sm">Why Rehoming Center</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-[1.2] tracking-tight">
                  왜 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-600">리호밍센터</span>인가요?
                </h2>
                <p className="text-xl lg:text-2xl text-gray-500 font-light mb-16 leading-relaxed break-keep">
                  체계적인 시스템과 전문가의 관리를 통해 가장 안전하고 행복한 입양을 약속합니다.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-6"
              >
                {[
                  {
                    title: "엄격한 건강 검진 및 케어",
                    desc: "단순 구조를 넘어, 전문 수의사의 종합 검진과 필요한 모든 접종을 완료한 건강한 아이들만 입양을 진행합니다."
                  },
                  {
                    title: "맞춤형 사회화 교육 완료",
                    desc: "전문 훈련사가 아이들의 성향을 파악하고 기본적인 예절과 문제 행동 교정을 마친 후 가정으로 입양됩니다."
                  },
                  {
                    title: "평생 사후 관리 시스템",
                    desc: "입양 후 끝나는 것이 아닙니다. 훈련, 건강 상담 등 입양가족이 겪는 어려움을 지속적으로 지원합니다."
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp as any}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 p-8 md:p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-xl group"
                  >
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-brand-trust group-hover:bg-brand-trust group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h4>
                      <p className="text-lg text-gray-500 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div >
  );
}
