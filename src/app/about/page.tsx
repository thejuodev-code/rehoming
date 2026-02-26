"use client";
import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";
import KakaoMapLocation from "@/components/about/KakaoMapLocation";

/* ─── Shared Animation Easing ─── */
const smooth: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Data ─── */
const stats = [
    { value: "98%", label: "입양 성공률", desc: "입양된 아이들의 행복한 정착" },
    { value: "500+", label: "누적 입양 완료", desc: "새 가족을 만난 아이들" },
    { value: "5년", label: "운영 경력", desc: "꾸준한 헌신과 전문성" },
    { value: "24/7", label: "케어 시스템", desc: "쉬지 않는 돌봄" },
];

const values = [
    {
        title: "생명 존중",
        subtitle: "Respect for Life",
        desc: "모든 생명은 소중하며, 이유 없이 버려질 수 없습니다. 끝까지 최선의 사랑을 다해 보살핍니다.",
        accent: "from-emerald-500 to-teal-500",
        bgLight: "bg-emerald-50",
        imgAlt: "생명 존중 사진",
        size: "md:col-span-2 md:row-span-2", // Large tile
    },
    {
        title: "투명한 입양",
        subtitle: "Transparent Adoption",
        desc: "아이들과 입양 가족 모두가 행복할 수 있도록 신중하고 투명하게 모든 절차를 진행합니다.",
        accent: "from-blue-500 to-indigo-500",
        bgLight: "bg-blue-50",
        imgAlt: "투명한 입양 사진",
        size: "md:col-span-1 md:row-span-1",
    },
    {
        title: "행동 교정",
        subtitle: "Behavioral Healing",
        desc: "물리적 치료를 넘어 마음의 상처까지 치유하고 전문 훈련사와 함께 사회화 교육을 병행합니다.",
        accent: "from-violet-500 to-purple-500",
        bgLight: "bg-violet-50",
        imgAlt: "행동 교정 사진",
        size: "md:col-span-1 md:row-span-1",
    },
    {
        title: "평생 책임",
        subtitle: "Lifetime Commitment",
        desc: "입양 후에도 지속적인 모니터링과 상담 시스템을 통해 파양 없는 입양 문화를 만들어 갑니다.",
        accent: "from-amber-500 to-orange-500",
        bgLight: "bg-amber-50",
        imgAlt: "평생 책임 사진",
        size: "md:col-span-2 md:row-span-1",
    },
];

