"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";

// Shared Premium Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const services = [
    {
        num: "01",
        title: "교감 시간",
        subtitle: "Bond Before You Decide",
        accent: "from-blue-600 to-indigo-600",
        accentLight: "bg-blue-600",
        imgAlt: "교감 시간 사진",
        desc: "입양 전 반려동물과 교감을 나누는 시간은 앞으로 함께할 평생을 결정하는 데 아주 중요합니다. 안아보고 눈을 맞추며 유대관계를 형성하는 그 시간 자체도 소중한 입양 경험입니다.",
    },
    {
        num: "02",
        title: "입양 교육",
        subtitle: "Learn to Love Right",
        accent: "from-violet-600 to-purple-600",
        accentLight: "bg-violet-600",
        imgAlt: "입양 교육 사진",
        desc: "반려동물 양육을 위한 올바른 지식과 방법을 교육합니다. 정답은 없어도 오답은 피할 수 있습니다. 보호자로서 알아야 할 기본 상식과 양육 방법을 알려드려 더 나은 반려 생활을 돕습니다.",
    },
    {
        num: "03",
        title: "건강 검진",
        subtitle: "Health First, Always",
        accent: "from-emerald-600 to-teal-600",
        accentLight: "bg-emerald-600",
        imgAlt: "건강 검진 사진",
        desc: "평균 10~15년을 함께합니다. 온 마음을 다해 사랑하는 것은 보호자의 몫이지만, 건강하게 함께하는 것은 또 다른 문제입니다. 전문 수의사와 입양 시 건강 상태를 정확히 확인하는 것이 첫걸음입니다.",
    },
    {
        num: "04",
        title: "방문 훈련",
        subtitle: "Expert Comes to You",
        accent: "from-amber-500 to-orange-500",
        accentLight: "bg-amber-500",
        imgAlt: "방문 훈련 사진",
        desc: "말 못하는 반려동물을 이해하는 일이 불가능하지 않습니다. 입양 후에도 전문 훈련사가 가정에 방문하여 보호자가 반려동물의 언어를 이해하고 문제 행동이 발생하지 않도록 함께합니다.",
    },
];

