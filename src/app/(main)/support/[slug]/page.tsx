"use client";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GET_SUPPORT_POST_BY_SLUG } from "@/lib/queries";
import { GetSupportPostBySlugResponse } from "@/types/support";
import { useEffect } from "react";

const fadeInUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function SupportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const rawSlug = typeof params?.slug === 'string' ? params.slug : '';
    const slug = rawSlug ? decodeURIComponent(rawSlug) : '';

    const { loading, error, data } = useQuery<GetSupportPostBySlugResponse>(GET_SUPPORT_POST_BY_SLUG, {
        variables: { id: slug },
        skip: !slug,
        fetchPolicy: "network-only"
    });

    // Handle 404 gracefully
    useEffect(() => {
        if (!loading && !error && data && !data.supportPost) {
            router.push('/impact#support-board');
        }
    }, [loading, error, data, router]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-40">
                <div className="w-12 h-12 border-4 border-brand-trust/30 border-t-brand-trust rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || (!loading && !data?.supportPost)) {
        return (
            <div className="flex flex-col min-h-[70vh] items-center justify-center text-center px-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">게시글을 불러올 수 없습니다.</h2>
                <p className="text-gray-500 mb-8">존재하지 않거나 삭제된 게시글입니다.</p>
                <Link href="/impact#support-board" className="bg-brand-trust text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-trust/30 hover:-translate-y-1 transition-transform">
                    목록으로 돌아가기
                </Link>
            </div>
        );
    }

    const post = data!.supportPost;
    const category = post.supportCategories?.nodes?.[0]?.name || "기타";
    const author = post.author?.node?.name || "관리자";
    const rawDate = new Date(post.date);
    const dateStr = `${rawDate.getFullYear()}.${String(rawDate.getMonth() + 1).padStart(2, '0')}.${String(rawDate.getDate()).padStart(2, '0')}`;
    const viewCount = post.supportMeta?.viewCount || 0;
    const isNotice = post.supportMeta?.isNotice || false;
    const fileNode = post.supportMeta?.attachedFile?.node;

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            {/* Header Padding Area to offset fixed Nav */}
            <div className="pt-24 md:pt-32 bg-gray-50/50 pb-10">
                <div className="max-w-[72rem] mx-auto px-6 sm:px-8 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-brand-trust text-[11px] font-bold tracking-widest uppercase mb-4">
                        Support & Volunteer
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        후원, 봉사 안내
                    </h1>
                </div>
            </div>

            <main className="flex-grow pb-40 bg-white">
                <article className="max-w-[64rem] mx-auto px-4 sm:px-6 mt-10">

                    {/* Board Header (Korean Style) */}
                    <div className="border-t-[3px] border-gray-900">
                        {/* Title Row */}
                        <div className="py-6 px-4 md:px-6 bg-gray-50/30 flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-200">
                            <div className="flex-shrink-0">
                                {isNotice && <span className="inline-flex items-center justify-center px-2 py-0.5 bg-orange-100 text-orange-600 text-[11px] font-bold rounded mr-2 align-middle">공지</span>}
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded align-middle ${category === '공지' ? 'text-orange-600 border border-orange-200' : category === '후원' ? 'text-blue-600 border border-blue-200' : category === '봉사' ? 'text-green-600 border border-green-200' : 'text-gray-500 border border-gray-200'}`}>
                                    {category}
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug break-keep flex-grow">
                                {post.title}
                            </h2>
                        </div>

                        {/* Meta Data Row */}
                        <div className="py-3 px-4 md:px-6 bg-white flex flex-wrap justify-between items-center border-b border-gray-100 text-[13px] text-gray-500 gap-y-2">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    {author}
                                </span>
                                <span className="w-px h-3 bg-gray-200"></span>
                                <span>{dateStr}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    조회 <strong className="text-gray-700 font-medium ml-0.5">{viewCount.toLocaleString()}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Attachment Box (Inside Header, Korean Style) */}
                        {fileNode && (
                            <div className="py-3 px-4 md:px-6 bg-gray-50 flex items-center justify-between border-b border-gray-100 group transition-colors hover:bg-blue-50/50">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                    <span className="text-[13px] font-bold text-gray-700">첨부파일</span>
                                </div>
                                <a href={fileNode.mediaItemUrl || fileNode.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-brand-trust hover:underline underline-offset-4">
                                    <span className="truncate max-w-[200px] sm:max-w-xs md:max-w-sm">{fileNode.title || '첨부파일 다운로드'}</span>
                                    {fileNode.fileSize && <span className="text-gray-400 text-[11px]">({(fileNode.fileSize / 1024).toFixed(1)} KB)</span>}
                                    <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Board Content */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="py-16 md:py-24 px-4 md:px-8 bg-white border-b border-gray-200 min-h-[400px]">
                        <div
                            className="prose prose-base md:prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-brand-trust hover:prose-a:text-blue-700 prose-img:rounded-xl prose-img:shadow-sm"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-gray-400 text-center py-20">등록된 내용이 없습니다.</p>' }}
                        />
                    </motion.div>

                    {/* Bottom Utility / Navigation */}
                    <div className="mt-8 flex justify-end">
                        <Link href="/impact#support-board" className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md font-bold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                            목록
                        </Link>
                    </div>

                </article>
            </main>
        </div>
    );
}