export default function AboutPage() {
    /* ─── Intro Video State ─── */
    const [introFinished, setIntroFinished] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoEnd = useCallback(() => {
        setIntroFinished(true);
    }, []);

    /* ─── Hero Parallax ─── */
    const heroRef = useRef(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroOpacity = useTransform(heroProgress, [0, 0.8, 1], [1, 0.3, 0]);
    const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

    return (
        <>
            {/* ═══ INTRO VIDEO OVERLAY ═══ */}
            <AnimatePresence>
                {!introFinished && (
                    <motion.div
                        key="intro-overlay"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: smooth }}
                        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnd}
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/about_open.mp4" type="video/mp4" />
                        </video>
                        {/* Skip button */}
                        <button
                            onClick={handleVideoEnd}
                            className="absolute top-10 right-10 px-5 py-2.5 bg-white/10 backdrop-blur-md text-white/60 text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 hover:text-white transition-all z-10"
                        >
                            건너뛰기 →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ MAIN PAGE CONTENT ═══ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introFinished ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="flex flex-col min-h-screen bg-white font-sans"
            >

                {/* ═══ 1. HERO — Full-bleed Motion Graphics ═══ */}
                <section
                    ref={heroRef}
                    className="relative h-screen bg-[#030306] overflow-hidden flex items-center justify-center -mt-24 pt-24"
                    style={{ zIndex: 1 }}
                >
                    {/* ── Motion Graphics Layer ── */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {/* Base gradient */}
                        <div className="absolute inset-0 bg-[#030306]" />

                        {/* Animated orbiting ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[900px] md:h-[900px]"
                        >
                            <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
                            {/* Glowing dot on the ring */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-trust shadow-[0_0_30px_10px_rgba(59,130,246,0.4)]" />
                        </motion.div>

                        {/* Second orbiting ring — reverse */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px]"
                        >
                            <div className="absolute inset-0 rounded-full border border-white/[0.03]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_20px_8px_rgba(129,140,248,0.3)]" />
                        </motion.div>

                        {/* Floating orb — top-right */}
                        <motion.div
                            animate={{
                                x: [0, 40, -20, 30, 0],
                                y: [0, -30, 20, -40, 0],
                                scale: [1, 1.2, 0.9, 1.1, 1],
                            }}
                            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                            className="absolute top-[15%] right-[15%] w-[300px] h-[300px] rounded-full bg-blue-500/[0.07] blur-[100px]"
                        />

                        {/* Floating orb — bottom-left */}
                        <motion.div
                            animate={{
                                x: [0, -50, 30, -20, 0],
                                y: [0, 40, -30, 50, 0],
                                scale: [1, 0.8, 1.3, 0.9, 1],
                            }}
                            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
                            className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/[0.06] blur-[120px]"
                        />

                        {/* Floating orb — center */}
                        <motion.div
                            animate={{
                                scale: [1, 1.4, 1, 1.2, 1],
                                opacity: [0.04, 0.08, 0.04, 0.06, 0.04],
                            }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-trust blur-[150px]"
                        />

                        {/* Animated grid lines */}
                        <motion.div
                            animate={{ opacity: [0.02, 0.05, 0.02] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                                backgroundSize: "100px 100px",
                            }}
                        />

                        {/* Lens flare — center pulse */}
                        <motion.div
                            animate={{
                                scale: [0.8, 1.5, 0.8],
                                opacity: [0, 0.15, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
                            style={{ boxShadow: "0 0 80px 40px rgba(255,255,255,0.1), 0 0 200px 100px rgba(59,130,246,0.08)" }}
                        />

                        {/* Horizontal light streak */}
                        <motion.div
                            animate={{
                                x: ["-100%", "200%"],
                                opacity: [0, 0.3, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", repeatDelay: 4 }}
                            className="absolute top-1/2 -translate-y-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-brand-trust/40 to-transparent"
                        />

                        {/* Vertical light streak */}
                        <motion.div
                            animate={{
                                y: ["-100%", "200%"],
                                opacity: [0, 0.2, 0],
                            }}
                            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", repeatDelay: 6 }}
                            className="absolute left-1/2 -translate-x-1/2 w-px h-[400px] bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent"
                        />
                    </div>

                    {/* Brand Text Overlay */}
                    <motion.div
                        style={{ opacity: heroOpacity, scale: heroScale }}
                        className="relative z-10 text-center px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, filter: "blur(30px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 2, ease: smooth }}
                        >
                            <span className="inline-block py-1.5 px-5 rounded-full border border-white/15 text-white/50 text-xs font-bold tracking-[0.4em] uppercase mb-10 backdrop-blur-sm">
                                리호밍 센터
                            </span>

                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.9] mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-brand-trust to-indigo-300">RE</span>
                                <span className="text-white/10">—</span>
                                <span className="text-white">Home</span>
                            </h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                                className="text-xl md:text-2xl font-extralight text-white/30 tracking-wide"
                            >
                                다시, 집으로
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Scroll-down Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
                    >
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30">Scroll</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
                        >
                            <div className="w-1 h-1.5 rounded-full bg-white/40" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ═══ 2. RE-HOME MEANING — Centered Cinematic Quote ═══ */}
                <section className="relative z-10 bg-white py-28 md:py-36 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand-trust/[0.03] blur-3xl pointer-events-none" />

                    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: smooth }}
                        >
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-8 block">What is Rehoming?</span>

                            {/* Giant RE + HOME */}
                            <div className="flex items-baseline justify-center gap-3 md:gap-5 mb-12">
                                <span className="text-7xl md:text-9xl font-black text-brand-trust leading-none tracking-tighter">RE</span>
                                <span className="text-5xl md:text-7xl font-thin text-gray-200 leading-none">|</span>
                                <span className="text-7xl md:text-9xl font-black text-gray-900 leading-none tracking-tighter">Home</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, delay: 0.15, ease: smooth }}
                            className="space-y-8"
                        >
                            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed break-keep">
                                리호밍(RE-Home)의 의미에 대해 알고 계신가요?{" "}
                                직역하면 <strong className="text-gray-900 font-semibold">&ldquo;다시 집으로 돌려보낸다&rdquo;</strong>는 뜻입니다.
                                사람의 따뜻한 손길과 관심이 필요한 반려동물에게 제 2의 집을 제공한다는 의미를 담고 있습니다.
                            </p>

                            {/* Cinematic quote block */}
                            <div className="relative py-8 px-10 md:px-16">
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-brand-trust/60 via-brand-trust/20 to-transparent" />
                                <div className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-transparent via-brand-trust/20 to-brand-trust/60" />
                                <p className="text-2xl md:text-3xl font-extralight text-gray-400 leading-relaxed italic">
                                    원하는 곳에서 태어나지도,<br />
                                    원하던 곳에서 살아가는 것도 할 수 없지만.
                                </p>
                            </div>

                            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed break-keep">
                                좋은 보호자를 만나 제 2의 집에서 행복하게 살아갈 수 있도록,{" "}
                                <strong className="text-brand-trust font-semibold">리호밍센터가 돕겠습니다.</strong>
                            </p>
                        </motion.div>

                        {/* Photo row below the text */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, delay: 0.3, ease: smooth }}
                            className="mt-16 grid grid-cols-3 gap-4"
                        >
                            {["첫 만남", "교감 시간", "새 가족"].map((label, i) => (
                                <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                                    <ImagePlaceholder width="100%" height="100%" text={label} className="!rounded-none !border-none !bg-gray-100" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══ 3. PHILOSOPHY — Horizontal Card Columns ═══ */}
                <section className="relative z-10 bg-gray-50 py-0">
                    <div className="max-w-[90rem] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
                            {/* Left: Dark card */}
                            <motion.div
                                initial={{ opacity: 0, x: -80, filter: "blur(20px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.4, ease: smooth }}
                                className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white flex items-center px-10 md:px-16 lg:px-20 py-20"
                            >
                                <div className="max-w-lg">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 text-white/60 text-xs font-bold tracking-[0.25em] uppercase mb-8">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        Not a Pet Shop
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight break-keep mb-6">
                                        리호밍센터는{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-300">
                                            &ldquo;펫샵&rdquo;
                                        </span>
                                        이<br />아닙니다.
                                    </h2>
                                    <p className="text-white/50 font-light text-lg leading-relaxed break-keep">
                                        반려동물을 돈으로 거래하는 곳이 아닌, 정확한 입양절차와 관리 시스템으로 준비된 보호자에게 입양의 기회를 제공합니다.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Right: Light card */}
                            <motion.div
                                initial={{ opacity: 0, x: 80, filter: "blur(20px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.4, ease: smooth }}
                                className="bg-white flex items-center px-10 md:px-16 lg:px-20 py-20"
                            >
                                <div className="max-w-lg">
                                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-6 block">선진국형 입양센터</span>
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight break-keep mb-6">
                                        준비된 보호자에게<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-600">
                                            입양의 기회를 제공합니다
                                        </span>
                                    </h3>

                                    <div className="space-y-5">
                                        {[
                                            { icon: "🩺", text: "입양 전 전문 수의사 종합 검진 완료" },
                                            { icon: "🧠", text: "맞춤형 행동 교정 및 사회화 교육" },
                                            { icon: "💌", text: "입양 후 평생 AS 시스템 운영" },
                                        ].map((item) => (
                                            <div key={item.text} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <span className="text-2xl">{item.icon}</span>
                                                <p className="text-base font-medium text-gray-700">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ═══ 4. STATS — Large number cards with descriptions ═══ */}
                <section className="relative z-10 bg-white py-24">
                    <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: smooth }}
                                    className="group relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                                >
                                    <div className="text-6xl lg:text-7xl font-black text-brand-trust mb-3 tracking-tight">{stat.value}</div>
                                    <div className="text-lg font-bold text-gray-900 mb-2">{stat.label}</div>
                                    <div className="text-sm text-gray-400 font-light">{stat.desc}</div>
                                    {/* Decorative corner */}
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-brand-trust/5 group-hover:bg-brand-trust/10 transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 5. CORE VALUES — Bento Grid Layout ═══ */}
                <section className="relative z-10 bg-gray-50 py-24 overflow-hidden">
                    <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 60, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: smooth }}
                            className="text-center mb-16"
                        >
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-5 block">Our Values</span>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
                                흔들리지 않는{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    네 가지 원칙
                                </span>
                            </h2>
                        </motion.div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[280px]">
                            {values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: smooth }}
                                    className={`group relative overflow-hidden rounded-3xl ${v.size} cursor-default`}
                                >
                                    {/* Photo background */}
                                    <ImagePlaceholder width="100%" height="100%" text={v.imgAlt} className="!rounded-none !border-none !bg-gray-200 absolute inset-0" />
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                                        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 block mb-2">{v.subtitle}</span>
                                        <h3 className={`text-2xl md:text-3xl font-extrabold mb-3 leading-tight text-transparent bg-clip-text bg-gradient-to-r ${v.accent}`}>
                                            {v.title}
                                        </h3>
                                        <p className="text-white/60 font-light leading-relaxed text-sm break-keep max-w-sm group-hover:text-white/80 transition-colors duration-500">
                                            {v.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ 6. LOCATION ═══ */}
                <section className="relative z-10 bg-white py-24">
                    <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 60, filter: "blur(15px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: smooth }}
                            className="text-center mb-16"
                        >
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-5 block">Location</span>
                            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-5">찾아오시는 길</h2>
                            <p className="text-lg text-gray-500 font-light">언제든 방문하세요, 따뜻하게 맞이하겠습니다.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
                            {/* Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -60, filter: "blur(15px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.2, ease: smooth }}
                                className="space-y-5"
                            >
                                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-brand-trust/10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">주소</p>
                                            <p className="text-base font-semibold text-gray-800">인천광역시 남동구 논현로46번길 22</p>
                                            <p className="text-sm text-gray-500">B동 1층 105호</p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">운영 시간</p>
                                            <p className="text-base font-semibold text-gray-800">연중무휴 10:00 – 22:00</p>
                                            <p className="text-sm text-gray-500">방문은 사전 예약을 권장합니다</p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">문의</p>
                                            <p className="text-base font-semibold text-gray-800">010-7700-6655</p>
                                            <p className="text-sm text-gray-500">또는 오른쪽 채팅 버튼으로 문의하세요</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Map */}
                            <motion.div
                                initial={{ opacity: 0, x: 60, filter: "blur(15px)" }}
                                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.2, ease: smooth }}
                                className="w-full h-[500px] lg:h-[560px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100 relative bg-gray-50"
                            >
                                <KakaoMapLocation />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ═══ 7. CTA — Dark Immersive Section ═══ */}
                <section className="relative py-32 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 50%)" }} />
                    <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1, ease: smooth }}
                            className="text-3xl md:text-5xl font-extrabold text-white break-keep leading-[1.3] mb-4"
                        >
                            새 가족을 찾는 아이들이
                        </motion.h2>
                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1, ease: smooth, delay: 0.1 }}
                            className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-brand-trust break-keep leading-[1.3] mb-8"
                        >
                            기다리고 있습니다
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-lg text-white/50 font-light mb-16 break-keep leading-relaxed max-w-2xl mx-auto"
                        >
                            지금 이 순간에도 따뜻한 품을 기다리는 아이들이 있습니다.
                            입양 절차를 확인하고, 평생 가족이 되어주세요.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8, delay: 0.6, ease: smooth }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block"
                        >
                            <Link
                                href="/adopt"
                                className="flex items-center justify-center px-8 py-5 bg-white text-gray-900 font-bold text-lg md:text-xl rounded-full shadow-xl shadow-black/20 hover:shadow-white/20 transition-all group"
                            >
                                <span className="mr-3">입양 공고 보러가기</span>
                                <span className="inline-block px-3 py-1 bg-brand-trust/10 text-brand-trust rounded-full text-sm font-medium tracking-wide">
                                    →
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </motion.div>
        </>
    );
}
