"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { GET_ACTIVITY_BY_SLUG } from "@/lib/queries";
import { ActivityDetailPost, GetActivityDetailData } from "@/types/graphql";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop";

const heroContainer: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
};

function extractFirstImageFromContent(content?: string): string {
    if (!content) {
        return "";
    }
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] || "";
}

function formatDate(value?: string): string {
    if (!value) {
        return "날짜 미정";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "날짜 미정";
    }
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function htmlToParagraphs(content?: string): string[] {
    if (!content) {
        return [];
    }
    const normalized = content
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/h[1-6]>/gi, "\n\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return normalized.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
}

function ActivityDetailContent({ activity, backHref, backLabel, sourceLabel }: { activity: ActivityDetailPost; backHref: string; backLabel: string; sourceLabel: string }) {
    const heroRef = useRef<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 0.1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

    const categoryName = activity.projectCategories?.nodes?.[0]?.name || activity.activityFields?.type || "프로젝트";
    const categorySlug = activity.projectCategories?.nodes?.[0]?.slug || "uncategorized";
    const impactSummary = activity.activityFields?.impactSummary || "상세 성과를 준비 중입니다.";
    const heroImage = activity.featuredImage?.node?.sourceUrl || extractFirstImageFromContent(activity.content) || PLACEHOLDER_IMAGE;
    const contentBlocks = htmlToParagraphs(activity.content);

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans">
            <section ref={heroRef} className="relative h-[72vh] overflow-hidden bg-black">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="sticky top-0 h-full w-full">
                    <div className="absolute inset-0">
                        <img src={heroImage} alt={activity.title || "활동 이미지"} className="h-full w-full object-cover opacity-45" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/20" />
                    </div>

                    <div className="relative z-10 mx-auto flex h-full w-full max-w-[90rem] items-end px-6 pb-14 sm:px-8 lg:px-12 lg:pb-20">
                        <motion.div variants={heroContainer} initial="hidden" animate="visible" className="max-w-4xl">
                            <div className="mb-5 flex items-center gap-2 text-sm text-white/80">
                                <Link href={backHref} className="font-medium hover:text-white">{sourceLabel}</Link>
                                <span className="text-white/40">/</span>
                                <span>{categoryName}</span>
                            </div>

                            <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-white/90 uppercase backdrop-blur-md">
                                {categorySlug}
                            </span>

                            <h1 className="mb-6 break-keep text-4xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                                {activity.title}
                            </h1>

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(activity.date)}</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <section className="relative -mt-10 rounded-t-[2.5rem] bg-white pt-14 pb-24 shadow-[0_-40px_80px_rgba(0,0,0,0.12)] md:-mt-14 md:rounded-t-[4rem] md:pt-20">
                <div className="mx-auto grid w-full max-w-[90rem] grid-cols-1 gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
                    <motion.article variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="lg:col-span-8">
                        <div className="mb-10 rounded-[1.75rem] border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8">
                            <p className="flex items-start gap-3 text-base font-bold text-brand-trust md:text-lg">
                                <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                    <span className="mr-2 font-medium text-gray-500">핵심 성과:</span>
                                    {impactSummary}
                                </span>
                            </p>
                        </div>

                        <div className="space-y-6 break-keep text-lg leading-relaxed text-gray-600">
                            {contentBlocks.length > 0 ? (
                                contentBlocks.map((block, index) => (
                                    <p key={`${activity.databaseId}-${index}`}>{block}</p>
                                ))
                            ) : (
                                <p>본문을 준비 중입니다.</p>
                            )}
                        </div>
                    </motion.article>

                    <motion.aside variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="lg:col-span-4">
                        <div className="sticky top-24 space-y-5">
                            <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-7">
                                <h3 className="mb-6 text-lg font-bold text-gray-900">프로젝트 정보</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-full bg-brand-trust/10 p-2">
                                            <svg className="h-4 w-4 text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">분류</p>
                                            <p className="font-bold text-gray-900">{categoryName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 rounded-full bg-brand-trust/10 p-2">
                                            <svg className="h-4 w-4 text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">진행일</p>
                                            <p className="font-bold text-gray-900">{formatDate(activity.date)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href={backHref} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-trust">
                                <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                                {backLabel}
                            </Link>
                        </div>
                    </motion.aside>
                </div>
            </section>
        </div>
    );
}

export default function ActivityDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const source = searchParams.get("from");
    const backHref = source === "impact" ? "/impact" : "/activities";
    const backLabel = source === "impact" ? "지원 사업으로 돌아가기" : "활동 목록으로 돌아가기";
    const sourceLabel = source === "impact" ? "지원 사업" : "활동";
    const slug = useMemo(() => {
        const raw = params?.slug;
        const slugValue = Array.isArray(raw) ? raw[0] : raw;
        return decodeURIComponent(slugValue || "");
    }, [params]);

    const { loading, error, data } = useQuery<GetActivityDetailData>(GET_ACTIVITY_BY_SLUG, {
        variables: { slug },
        skip: !slug
    });

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex animate-pulse flex-col items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-gray-200" />
                    <div className="h-4 w-56 rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (error || !data?.projects?.nodes?.[0]) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white px-6">
                <div className="text-center">
                    <h1 className="mb-3 text-3xl font-extrabold text-gray-900 md:text-4xl">활동을 찾을 수 없습니다</h1>
                    <p className="mb-8 text-gray-500">요청하신 페이지 정보를 불러올 수 없습니다.</p>
                    <Link href={backHref} className="inline-flex items-center gap-2 text-base font-bold text-brand-trust hover:underline">
                        <svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {backLabel}
                    </Link>
                </div>
            </div>
        );
    }

    return <ActivityDetailContent activity={data.projects.nodes[0]} backHref={backHref} backLabel={backLabel} sourceLabel={sourceLabel} />;
}
