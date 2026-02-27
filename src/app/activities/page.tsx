"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_ACTIVITIES } from "@/lib/queries";
import { GetActivitiesData } from "@/types/graphql";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const cardReveal: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
};

const ACTIVITY_TYPES = [
    { id: "all", label: "전체", icon: "✦" },
    { id: "rescue", label: "구조", icon: "♥" },
    { id: "partnership", label: "파트너십", icon: "★" },
    { id: "medical", label: "의료", icon: "✚" },
    { id: "campaign", label: "캠페인", icon: "◆" },
    { id: "education", label: "교육", icon: "◈" },
    { id: "support", label: "후원", icon: "❋" }
];

const TYPE_STYLES: Record<string, { gradient: string; bg: string; text: string; glow: string }> = {
    "rescue": {
        gradient: "from-blue-600 to-cyan-500", 
        bg: "bg-gradient-to-br from-blue-50 to-cyan-50", 
        text: "text-blue-700",
        glow: "shadow-blue-500/20"
    },
    "partnership": {
        gradient: "from-violet-600 to-purple-500", 
        bg: "bg-gradient-to-br from-violet-50 to-purple-50", 
        text: "text-violet-700",
        glow: "shadow-violet-500/20"
    },
    "medical": {
        gradient: "from-emerald-600 to-teal-500", 
        bg: "bg-gradient-to-br from-emerald-50 to-teal-50", 
        text: "text-emerald-700",
        glow: "shadow-emerald-500/20"
    },
    "campaign": {
        gradient: "from-amber-500 to-orange-500", 
        bg: "bg-gradient-to-br from-amber-50 to-orange-50", 
        text: "text-amber-700",
        glow: "shadow-amber-500/20"
    },
    "education": {
        gradient: "from-rose-500 to-pink-500", 
        bg: "bg-gradient-to-br from-rose-50 to-pink-50", 
        text: "text-rose-700",
        glow: "shadow-rose-500/20"
    },
    "support": {
        gradient: "from-cyan-500 to-blue-500", 
        bg: "bg-gradient-to-br from-cyan-50 to-blue-50", 
        text: "text-cyan-700",
        glow: "shadow-cyan-500/20"
    },
    "기본": { 
        gradient: "from-gray-600 to-gray-500", 
        bg: "bg-gradient-to-br from-gray-50 to-gray-100", 
        text: "text-gray-700",
        glow: "shadow-gray-500/20"
    }
};

const extractFirstImageFromContent = (content?: string) => {
    if (!content) {
        return "";
    }
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] || "";
};

