"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS } from "@/lib/queries";
import { GetProjectsData } from "@/types/project";

// Shared Premium Animation Variants
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
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const extractFirstImageFromContent = (content?: string) => {
    if (!content) {
        return "";
    }

    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    const src = match?.[1] || "";

    if (!src) {
        return "";
    }

    return src.startsWith("http://") ? src.replace("http://", "https://") : src;
};

export default function ImpactPage() {
    const { loading, error, data } = useQuery<GetProjectsData>(GET_PROJECTS, {
        variables: { first: 100 }
    });

    const displayActivities = data?.projects?.nodes?.filter((node) => !!node.activityFields?.pintoimpact).map((node) => {
        const rawContent = Reflect.get(node, "content");
        const content = typeof rawContent === "string" ? rawContent : undefined;

        return {
            id: node.databaseId,
            slug: node.slug,
            title: node.title,
            type: node.projectCategories?.nodes?.[0]?.name || node.activityFields?.type || "프로젝트",
            categorySlug: node.projectCategories?.nodes?.[0]?.slug || "",
            image: node.featuredImage?.node?.sourceUrl || extractFirstImageFromContent(content) || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
            impact_summary: node.activityFields?.impactSummary || "상세 성과 확인하기"
        };
    }) || [];

    // Hero Parallax Setup
    const heroRef = useRef(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(heroProgress, [0, 0.85, 1], [1, 0, 0]);
    const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">

            {/* 1. Hero Section - Corporate Impact Version */}
            <section ref={heroRef} className="relative h-[85vh] bg-black z-0">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="sticky top-0 h-full w-full overflow-hidden flex flex-col justify-center items-center"
                >
                    {/* Background Video Overlay */}
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        >
                            <source src="/videos/impact_hero.mp4" type="video/mp4" />
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
                                    Corporate Impact
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-lg mb-8 break-keep">
                                    우리가 함께 만드는<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-200">
                                        거대한 변화
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.div variants={fadeInUp as any}>
                                <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed break-keep max-w-2xl mx-auto">
                                    리호밍센터는 개별적인 구조를 넘어, 올바른 반려동물 문화를 정착시키고 시스템의 사각지대를 밝히는 다양한 캠페인과 지원 사업을 전개합니다.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Impact Stats & Aggregate Achievements */}
            <section className="relative z-10 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-[10vh] pt-24 pb-32">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                    >
                        {[
                            { label: "누적 구조 활동", count: "342+", desc: "새로운 기회를 얻은 생명들" },
                            { label: "누적 입양 연계", count: "289+", desc: "따뜻한 가족의 품으로" },
                            { label: "전문 의료 지원", count: "1,200+", desc: "건강 회복을 위한 헌신" }
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <h3 className="text-5xl md:text-6xl font-black text-brand-trust mb-4 font-mono tracking-tighter">{stat.count}</h3>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{stat.label}</h4>
                                <p className="text-gray-500 font-light">{stat.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 3. Corporate Activities (Alternating Magazine Layout) */}
            <section className="relative z-20 bg-white pb-40">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            주요 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">활동 및 캠페인</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto break-keep">
                            동물들의 더 나은 내일을 위해 기업, 봉사자, 파트너가 함께 이뤄낸 굵직한 발자취입니다.
                        </p>
                    </div>

                    <div className="flex flex-col gap-32">
                        {displayActivities.map((activity: any, index: number) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-150px" }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
                                >
                                    {/* Image Block */}
                                    <div className="w-full lg:w-1/2">
                                        <Link href={`/activities/${encodeURIComponent(activity.slug)}?from=impact`} className="block relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 group cursor-pointer">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                                className="w-full h-full"
                                            >
                                                <img
                                                    src={activity.image}
                                                    alt={activity.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                                            </motion.div>
                                        </Link>
                                    </div>

                                    {/* Text Block */}
                                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-6 opacity-70">
                                            <span className="w-12 h-px bg-gray-400"></span>
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{activity.type}</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 break-keep leading-tight">
                                            {activity.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 font-light mb-10 break-keep leading-relaxed">
                                            {activity.impact_summary}
                                        </p>
                                        <Link
                                            href={`/activities/${encodeURIComponent(activity.slug)}?from=impact`}
                                            className="inline-flex items-center text-brand-trust font-bold text-lg group/link"
                                        >
                                            자세히 보기
                                            <svg className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-32 text-center">
                        <Link href="/activities" className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-trust transition-all duration-300 shadow-xl hover:-translate-y-1">
                            더 많은 활동 보기
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Support CTA */}
            <section className="relative py-32 bg-brand-trust overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem] -mt-10">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]"></div>
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full border border-white/30 text-white/90 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Join Our Movement
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 break-keep leading-[1.2]">
                        생명을 살리는 가치있는 일,<br />당신도 함께할 수 있습니다.
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 font-light mb-12 break-keep">
                        기업 파트너십, 재능기부, 후원 등 다양한 방법으로 리호밍센터와 연대해주세요.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button type="button" className="bg-white text-brand-trust px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:-translate-y-1">
                            파트너십 문의하기
                        </button>
                        <button type="button" className="bg-transparent border border-white/40 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                            정기 후원 안내
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
