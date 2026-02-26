'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewPost } from '@/types/graphql';

// ==========================================
// Premium Animation Variants
// ==========================================
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
};

// ==========================================
// SVG Star Rating Component
// ==========================================
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    width={size}
                    height={size}
                    viewBox="0 0 20 20"
                    fill={star <= rating ? '#F59E0B' : 'none'}
                    stroke={star <= rating ? '#F59E0B' : '#D1D5DB'}
                    strokeWidth="1.5"
                    className="flex-shrink-0"
                >
                    <path d="M10 1.5l2.47 5.01L18 7.27l-4 3.9.94 5.5L10 14.14l-4.94 2.53.94-5.5-4-3.9 5.53-.76L10 1.5z" />
                </svg>
            ))}
        </div>
    );
}

// ==========================================
// Author Avatar (Initial-based)
// ==========================================
function AuthorAvatar({ name, className = '' }: { name: string; className?: string }) {
    const initial = name.charAt(0);
    return (
        <div className={`w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${className}`}>
            {initial}
        </div>
    );
}

// ==========================================
// Mock Data (GraphQL-ready shape)
// ==========================================
const MOCK_REVIEWS: ReviewPost[] = [
    {
        databaseId: 1,
        title: '콩이를 만나 인생이 달라졌어요',
        excerpt: '처음엔 걱정이 많았지만, 리호밍센터의 체계적인 상담과 사후관리 덕분에 콩이와 빠르게 유대를 쌓을 수 있었습니다. 매일 아침 꼬리 흔들며 반겨주는 콩이 덕에 하루가 행복합니다.',
        content: '',
        slug: 'review-1',
        date: '2025-12-15T09:00:00',
        featuredImage: {
            node: {
                sourceUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop'
            }
        },
        reviewFields: {
            authorName: '김지현',
            animalName: '콩이',
            adoptionDate: '2025-10-20',
            rating: 5
        }
    },
    {
        databaseId: 2,
        title: '겁 많던 달이가 이제는 집안의 왕',
        excerpt: '센터에서 처음 만났을 때 구석에 숨어만 있던 달이가, 지금은 소파 한가운데를 당당히 차지하고 있습니다. 천천히 마음을 열어주는 과정이 너무 감동적이었어요.',
        content: '',
        slug: 'review-2',
        date: '2025-11-28T09:00:00',
        featuredImage: {
            node: {
                sourceUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1915&auto=format&fit=crop'
            }
        },
        reviewFields: {
            authorName: '박서윤',
            animalName: '달이',
            adoptionDate: '2025-09-05',
            rating: 5
        }
    },
    {
        databaseId: 3,
        title: '두 번째 가족이 된 보리',
        excerpt: '이전 가정에서 상처받은 보리를 데려오면서 걱정이 컸는데, 리호밍센터에서 이미 행동 교정을 잘 해주셔서 적응이 정말 빨랐습니다. 전문적인 시스템에 감사드립니다.',
        content: '',
        slug: 'review-3',
        date: '2025-11-10T09:00:00',
        reviewFields: {
            authorName: '이준호',
            animalName: '보리',
            adoptionDate: '2025-08-15',
            rating: 5
        }
    },
    {
        databaseId: 4,
        title: '나비와 함께하는 첫 번째 겨울',
        excerpt: '길에서 구조된 나비를 입양한 지 벌써 3개월. 처음엔 사람 손길을 피하더니 이제는 무릎 위에서 골골송을 불러줍니다. 매 순간이 기적 같아요.',
        content: '',
        slug: 'review-4',
        date: '2025-10-22T09:00:00',
        featuredImage: {
            node: {
                sourceUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop'
            }
        },
        reviewFields: {
            authorName: '최은서',
            animalName: '나비',
            adoptionDate: '2025-07-30',
            rating: 4
        }
    },
    {
        databaseId: 5,
        title: '아이들의 절친이 된 뭉치',
        excerpt: '아이가 둘인 집에서 입양해도 될까 고민했는데, 센터에서 아이들과 잘 맞는 성향의 뭉치를 매칭해 주셔서 걱정을 덜었어요. 지금은 아이들이 학교 갈 때마다 현관에서 기다립니다.',
        content: '',
        slug: 'review-5',
        date: '2025-09-18T09:00:00',
        reviewFields: {
            authorName: '정다은',
            animalName: '뭉치',
            adoptionDate: '2025-06-10',
            rating: 5
        }
    },
    {
        databaseId: 6,
        title: '10살 시니어견 하루의 두 번째 봄',
        excerpt: '나이가 많아 입양이 어려울 거라 생각했는데, 하루는 정말 온순하고 사랑스러운 아이입니다. 남은 시간 동안 가장 편안하고 따뜻하게 보내주고 싶어요.',
        content: '',
        slug: 'review-6',
        date: '2025-08-05T09:00:00',
        featuredImage: {
            node: {
                sourceUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=2568&auto=format&fit=crop'
            }
        },
        reviewFields: {
            authorName: '한민재',
            animalName: '하루',
            adoptionDate: '2025-05-20',
            rating: 5
        }
    }
];

