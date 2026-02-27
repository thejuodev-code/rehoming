'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ReviewPost, GetReviewsData } from '@/types/graphql';
import { GET_REVIEWS } from '@/lib/queries';

const GRID_PAGE_SIZE = 6;

// ==========================================
// Animation Variants
// ==========================================
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } }
};

// ==========================================
// Animal Type Badge
// ==========================================
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

// ==========================================
// Mock Data
// ==========================================
const MOCK_REVIEWS: ReviewPost[] = [
    {
        databaseId: 1,
        title: '콩이를 만나 인생이 달라졌어요',
        excerpt: '처음엔 걱정이 많았지만, 리호밍센터의 체계적인 상담과 사후관리 덕분에 콩이와 빠르게 유대를 쌓을 수 있었습니다. 매일 아침 꼬리 흔들며 반겨주는 콩이 덕에 하루가 행복합니다. 처음 유기동물을 입양하는 것이라 두려움도 있었는데, 센터 선생님들의 꼼꼼한 안내 덕분에 자신 있게 첫 발을 내딛을 수 있었어요.',
        content: '', slug: 'review-1', date: '2025-10-20T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop' } },
        reviewFields: { authorName: '김지현', animalName: '콩이', animalType: '강아지', adoptionDate: '2025-10-20', quote: '매일 아침 꼬리 흔들며 반겨주는 콩이 덕에 하루가 행복해요.', isPinned: true }
    },
    {
        databaseId: 2,
        title: '겁 많던 달이가 이제는 집안의 왕',
        excerpt: '센터에서 처음 만났을 때 구석에 숨어만 있던 달이가, 지금은 소파 한가운데를 당당히 차지하고 있습니다. 천천히 마음을 열어주는 과정이 너무 감동적이었어요. 센터에서 미리 행동 교정을 해주신 덕분에 집에 온 첫날부터 생각보다 훨씬 안정적이었습니다.',
        content: '', slug: 'review-2', date: '2025-09-05T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1915&auto=format&fit=crop' } },
        reviewFields: { authorName: '박서윤', animalName: '달이', animalType: '고양이', adoptionDate: '2025-09-05', quote: '구석에 숨어만 있던 달이가 이제 소파 한가운데를 차지했어요.', isPinned: false }
    },
    {
        databaseId: 3,
        title: '두 번째 가족이 된 보리',
        excerpt: '이전 가정에서 상처받은 보리를 데려오면서 걱정이 컸는데, 리호밍센터에서 이미 행동 교정을 잘 해주셔서 적응이 정말 빨랐습니다. 전문적인 시스템에 감사드립니다. 무엇보다 입양 후에도 꾸준히 연락 주시고 챙겨주시는 센터 덕분에 든든하게 키우고 있어요.',
        content: '', slug: 'review-3', date: '2025-08-15T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1974&auto=format&fit=crop' } },
        reviewFields: { authorName: '이준호', animalName: '보리', animalType: '강아지', adoptionDate: '2025-08-15', quote: '입양 후에도 꾸준히 연락 주시는 센터 덕분에 든든하게 키우고 있어요.', isPinned: false }
    },
    {
        databaseId: 4,
        title: '나비와 함께하는 첫 번째 겨울',
        excerpt: '길에서 구조된 나비를 입양한 지 벌써 3개월. 처음엔 사람 손길을 피하더니 이제는 무릎 위에서 골골송을 불러줍니다. 매 순간이 기적 같아요. 리호밍센터 덕분에 이 작은 생명과 함께하는 일상이 얼마나 큰 선물인지 매일 느낍니다.',
        content: '', slug: 'review-4', date: '2025-07-30T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop' } },
        reviewFields: { authorName: '최은서', animalName: '나비', animalType: '고양이', adoptionDate: '2025-07-30', quote: '이제는 무릎 위에서 골골송을 불러줘요. 매 순간이 기적 같아요.', isPinned: false }
    },
    {
        databaseId: 5,
        title: '아이들의 절친이 된 뭉치',
        excerpt: '아이가 둘인 집에서 입양해도 될까 고민했는데, 센터에서 아이들과 잘 맞는 성향의 뭉치를 매칭해 주셔서 걱정을 덜었어요. 지금은 아이들이 학교 갈 때마다 현관에서 기다립니다. 가족 모두가 뭉치를 사랑하게 됐어요.',
        content: '', slug: 'review-5', date: '2025-06-10T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=2070&auto=format&fit=crop' } },
        reviewFields: { authorName: '정다은', animalName: '뭉치', animalType: '강아지', adoptionDate: '2025-06-10', quote: '아이들이 학교 갈 때마다 현관에서 기다리는 뭉치, 이제 가족이에요.', isPinned: false }
    },
    {
        databaseId: 6,
        title: '10살 시니어견 하루의 두 번째 봄',
        excerpt: '나이가 많아 입양이 어려울 거라 생각했는데, 하루는 정말 온순하고 사랑스러운 아이입니다. 센터에서 시니어견의 특성과 주의사항을 꼼꼼히 알려주셔서 더욱 자신 있게 결정할 수 있었어요. 남은 시간 동안 가장 편안하고 따뜻하게 보내주고 싶어요.',
        content: '', slug: 'review-6', date: '2025-05-20T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=2568&auto=format&fit=crop' } },
        reviewFields: { authorName: '한민재', animalName: '하루', animalType: '강아지', adoptionDate: '2025-05-20', quote: '남은 시간 동안 가장 편안하고 따뜻하게 보내주고 싶어요.', isPinned: false }
    },
    {
        databaseId: 7,
        title: '새벽이, 이제는 우리 가족이에요',
        excerpt: '새벽에 구조됐다고 해서 이름이 새벽이인 이 아이. 처음 만났을 때 눈빛이 너무 맑아서 바로 마음이 갔어요. 입양 과정이 체계적이어서 신뢰가 갔고, 지금은 저희 가족의 활력소예요.',
        content: '', slug: 'review-7', date: '2025-04-10T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop' } },
        reviewFields: { authorName: '오민준', animalName: '새벽이', animalType: '강아지', adoptionDate: '2025-04-10', quote: '처음 만났을 때 눈빛이 너무 맑아서 바로 마음이 갔어요.', isPinned: false }
    },
    {
        databaseId: 8,
        title: '모카와 함께한 1년, 기적 같은 시간들',
        excerpt: '처음엔 스크래치가 심해서 걱정했는데, 센터에서 미리 케어를 받아서 그런지 훨씬 나아진 상태였어요. 지금은 같이 낮잠 자는 게 일상이 됐습니다. 리호밍센터 없었으면 모카를 만나지 못했을 거예요.',
        content: '', slug: 'review-8', date: '2025-03-22T09:00:00',
        featuredImage: { node: { sourceUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=1992&auto=format&fit=crop' } },
        reviewFields: { authorName: '임수아', animalName: '모카', animalType: '고양이', adoptionDate: '2025-03-22', quote: '지금은 같이 낮잠 자는 게 일상이 됐어요.', isPinned: false }
    },
];

// ==========================================
// Strip HTML tags from WordPress content
// ==========================================
function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')   // 태그 제거
        .replace(/&nbsp;/g, ' ')    // &nbsp; → 공백
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')       // 연속 공백 정리
        .trim();
}