export default function ProcessPage() {
    const heroRef = useRef(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(heroProgress, [0, 0.85, 1], [1, 0, 0]);
    const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">

            {/* 1. Hero Section */}
            <section ref={heroRef} className="relative h-[85vh] bg-black z-0">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="sticky top-0 h-full w-full overflow-hidden flex flex-col justify-center items-center"
                >
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        >
                            <source src="/videos/adopt_bg.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 text-center mt-20">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center max-w-4xl mx-auto"
                        >
                            <motion.div variants={fadeInUp as any} className="mb-6">
                                <span className="inline-block py-1.5 px-4 rounded-full border border-white/30 text-white/90 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                                    Adoption Process
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-lg mb-8 break-keep">
                                    하나의 생명을 책임지는 일,<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-300">
                                        기적의 시작
                                    </span>입니다.
                                </h1>
                            </motion.div>

                            <motion.div variants={fadeInUp as any}>
                                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed break-keep max-w-2xl mx-auto">
                                    리호밍센터의 입양은 동물을 물건처럼 고르는 과정이 아닙니다.<br />
                                    모두가 행복할 수 있는, 신중하고 섬세한 가족 찾기 여정입니다.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* 2. No-Fee Philosophy Banner */}
            <section className="relative z-10 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-[10vh] pt-20 pb-0">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 px-8 md:px-16 py-16 md:py-20 text-white"
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #6366f1 0%, transparent 50%)' }} />
                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-24">
                            <div className="flex-shrink-0">
                                <span className="inline-block text-5xl md:text-6xl font-black text-white/10 select-none tracking-tighter leading-none mb-2">₩0</span>
                                <p className="text-xs font-bold tracking-[0.3em] uppercase text-brand-trust">입양 비용</p>
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight break-keep">
                                    리호밍센터는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">입양비용이 없습니다.</span>
                                </h2>
                                <p className="text-white/60 font-light leading-relaxed text-base md:text-lg break-keep max-w-2xl">
                                    반려동물을 입양할 때 필요한 것은 &lsquo;분양비&rsquo;가 아니라 보호자의 <strong className="text-white/90 font-semibold">준비</strong>입니다.
                                    리호밍센터는 분양비를 받는 대신, 정확한 절차와 체계적인 시스템으로 올바른 양육 방법을 안내합니다.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Rehoming Meaning Section */}
            <section className="relative z-10 bg-white pt-24 pb-20">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left: Photo placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full lg:w-5/12 flex-shrink-0"
                        >
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/60">
                                {/* 사진을 교체할 자리입니다 — /public/images/ 폴더에 이미지를 넣고 src를 지정해 주세요 */}
                                <ImagePlaceholder
                                    width="100%"
                                    height="100%"
                                    text="리호밍 대표 사진"
                                    className="!bg-gray-100 !rounded-none"
                                />
                                {/* RE + HOME 배지 */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg border border-white/50">
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-3xl font-black text-brand-trust leading-none">RE</span>
                                        <span className="text-3xl font-black text-gray-300 leading-none">+</span>
                                        <span className="text-3xl font-black text-gray-800 leading-none">Home</span>
                                    </div>
                                    <div className="h-8 w-px bg-gray-200" />
                                    <p className="text-sm font-semibold text-gray-600 leading-snug">다시, 집으로</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full lg:w-7/12 flex flex-col justify-center"
                        >
                            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-5 block">What is Rehoming?</span>

                            {/* RE + HOME word mark */}
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-trust leading-none">RE</span>
                                <span className="text-3xl md:text-4xl font-black text-gray-300 leading-none self-center">(다시)</span>
                                <span className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-800 leading-none">Home</span>
                                <span className="text-3xl md:text-4xl font-black text-gray-300 leading-none self-center">(집으로)</span>
                            </div>

                            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg break-keep">
                                <p>
                                    리호밍의 의미에 대해 알고 계신가요?{" "}
                                    <strong className="text-gray-900 font-semibold">"다시(RE) 집으로(Home) 돌아가다"</strong>라는 뜻을 가지고 있는데요.
                                    반려동물에게 제 2의 집을 찾아준다는 의미를 가지고 있습니다.
                                </p>
                                <p className="pl-5 border-l-4 border-gray-200 text-gray-400">
                                    원하는 곳에서 태어나지도,<br />
                                    원하던 곳에서 살아가는 것도 할 수 없지만.
                                </p>
                                <p>
                                    좋은 보호자를 만나 제 2의 집에서 행복하게 살아갈 수 있도록,
                                    <strong className="text-brand-trust font-semibold block">리호밍센터가 돕겠습니다.</strong>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. What We Provide (4 Services) — Premium Alternating Photo Layout */}
            <section className="relative z-10 bg-white overflow-hidden">

                {/* Section Header */}
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 60, filter: "blur(15px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-trust mb-5 block">Our Promise</span>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
                            입양과 함께{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                제공되는 것들
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto break-keep">
                            리호밍센터는 입양을 결정한 그 순간부터, 평생 함께합니다.
                        </p>
                    </motion.div>
                </div>

                {/* Alternating Cards */}
                <div className="flex flex-col">
                    {services.map((s, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, margin: "-100px", amount: 0.3 }}
                                transition={{ duration: 0.5 }}
                                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} min-h-[480px] md:min-h-[560px]`}
                            >
                                {/* Photo Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -120 : 120, scale: 0.9, filter: "blur(20px)" }}
                                    whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-0 overflow-hidden"
                                >
                                    <ImagePlaceholder
                                        width="100%"
                                        height="100%"
                                        text={s.imgAlt}
                                        className="!rounded-none !border-none !bg-gray-100 absolute inset-0"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-${isEven ? "r" : "l"} from-transparent via-transparent to-white opacity-40 lg:opacity-60`}
                                    />
                                    <div className={`absolute top-8 ${isEven ? "left-8" : "right-8"}`}>
                                        <span
                                            className="text-[6rem] md:text-[8rem] font-black leading-none select-none"
                                            style={{
                                                WebkitTextStroke: "2px rgba(255,255,255,0.4)",
                                                color: "transparent",
                                            }}
                                        >
                                            {s.num}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Text Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? 100 : -100, filter: "blur(20px)" }}
                                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                    className="relative w-full lg:w-1/2 flex items-center bg-white"
                                >
                                    <div className={`absolute top-0 ${isEven ? "right-0" : "left-0"} bottom-0 w-1 bg-gradient-to-b ${s.accent} hidden lg:block`} />

                                    <div className={`px-10 md:px-16 lg:px-20 py-14 max-w-xl ${isEven ? "lg:ml-0" : "lg:ml-auto"}`}>
                                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-4">{s.subtitle}</span>
                                        <h3 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r ${s.accent}`}>
                                            {s.title}
                                        </h3>
                                        <p className="text-gray-600 font-light leading-relaxed text-lg break-keep">{s.desc}</p>

                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ transformOrigin: "left" }}
                                            className={`mt-10 h-1 w-24 rounded-full bg-gradient-to-r ${s.accent}`}
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* 5. Final Call To Action */}
            <section className="relative py-32 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center z-10 relative">
                    {/* Photo placeholder for CTA section */}
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-8 shadow-xl ring-4 ring-brand-trust/10">
                        {/* 사진을 교체할 자리입니다 — /public/images/ 폴더에 이미지를 넣고 src를 지정해 주세요 */}
                        <ImagePlaceholder
                            width="100%"
                            height="100%"
                            text=""
                            className="!bg-blue-50 !rounded-none !border-none"
                        />
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl md:text-5xl font-extrabold text-gray-900 break-keep leading-[1.3] mb-2"
                    >
                        입양의 무게와 책임을
                    </motion.h2>
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        className="text-3xl md:text-5xl font-extrabold text-gray-900 break-keep leading-[1.3] mb-8"
                    >
                        온전히 이해하셨나요?
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-lg text-gray-500 font-light mb-16 break-keep leading-relaxed max-w-2xl mx-auto"
                    >
                        한 생명을 맞이하는 일에는 큰 기쁨만큼이나 큰 책임과 포기가 따릅니다.
                        가족이 될 준비가 끝나셨다면, 사랑스러운 아이들을 만나보세요.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{
                            duration: 0.8,
                            delay: 0.8, // Delayed button entrance
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block"
                    >
                        <Link
                            href="/adopt"
                            className="flex items-center justify-center px-8 py-5 bg-gradient-to-r from-brand-trust to-blue-600 text-white font-bold text-lg md:text-xl rounded-full shadow-xl shadow-brand-trust/20 hover:shadow-brand-trust/40 transition-all group"
                        >
                            <span className="mr-3">네, 준비가 되었습니다</span>
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium tracking-wide">
                                아이들 보러가기 →
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