// ==========================================
// Page Component
// ==========================================
export default function ReviewsPage() {
    // --- Mock data (swap with useQuery when GraphQL CPT is ready) ---
    // const { loading, error, data } = useQuery<GetReviewsData>(GET_REVIEWS, { variables: { first: 50 } });
    // const reviews = data?.reviews?.nodes || [];
    const reviews = MOCK_REVIEWS;
    const loading = false;
    const error = null;

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const featured = reviews[0];
    const rest = reviews.slice(1);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* 1. Header Section */}
            <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-8 h-px bg-brand-trust inline-block" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-brand-trust">Adoption Stories</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight break-keep">
                            입양 후기
                        </h1>
                        <p className="text-lg text-gray-400 font-light mt-4 break-keep leading-relaxed">
                            리호밍센터를 통해 새로운 가족을 만난 분들의 진솔한 이야기입니다.
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
                            <span className="text-sm text-gray-400 font-medium ml-1.5">건의 후기</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Loading State */}
            {loading && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">
                    <div className="animate-pulse space-y-8">
                        <div className="h-80 bg-gray-50 rounded-[2rem]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-60 bg-gray-50 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Error State */}
            {error && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">
                    <div className="text-center py-20">
                        <p className="text-rose-500 font-bold mb-2">데이터를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                </section>
            )}

            {/* Main Content */}
            {!loading && !error && reviews.length > 0 && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">

                    {/* 2. Featured Review (First item) */}
                    {featured && (
                        <motion.article
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20 pb-20 border-b border-gray-100"
                        >
                            {/* Featured Image */}
                            {featured.featuredImage?.node?.sourceUrl && (
                                <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-[2rem] overflow-hidden flex-shrink-0">
                                    <img
                                        src={featured.featuredImage.node.sourceUrl}
                                        alt={featured.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Featured Text */}
                            <div className={`flex flex-col justify-center ${featured.featuredImage?.node?.sourceUrl ? 'lg:w-1/2' : 'w-full'}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <AuthorAvatar name={featured.reviewFields?.authorName || '익'} />
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block">{featured.reviewFields?.authorName || '익명'}</span>
                                        <span className="text-xs text-gray-400 font-medium">{formatDate(featured.date)}</span>
                                    </div>
                                </div>

                                {featured.reviewFields?.animalName && (
                                    <span className="inline-flex items-center self-start gap-1.5 px-3 py-1 bg-brand-trust/5 text-brand-trust text-xs font-bold rounded-full mb-5 border border-brand-trust/10">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 21c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3z" />
                                            <path d="M8 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                            <path d="M16 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                            <path d="M7 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                            <path d="M17 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                        </svg>
                                        {featured.reviewFields.animalName}
                                    </span>
                                )}

                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5 break-keep">
                                    {featured.title}
                                </h2>

                                {featured.reviewFields?.rating && (
                                    <div className="mb-5">
                                        <StarRating rating={featured.reviewFields.rating} size={18} />
                                    </div>
                                )}

                                <p className="text-lg text-gray-500 font-light leading-relaxed break-keep">
                                    {featured.excerpt}
                                </p>
                            </div>
                        </motion.article>
                    )}

                    {/* 3. Review Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                    >
                        {rest.map((review) => {
                            const isExpanded = expandedId === review.databaseId;
                            return (
                                <motion.article
                                    key={review.databaseId}
                                    variants={fadeInUp}
                                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 hover:border-gray-200 transition-all duration-500"
                                >
                                    {/* Card Image (if available) */}
                                    {review.featuredImage?.node?.sourceUrl && (
                                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                                            <img
                                                src={review.featuredImage.node.sourceUrl}
                                                alt={review.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="p-7 md:p-8">
                                        {/* Author Row */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <AuthorAvatar name={review.reviewFields?.authorName || '익'} className="w-9 h-9 text-xs" />
                                                <div>
                                                    <span className="text-sm font-bold text-gray-900 block">{review.reviewFields?.authorName || '익명'}</span>
                                                    <span className="text-[11px] text-gray-400 font-medium">{formatDate(review.date)}</span>
                                                </div>
                                            </div>
                                            {review.reviewFields?.animalName && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-bold rounded-full border border-gray-100">
                                                    {review.reviewFields.animalName}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-snug mb-3 break-keep">
                                            {review.title}
                                        </h3>

                                        {/* Rating */}
                                        {review.reviewFields?.rating && (
                                            <div className="mb-4">
                                                <StarRating rating={review.reviewFields.rating} size={14} />
                                            </div>
                                        )}

                                        {/* Excerpt */}
                                        <p className={`text-[15px] text-gray-500 font-light leading-relaxed break-keep ${isExpanded ? '' : 'line-clamp-3'}`}>
                                            {review.excerpt}
                                        </p>

                                        {/* Read more toggle */}
                                        {review.excerpt.length > 80 && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : review.databaseId)}
                                                className="mt-3 text-sm font-semibold text-brand-trust hover:text-brand-trust/80 transition-colors"
                                            >
                                                {isExpanded ? '접기' : '더 읽기'}
                                            </button>
                                        )}
                                    </div>
                                </motion.article>
                            );
                        })}
                    </motion.div>
                </section>
            )}

            {/* Empty State */}
            {!loading && !error && reviews.length === 0 && (
                <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 pb-40">
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">아직 등록된 후기가 없습니다</h3>
                        <p className="text-gray-400 font-light max-w-md">
                            리호밍센터를 통해 가족을 만난 분들의 이야기가 곧 채워질 예정입니다.
                        </p>
                    </motion.div>
                </section>
            )}
        </div>
    );
}
