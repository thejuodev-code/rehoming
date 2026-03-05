'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ANIMAL_BY_SLUG } from '@/lib/queries';
import { GetAnimalBySlugData } from '@/types/graphql';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Premium animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
};

// Inline SVG Icon Components (no emojis)
function IconPaw({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3-1.5 3-3 3z" />
            <path d="M8 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            <path d="M16 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            <path d="M7 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            <path d="M17 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
        </svg>
    );
}

function IconGender({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 7V2" />
            <path d="M15 4.5L12 2L9 4.5" />
            <path d="M12 17v5" />
            <path d="M9 19.5L12 22l3-2.5" />
        </svg>
    );
}

function IconScale({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="M3 7l9-4 9 4" />
            <path d="M3 7v3c0 1.1 4 2 4 2" />
            <path d="M21 7v3c0 1.1-4 2-4 2" />
            <circle cx="7" cy="13" r="2" />
            <circle cx="17" cy="13" r="2" />
        </svg>
    );
}

function IconCalendar({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
        </svg>
    );
}

function IconMapPin({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function IconHeart({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    );
}

function IconShield({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}

export default function AdoptDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = decodeURIComponent(params.slug as string);

    const { loading, error, data } = useQuery<GetAnimalBySlugData>(GET_ANIMAL_BY_SLUG, {
        variables: { id: slug },
        skip: !slug,
        fetchPolicy: 'cache-and-network',
    });

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white pt-28 pb-40 px-6">
                <div className="w-full max-w-5xl mx-auto">
                    <div className="animate-pulse">
                        <div className="w-full aspect-[16/9] bg-gray-100 rounded-[2rem] mb-12" />
                        <div className="space-y-6">
                            <div className="h-12 bg-gray-100 rounded-lg w-1/3" />
                            <div className="h-6 bg-gray-100 rounded-lg w-1/2" />
                            <div className="grid grid-cols-4 gap-6 mt-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-20 bg-gray-50 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error || (!loading && !data?.animal)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white pt-32 pb-40 px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">프로필을 찾을 수 없습니다</h1>
                    <p className="text-gray-400 mb-10 font-light">존재하지 않거나 이미 입양이 완료된 아이일 수 있습니다.</p>
                    <button
                        onClick={() => router.push('/adopt')}
                        className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-sm tracking-wide hover:bg-gray-800 transition-colors"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const animal = data?.animal;
    if (!animal) return null;

    // Data Extraction
    const typeNode = animal.animalTypes?.nodes?.[0];
    const animalTypeName = typeNode?.name || '미분류';

    const statusNode = animal.animalStatuses?.nodes?.[0];
    const statusSlug = statusNode?.slug || 'available';
    const fields = animal.animalFields;
    const breed = fields?.breed || animalTypeName;
    const weight = fields?.weight || '미정';
    const personality = fields?.personality || '추후 업데이트 예정입니다.';
    const medicalHistory = fields?.medicalHistory || '추후 업데이트 예정입니다.';

    return (
        <div className="flex flex-col min-h-screen bg-white pt-28 pb-40 px-6">
            <main className="w-full max-w-5xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col lg:flex-row gap-12 lg:gap-16"
                >
                    {/* 1. Image Gallery */}
                    <motion.div variants={fadeInUp} className="lg:w-1/2">
                        <div className="w-full aspect-[16/9] bg-gray-100 rounded-[2rem] mb-12 overflow-hidden">
                            {animal.featuredImage?.node?.sourceUrl ? (
                                <img
                                    src={animal.featuredImage.node.sourceUrl.replace(/^http:\/\//, 'https://')}
                                    alt={animal.title || 'Animal image'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    이미지 없음
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* 2. Main Info */}
                    <motion.div variants={fadeInUp} className="lg:w-1/2">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                            {animal.title}
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 font-light">
                            {animalTypeName} • {breed}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                <IconGender className="w-6 h-6 text-brand-trust" />
                                <div>
                                    <p className="text-sm text-gray-400">성별</p>
                                    <p className="font-semibold text-gray-900">{fields?.gender || '미정'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                <IconCalendar className="w-6 h-6 text-brand-trust" />
                                <div>
                                    <p className="text-sm text-gray-400">나이</p>
                                    <p className="font-semibold text-gray-900">{fields?.age || '미정'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                <IconScale className="w-6 h-6 text-brand-trust" />
                                <div>
                                    <p className="text-sm text-gray-400">몸무게</p>
                                    <p className="font-semibold text-gray-900">{weight}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                                <IconPaw className="w-6 h-6 text-brand-trust" />
                                <div>
                                    <p className="text-sm text-gray-400">중성화</p>
                                    <p className="font-semibold text-gray-900">{fields?.neutered ? '완료' : '미완료'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hashtags */}
                        {fields?.hashtags && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {fields.hashtags.split(/[,\s]+/).filter(Boolean).map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-brand-trust/10 text-brand-trust rounded-full text-sm font-medium"
                                    >
                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                    </span>
                                ))}
                            </div>
                        )}
                        {/* CTA Button */}
                        <Link
                            href={`/adopt/apply?animal=${slug}`}
                            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-brand-trust text-white rounded-2xl font-bold text-lg tracking-wide hover:bg-brand-trust-dark transition-colors shadow-lg"
                        >
                            <IconHeart className="w-6 h-6" />
                            입양 신청하기
                        </Link>
                    </motion.div>
                </motion.div>

                {/* 3. Description */}
                <motion.div variants={fadeInUp} className="mt-20 mb-14">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                        <div className="w-1 h-6 bg-brand-trust rounded-full" />
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">소개</h2>
                    </div>
                    <p className="text-lg text-gray-500 font-light leading-relaxed">
                        {animal.excerpt ? animal.excerpt.replace(/<\/?p>/g, '') : '소개 내용이 없습니다.'}
                    </p>
                </motion.div>

                {/* 4. Personality & Medical — Two column cards */}
                <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
                    <div className="p-8 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <IconPaw className="w-6 h-6 text-brand-trust" />
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">성격</h3>
                        </div>
                        <p className="text-gray-500 font-light leading-relaxed">{personality}</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <IconShield className="w-6 h-6 text-brand-trust" />
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">의료 기록</h3>
                        </div>
                        <p className="text-gray-500 font-light leading-relaxed">{medicalHistory}</p>
                    </div>
                </motion.div>

                {/* 5. Detailed Story */}
                {animal.content && (
                    <motion.div variants={fadeInUp} className="mb-20">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-1 h-6 bg-brand-trust rounded-full" />
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">상세 이야기</h2>
                        </div>
                        <div
                            className="prose prose-lg prose-gray max-w-none prose-headings:tracking-tight prose-p:text-gray-500 prose-p:font-light prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: animal.content }}
                        />
                    </motion.div >
                )
                }
            </main >
        </div >
    );
}
