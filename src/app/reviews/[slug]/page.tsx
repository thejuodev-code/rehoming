'use client';

import { useQuery } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GetReviewsData } from '@/types/graphql';
import { GET_REVIEWS } from '@/lib/queries';

function AnimalTypeBadge({ type }: { type?: string }) {
    if (!type) return null;
    const emoji = type === '강아지' ? '🐶' : type === '고양이' ? '🐱' : '🐾';
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-trust/5 text-brand-trust text-xs font-bold rounded-full border border-brand-trust/10">
            <span>{emoji}</span>
            {type}
        </span>
    );
}

export default function ReviewDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = decodeURIComponent((params?.slug as string) || '');

    const { loading, error, data } = useQuery<GetReviewsData>(GET_REVIEWS, {
        variables: { first: 200 },
        skip: !slug,
    });

    const review = data?.reviews?.nodes?.find(r => r.slug === slug);

    const formatAdoptionDate = (dateStr?: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('년')) return dateStr;
        return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse space-y-6 w-full max-w-2xl px-6">
                    <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
                    <div className="h-80 bg-gray-100 rounded-2xl" />
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-5/6" />
                        <div className="h-4 bg-gray-100 rounded w-4/6" />
                    </div>
                </div>
            </div>
        );
    }

    // ── Error / Not Found ──
    if (error || !review) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
                <p className="text-gray-400 font-medium">후기를 찾을 수 없습니다.</p>
                <button
                    onClick={() => router.push('/reviews')}
                    className="text-sm font-bold text-brand-trust hover:underline"
                >
                    ← 목록으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="w-full max-w-3xl mx-auto px-6 sm:px-8 pt-32 pb-24">

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => router.push('/reviews')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors mb-12 group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    입양 가족 이야기 목록
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-6">
                        <AnimalTypeBadge type={review.reviewFields?.animalType} />
                        {review.reviewFields?.animalName && (
                            <span className="text-sm font-bold text-gray-400">{review.reviewFields.animalName}</span>
                        )}
                    </div>

                    {/* Quote */}
                    {review.reviewFields?.quote && (
                        <blockquote className="relative mb-8 overflow-hidden">
                            <span className="absolute -top-3 -left-1 text-6xl text-brand-trust/15 font-serif leading-none select-none">"</span>
                            <p className="pl-7 text-2xl md:text-3xl font-bold text-gray-900 leading-snug break-words">
                                {review.reviewFields.quote}
                            </p>
                        </blockquote>
                    )}

                    {/* Title */}
                    <h1 className="text-2xl font-semibold text-gray-500 tracking-tight leading-snug break-words overflow-hidden mb-8">
                        {review.title}
                    </h1>

                    {/* Author */}
                    <div className="flex items-center gap-3 pb-8 border-b border-gray-100">
                        <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {(review.reviewFields?.authorName || '익').charAt(0)}
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">
                                입양인 {review.reviewFields?.authorName || '익명'} 님
                            </span>
                            {review.reviewFields?.adoptionDate && (
                                <span className="text-xs text-gray-400 font-medium">
                                    입양일 · {formatAdoptionDate(review.reviewFields.adoptionDate)}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Featured Image */}
                {review.featuredImage?.node?.sourceUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-10"
                    >
                        <img
                            src={review.featuredImage.node.sourceUrl}
                            alt={review.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                )}

                {/* Body Content (WordPress HTML) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 prose prose-lg prose-gray max-w-none
                        prose-p:text-gray-500 prose-p:font-light prose-p:leading-relaxed prose-p:break-keep
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-img:rounded-2xl prose-img:w-full
                        prose-a:text-brand-trust prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-800 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: review.content || review.excerpt || '' }}
                />

                {/* Footer nav */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                    <button
                        onClick={() => router.push('/reviews')}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