// ==========================================
// Highlight search term in text
// ==========================================
function Highlight({ text, query }: { text: string; query: string }) {
    const clean = stripHtml(text);
    if (!query.trim()) return <>{clean}</>;
    const parts = clean.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                    ? <mark key={i} className="bg-brand-trust/15 text-brand-trust rounded px-0.5 not-italic font-semibold">{part}</mark>
                    : part
            )}
        </>
    );
}

// ==========================================
// Pinned (Featured) Review
// ==========================================
function PinnedReview({ review, isLast, formatAdoptionDate }: {
    review: ReviewPost;
    isLast: boolean;
    formatAdoptionDate: (d?: string) => string;
}) {
    return (
        <Link href={`/reviews/${review.slug}`}>
            <motion.article
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col lg:flex-row gap-10 lg:gap-16 pb-16 cursor-pointer ${!isLast ? 'mb-16 border-b border-gray-100' : ''}`}
            >
                {/* Pin indicator (desktop) */}
                <div className="hidden lg:flex flex-col items-center gap-2 pt-1">
                    <div className="w-8 h-8 rounded-full bg-brand-trust/8 flex items-center justify-center" title="상단 고정">
                        <svg className="w-4 h-4 text-brand-trust" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                        </svg>
                    </div>
                    <div className="w-px flex-1 bg-gray-100 min-h-[2rem]" />
                </div>

                {/* Image */}
                {review.featuredImage?.node?.sourceUrl && (
                    <div className="w-full lg:w-[45%] relative aspect-[4/3] rounded-[2rem] overflow-hidden flex-shrink-0">
                        <img
                            src={review.featuredImage.node.sourceUrl}
                            alt={review.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}

                {/* Text */}
                <div className={`flex flex-col justify-center ${review.featuredImage?.node?.sourceUrl ? 'lg:flex-1' : 'w-full'}`}>
                    <div className="flex items-center gap-2 mb-6">
                        <AnimalTypeBadge type={review.reviewFields?.animalType} />
                        {review.reviewFields?.animalName && <span className="text-sm font-bold text-gray-400 truncate max-w-[8rem]">{review.reviewFields.animalName}</span>}
                        <span className="lg:hidden inline-flex items-center gap-1 ml-auto px-2 py-0.5 bg-brand-trust/5 text-brand-trust text-[11px] font-bold rounded-full border border-brand-trust/10">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                            고정
                        </span>
                    </div>

                    {review.reviewFields?.quote && (
                        <blockquote className="relative mb-6">
                            <span className="absolute -top-2 -left-1 text-5xl text-brand-trust/20 font-serif leading-none select-none">"</span>
                            <p className="pl-6 text-2xl md:text-3xl font-bold text-gray-900 leading-snug break-keep line-clamp-3">{review.reviewFields.quote}</p>
                        </blockquote>
                    )}

                    <h2 className="text-xl font-semibold text-gray-500 tracking-tight mb-5 break-keep line-clamp-2">{review.title}</h2>
                    <p className="text-[17px] text-gray-400 font-light leading-relaxed break-keep mb-8 line-clamp-5">
                        {stripHtml(review.excerpt)}
                    </p>

                    <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {(review.reviewFields?.authorName || '익').charAt(0)}
                        </div>
                        <div>
                            <span className="text-sm font-bold text-gray-900 block">입양인 {review.reviewFields?.authorName || '익명'} 님</span>
                            {review.reviewFields?.adoptionDate && (
                                <span className="text-xs text-gray-400 font-medium">입양일 · {formatAdoptionDate(review.reviewFields.adoptionDate)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

// ==========================================
// Grid Review Card
// ==========================================
function ReviewCard({ review, query, formatAdoptionDate }: {
    review: ReviewPost;
    query: string;
    formatAdoptionDate: (d?: string) => string;
}) {
    return (
        <Link href={`/reviews/${review.slug}`}>
            <motion.article
                variants={fadeInUp}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 hover:border-gray-200 transition-all duration-500 cursor-pointer"
            >
                {review.featuredImage?.node?.sourceUrl && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <img
                            src={review.featuredImage.node.sourceUrl}
                            alt={review.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}

                <div className="p-7 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                        <AnimalTypeBadge type={review.reviewFields?.animalType} />
                        {review.reviewFields?.animalName && (
                            <span className="text-xs font-bold text-gray-400">
                                <Highlight text={review.reviewFields.animalName} query={query} />
                            </span>
                        )}
                    </div>

                    {review.reviewFields?.quote && (
                        <blockquote className="relative mb-4">
                            <span className="absolute -top-1 -left-0.5 text-3xl text-brand-trust/15 font-serif leading-none select-none">"</span>
                            <p className="pl-5 text-[17px] font-bold text-gray-900 leading-snug break-keep line-clamp-2">
                                <Highlight text={review.reviewFields.quote} query={query} />
                            </p>
                        </blockquote>
                    )}

                    <h3 className="text-[15px] font-semibold text-gray-500 tracking-tight leading-snug mb-3 break-keep line-clamp-2">
                        <Highlight text={review.title} query={query} />
                    </h3>

                    <p className="text-[14px] text-gray-400 font-light leading-relaxed break-keep line-clamp-3">
                        <Highlight text={review.excerpt} query={query} />
                    </p>

                    <div className="flex items-center gap-2.5 mt-5 pt-5 border-t border-gray-50">
                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {(review.reviewFields?.authorName || '익').charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <span className="text-xs font-bold text-gray-700 block truncate">
                                입양인 <Highlight text={review.reviewFields?.authorName || '익명'} query={query} /> 님
                            </span>
                            {review.reviewFields?.adoptionDate && (
                                <span className="text-[11px] text-gray-400 font-medium">입양일 · {formatAdoptionDate(review.reviewFields.adoptionDate)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}

// ==========================================
// Pagination Controls
// ==========================================
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;

    const pages = Array.from({ length: total }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-16">
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="이전 페이지"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${p === current
                        ? 'bg-gray-900 text-white shadow-lg scale-105'
                        : 'border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === total}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="다음 페이지"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}

// ==========================================
// Page Component
// ==========================================
export default function ReviewsPage() {
    const { loading, error, data } = useQuery<GetReviewsData>(GET_REVIEWS, {
        variables: { first: 200 },
    });
    const reviews: ReviewPost[] = data?.reviews?.nodes || [];

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    // ACF Return Format: "Y년 n월 j일" → 이미 한국어 문자열이므로 그대로 사용
    // ISO 형식(2025-10-20)이 들어올 경우에도 안전하게 처리
    const formatAdoptionDate = (dateStr?: string) => {
        if (!dateStr) return '';
        // 이미 "YYYY년 M월 D일" 형식이면 그대로 반환
        if (dateStr.includes('년')) return dateStr;
        // ISO 형식이면 변환 (mock data 혼용 대비)
        return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Split pinned vs grid
    const pinned = reviews.filter(r => r.reviewFields?.isPinned);
    const gridAll = reviews.filter(r => !r.reviewFields?.isPinned);

    // Search: filter gridAll (and optionally pinned when query exists)
    const isSearching = query.trim().length > 0;

    const matchReview = (r: ReviewPost) => {
        const q = query.toLowerCase();
        return (
            r.title.toLowerCase().includes(q) ||
            r.excerpt.toLowerCase().includes(q) ||
            (r.reviewFields?.authorName || '').toLowerCase().includes(q) ||
            (r.reviewFields?.animalName || '').toLowerCase().includes(q) ||
            (r.reviewFields?.animalType || '').toLowerCase().includes(q) ||
            (r.reviewFields?.quote || '').toLowerCase().includes(q)
        );
    };

    // During search: search ALL reviews (pinned + grid combined, shown in flat grid)
    const searchResults = useMemo(() => {
        if (!isSearching) return [];
        return reviews.filter(matchReview);
    }, [query, reviews]);

    // Paginated grid (non-search mode)
    const filteredGrid = isSearching ? [] : gridAll;
    const totalPages = Math.ceil(filteredGrid.length / GRID_PAGE_SIZE);
    const pagedGrid = filteredGrid.slice((page - 1) * GRID_PAGE_SIZE, page * GRID_PAGE_SIZE);

    const handlePageChange = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (val: string) => {
        setQuery(val);
        setPage(1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* Header */}
            <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-gray-100 pb-10"
                >
                    {/* Title row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="w-8 h-px bg-brand-trust inline-block" />
                                <span className="text-xs font-bold tracking-[0.3em] uppercase text-brand-trust">Adoption Stories</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight break-keep">
                                입양 가족 이야기
                            </h1>
                            <p className="text-lg text-gray-400 font-light mt-4 break-keep leading-relaxed">
                                리호밍센터를 통해 새로운 가족을 만난 분들의 소중한 이야기를 전합니다.
                            </p>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-brand-trust/5 flex items-center justify-center">
                                <svg className="w-6 h-6 text-brand-trust" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-2xl font-black text-gray-900">{reviews.length}</span>
                                <span className="text-sm text-gray-400 font-medium ml-1.5">건의 이야기</span>
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative max-w-xl">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                        </div>
                        <input
                            id="review-search"
                            type="text"
                            value={query}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="동물 이름, 입양인, 내용으로 검색..."
                            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-trust/20 focus:border-brand-trust/40 transition-all"
                        />
                        {query && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute inset-y-0 right-3 flex items-center px-1 text-gray-300 hover:text-gray-500 transition-colors"
                                aria-label="검색 초기화"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Loading */}
            {loading && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">
                    <div className="animate-pulse space-y-8">
                        <div className="h-80 bg-gray-50 rounded-[2rem]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-60 bg-gray-50 rounded-2xl" />)}
                        </div>
                    </div>
                </section>
            )}

            {/* Error */}
            {error && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">
                    <div className="text-center py-20">
                        <p className="text-rose-500 font-bold">데이터를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                </section>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">

                    {/* ── SEARCH RESULTS ── */}
                    <AnimatePresence mode="wait">
                        {isSearching && (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-sm text-gray-400 font-medium mb-8">
                                    <span className="font-bold text-gray-700">"{query}"</span> 검색 결과 —{' '}
                                    <span className="font-bold text-gray-900">{searchResults.length}건</span>
                                </p>

                                {searchResults.length === 0 ? (
                                    <div className="py-24 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400 font-medium">일치하는 이야기가 없습니다.</p>
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                                    >
                                        {searchResults.map(review => (
                                            <ReviewCard
                                                key={review.databaseId}
                                                review={review}
                                                query={query}
                                                formatAdoptionDate={formatAdoptionDate}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* ── NORMAL MODE ── */}
                        {!isSearching && (
                            <motion.div
                                key="normal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Pinned section */}
                                {pinned.length > 0 && (
                                    <div className="mb-20 pb-20 border-b border-gray-100">
                                        {pinned.map((review, idx) => (
                                            <PinnedReview
                                                key={review.databaseId}
                                                review={review}
                                                isLast={idx === pinned.length - 1}
                                                formatAdoptionDate={formatAdoptionDate}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Grid section label */}
                                {filteredGrid.length > 0 && (
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-900">전체 이야기</span>
                                            <span className="text-xs text-gray-400 font-medium">{filteredGrid.length}건</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {page} / {Math.max(1, totalPages)} 페이지
                                        </span>
                                    </div>
                                )}

                                {/* Paginated grid */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={page}
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                                    >
                                        {pagedGrid.map(review => (
                                            <ReviewCard
                                                key={review.databaseId}
                                                review={review}
                                                query=""
                                                formatAdoptionDate={formatAdoptionDate}
                                            />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Pagination */}
                                <Pagination current={page} total={totalPages} onChange={handlePageChange} />

                                {/* Empty */}
                                {reviews.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full py-32 flex flex-col items-center justify-center text-center"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                            <svg className="w-7 h-7 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">아직 등록된 이야기가 없습니다</h3>
                                        <p className="text-gray-400 font-light max-w-md">리호밍센터를 통해 가족을 만난 분들의 이야기가 곧 채워질 예정입니다.</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}
        </div>
    );
}
