"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS, GET_SUPPORT_POSTS } from "@/lib/queries";
import { GetProjectsData } from "@/types/project";
import { GetSupportPostsResponse } from "@/types/support";

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
    const { loading: loadingProjects, error: errorProjects, data: projectsData } = useQuery<GetProjectsData>(GET_PROJECTS, {
        variables: { first: 100 }
    });

    const { loading: loadingSupport, error: errorSupport, data: supportData } = useQuery<GetSupportPostsResponse>(GET_SUPPORT_POSTS, {
        variables: { first: 50 },
        fetchPolicy: "network-only"
    });

    const displayActivities = projectsData?.projects?.nodes?.filter((node) => !!node.activityFields?.pintoimpact).map((node) => {
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

    const displaySupportPosts = supportData?.supportPosts?.nodes?.map((node) => {
        const rawDate = new Date(node.date);
        const dateStr = `${rawDate.getFullYear()}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${String(rawDate.getDate()).padStart(2, '0')}`;

        return {
            id: node.databaseId.toString(),
            slug: node.slug,
            category: node.supportCategories?.nodes?.[0]?.name || "기타",
            title: node.title,
            author: node.author?.node?.name || "관리자",
            date: dateStr,
            viewCount: node.supportMeta?.viewCount || 0,
            isNotice: node.supportMeta?.isNotice || false,
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


            {/* 3. Corporate Activities (Alternating Magazine Layout) & Decorative Transition */}
            <section className="relative z-20 bg-white rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-[10vh] pb-40 overflow-hidden">
                {/* Decorative Marquee */}
                <div className="w-full border-b border-gray-100 bg-gray-50/50 py-4 mb-24 overflow-hidden flex whitespace-nowrap">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                        className="flex items-center text-sm font-bold tracking-[0.3em] uppercase text-gray-300"
                    >
                        {Array(5).fill("RESCUE & HEAL • SECOND CHANCES • MEDICAL CARE • BEHAVIORAL REHABILITATION • FIND LOVING HOMES • LIFETIME COMMITMENT • ").map((text, i) => (
                            <span key={i} className="mx-4">{text}</span>
                        ))}
                    </motion.div>
                </div>

                <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                    <div className="text-center mb-20">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-brand-trust text-xs font-bold tracking-widest uppercase mb-4">
                            Our Footprints
                        </span>
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

            {/* 3.5 Support/Volunteer Board Section */}
            <section id="support-board" className="relative z-20 bg-gray-50 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-40px_80px_rgba(0,0,0,0.15)] -mt-10 py-32 overflow-hidden">
                <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4">
                            Support & Volunteer
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            후원, 봉사 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">안내 게시판</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto break-keep">
                            당신의 작은 실천이 만들어내는 큰 변화, 함께해주세요.
                        </p>
                    </div>

                    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

                        {/* Board Utils (Search & Filter) */}
                        <div className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-8 border-b border-gray-100 gap-4">
                            <div className="text-sm font-medium text-gray-500">
                                총 <span className="text-brand-trust font-bold">{displaySupportPosts.length}</span>개의 글이 있습니다.
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium">
                                    <option>전체</option>
                                    <option>공지</option>
                                    <option>후원</option>
                                    <option>봉사</option>
                                    <option>소식</option>
                                </select>
                                <div className="relative w-full sm:w-64">
                                    <input type="text" className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-4 outline-none transition-colors" placeholder="검색어를 입력하세요" />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                </div>
                                <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap hidden md:block">
                                    검색
                                </button>
                            </div>
                        </div>

                        {/* Board Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-600">
                                <thead className="bg-gray-50/80 border-b border-gray-100 text-[14px]">
                                    <tr>
                                        <th scope="col" className="px-6 py-5 font-bold text-center w-24 hidden sm:table-cell">번호</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-center w-28 hidden md:table-cell">분류</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-center">제목</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-center w-32 hidden md:table-cell">작성자</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-center w-28 hidden sm:table-cell">작성일</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-center w-24 hidden lg:table-cell">조회수</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-[15px]">
                                    {loadingSupport ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">로딩 중...</td>
                                        </tr>
                                    ) : errorSupport ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-red-500 font-medium">
                                                <div className="font-bold mb-2">데이터를 불러오는 중 오류가 발생했습니다.</div>
                                                <pre className="text-xs text-left bg-red-50 p-4 rounded overflow-auto whitespace-pre-wrap">{JSON.stringify(errorSupport, null, 2)}</pre>
                                            </td>
                                        </tr>
                                    ) : displaySupportPosts.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">등록된 게시글이 없습니다.</td>
                                        </tr>
                                    ) : (
                                        displaySupportPosts.map((post, index, array) => (
                                            <tr key={post.id} className={`group hover:bg-blue-50/30 transition-colors duration-200 cursor-pointer ${post.isNotice ? 'bg-orange-50/30' : ''}`}>
                                                <td className="px-6 py-5 text-center hidden sm:table-cell">
                                                    {post.isNotice ? (
                                                        <span className="inline-flex items-center justify-center bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded leading-none pt-[3px]">공지</span>
                                                    ) : (
                                                        <span className="text-gray-400 font-medium">{array.length - index}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-center hidden md:table-cell">
                                                    <span className={`text-[13px] font-bold ${post.category === '공지' ? 'text-orange-600' : post.category === '후원' ? 'text-blue-600' : post.category === '봉사' ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {post.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 mb-1 md:hidden">
                                                        {post.isNotice && <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none pt-[3px]">공지</span>}
                                                        <span className="text-brand-trust text-[12px] font-bold">{post.category}</span>
                                                    </div>
                                                    <Link href={`/support/${post.slug}`} className={`block truncate max-w-[240px] sm:max-w-md lg:max-w-xl font-medium transition-colors ${post.isNotice ? 'text-gray-900 font-bold' : 'text-gray-800 group-hover:text-brand-trust'}`}>
                                                        {post.title}
                                                    </Link>
                                                    <div className="flex md:hidden items-center gap-3 mt-1.5 text-[12px] text-gray-400">
                                                        <span>{post.author}</span>
                                                        <span className="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
                                                        <span>{post.date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center hidden md:table-cell font-medium text-gray-500">{post.author}</td>
                                                <td className="px-6 py-5 text-center hidden sm:table-cell text-sm text-gray-400">{post.date}</td>
                                                <td className="px-6 py-5 text-center hidden lg:table-cell text-sm text-gray-400">{post.viewCount.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center py-10 border-t border-gray-100 bg-white">
                            <nav aria-label="Page navigation" className="flex items-center gap-1">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-trust hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-trust text-white font-bold shadow-md shadow-brand-trust/20">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 font-medium hover:text-brand-trust hover:bg-blue-50 transition-colors">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 font-medium hover:text-brand-trust hover:bg-blue-50 transition-colors">3</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-trust hover:bg-blue-50 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </nav>
                        </div>
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