export default function ActivitiesPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const heroRef = useRef(null);

    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroOpacity = useTransform(heroProgress, [0, 0.85, 1], [1, 0, 0]);
    const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
    const heroY = useTransform(heroProgress, [0, 1], [0, 100]);

    const { loading, error, data } = useQuery<GetActivitiesData>(GET_ACTIVITIES, {
        variables: { first: 50 }
    });

    const activities = data?.projects?.nodes?.map((node) => ({
        id: String(node.databaseId),
        title: node.title,
        slug: node.slug,
        categorySlug: node.projectCategories?.nodes?.[0]?.slug || "",
        categoryName: node.projectCategories?.nodes?.[0]?.name || node.activityFields?.type || "기업 활동",
        date: new Date(node.date).toLocaleDateString("ko-KR"),
        image: node.featuredImage?.node?.sourceUrl || extractFirstImageFromContent(node.content) || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
        excerpt: node.excerpt?.replace(/<[^>]+>/g, "") || "",
        impact_summary: node.activityFields?.impactSummary || "상세 성과 확인하기"
    })) || [];

    const filteredActivities = activeFilter === "all"
        ? activities
        : activities.filter((a) => a.categorySlug === activeFilter);

    const getTypeStyle = (type: string) => TYPE_STYLES[type] || TYPE_STYLES["기본"];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">

            <section ref={heroRef} className="relative h-[85vh] bg-black z-0">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="sticky top-0 h-full w-full overflow-hidden flex flex-col justify-center items-center"
                >
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255b1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10" />
                        
                        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
                    </div>

                    <motion.div 
                        style={{ y: heroY }}
                        className="relative z-20 w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 text-center mt-20"
                    >
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center max-w-4xl mx-auto"
                        >
                            <motion.div variants={fadeInUp} className="mb-6">
                                <span className="inline-block py-1.5 px-4 rounded-full border border-white/30 text-white/90 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
                                    Our Journey
                                </span>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-lg mb-8 break-keep">
                                    함께 쌓아온<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-amber-300">
                                        변화의 기록
                                    </span>
                                </h1>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed break-keep max-w-2xl mx-auto">
                                    리호밍센터의 모든 활동과 캠페인, 그리고 함께해주신 파트너분들의 소중한 발자취입니다.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                    >
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

            <section className="relative z-10 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-[10vh] pt-24 pb-16">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 md:gap-3"
                    >
                        {ACTIVITY_TYPES.map((type) => {
                            const style = type.id !== "all" ? getTypeStyle(type.id) : null;
                            const isActive = activeFilter === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setActiveFilter(type.id)}
                                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                                        isActive
                                            ? `text-white shadow-lg scale-105 ${style ? `bg-gradient-to-r ${style.gradient}` : "bg-gray-900"}`
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        {type.icon && <span className="text-xs">{type.icon}</span>}
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <section className="relative z-20 bg-white pb-32">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-200" />
                                    <div className="p-8 space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                                        <div className="h-8 bg-gray-200 rounded w-full" />
                                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-8">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">데이터를 불러올 수 없습니다</h3>
                            <p className="text-gray-500">{error.message}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 mt-16"
                        >
                            {filteredActivities.map((activity) => {
                                const style = getTypeStyle(activity.categorySlug);

                                return (
                                    <motion.article
                                        key={activity.id}
                                        variants={cardReveal}
                                        whileHover={{ y: -12 }}
                                        transition={{ duration: 0.4 }}
                                        className={`group relative h-full bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-700 ${style.glow} hover:${style.glow}`}
                                    >
                                        <Link href={`/activities/${encodeURIComponent(activity.slug)}?from=activities`} className="relative block aspect-[4/3] overflow-hidden">
                                            <motion.img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            
                                            <div className="absolute top-5 left-5 z-10">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${style.gradient} text-white shadow-lg`}>
                                                    {activity.categoryName}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex min-h-[22rem] flex-col p-8">
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {activity.date}
                                                </div>

                                                <Link href={`/activities/${encodeURIComponent(activity.slug)}?from=activities`} className="block">
                                                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 line-clamp-2 break-keep group-hover:text-brand-trust transition-colors">
                                                        {activity.title}
                                                    </h3>
                                                </Link>

                                                <p className="text-gray-500 text-sm line-clamp-2 break-keep mb-6">
                                                    {activity.excerpt}
                                                </p>

                                                <div className={`flex items-start gap-3 p-4 ${style.bg} rounded-2xl`}>
                                                    <svg className={`w-5 h-5 ${style.text} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className={`text-sm ${style.text} font-semibold line-clamp-2 break-keep`}>
                                                        {activity.impact_summary}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-gray-100">
                                                    <Link href={`/activities/${encodeURIComponent(activity.slug)}?from=activities`} className="group/btn inline-flex items-center gap-3 text-gray-900 font-bold">
                                                        <span className="relative">
                                                            자세히 보기
                                                            <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r ${style.gradient} transition-all duration-300 group-hover/btn:w-full`}></span>
                                                        </span>
                                                        <span className={`w-9 h-9 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center text-white opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    )}

                    {!loading && !error && filteredActivities.length === 0 && (
                        <div className="text-center py-32">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-8">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">해당 유형의 활동이 없습니다</h3>
                            <p className="text-gray-500 mb-8">다른 필터를 선택해보세요</p>
                            <button
                                type="button"
                                onClick={() => setActiveFilter("all")}
                                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-brand-trust transition-all duration-300 shadow-xl hover:-translate-y-1"
                            >
                                전체 보기
                            </button>
                        </div>
                    )}

                </div>
            </section>

            <section className="relative py-32 bg-brand-trust overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem] -mt-10">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full border border-white/30 text-white/90 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Join Our Movement
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 break-keep leading-[1.2]">
                        다음 활동의 주인공은<br />당신입니다
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 font-light mb-12 break-keep">
                        기업 파트너십, 재능기부, 정기 후원으로 함께해주세요.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/about"
                            className="bg-white text-brand-trust px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:-translate-y-1"
                        >
                            더 알아보기
                        </Link>
                        <Link
                            href="/about"
                            className="bg-transparent border border-white/40 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                        >
                            센터 소개
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
