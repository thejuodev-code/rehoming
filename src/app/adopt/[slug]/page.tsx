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
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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
    const statusName = statusNode?.name || '입양 가능';
    const isUrgent = statusSlug === 'urgent' || statusName.includes('긴급');

    const fields = animal.animalFields;
    const age = fields?.age || '나이 미상';
    const gender = fields?.gender || '성별 미상';
    const breed = fields?.breed || animalTypeName;
    const weight = fields?.weight || '미정';
    const rescueDate = fields?.rescueDate || '미상';
    const rescueLocation = fields?.rescueLocation || '미상';
    const personality = fields?.personality || '추후 업데이트 예정입니다.';
    const medicalHistory = fields?.medicalHistory || '추후 업데이트 예정입니다.';

    const rawHashtags = fields?.hashtags || '';
    const tags = rawHashtags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const acfImage = fields?.image?.node?.sourceUrl;
    const featuredImage = animal.featuredImage?.node?.sourceUrl;
    const contentMatch = animal.content?.match(/<img[^>]+src="([^">]+)"/);
    const contentImage = contentMatch ? contentMatch[1] : null;
    const fallbackImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';
    const displayImage = acfImage || featuredImage || contentImage || fallbackImage;

    // Status badge style logic
    const getStatusStyle = () => {
        if (isUrgent) return 'bg-rose-600 text-white';
        if (statusSlug === 'adopted' || statusName.includes('입양 완료')) return 'bg-gray-900 text-white';
        if (statusSlug === 'available' || statusName.includes('입양 가능')) return 'bg-brand-trust text-white';
        if (statusSlug === 'foster' || statusName.includes('임보')) return 'bg-amber-600 text-white';
        return 'bg-gray-700 text-white';
    };

    const stats = [
        { label: '품종', value: breed, icon: <IconPaw className="w-[18px] h-[18px]" /> },
        { label: '성별', value: gender, icon: <IconGender className="w-[18px] h-[18px]" /> },
        { label: '체중', value: weight, icon: <IconScale className="w-[18px] h-[18px]" /> },
        { label: '나이', value: age, icon: <IconCalendar className="w-[18px] h-[18px]" /> },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">

            {/* Breadcrumb Navigation */}
            <div className="w-full max-w-5xl mx-auto px-6 pt-28 pb-6">
                <button
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2.5 text-gray-400 hover:text-gray-900 transition-colors duration-300"
                >
                    <span className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-gray-400 flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </span>
                    <span className="text-sm font-medium tracking-wide">목록으로</span>
                </button>
            </div>

            <main className="w-full max-w-5xl mx-auto px-6 pb-32">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                >
                    {/* 1. Hero Image */}
                    <motion.div variants={fadeInUp} className="relative w-full flex justify-center mb-10">
                        <div className="w-full max-w-lg aspect-square relative rounded-[2rem] overflow-hidden">
                            <img
                                src={displayImage}
                                alt={animal.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Subtle bottom gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-lg ${getStatusStyle()}`}>
                                    {isUrgent && (
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    )}
                                    {(!isUrgent && (statusSlug === 'available' || statusName.includes('입양 가능'))) && (
                                        <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                                    )}
                                    {statusName}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Title & Tags */}
                    <motion.div variants={fadeInUp} className="mb-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5">
                            {animal.title}
                        </h1>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2.5">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-4 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50 rounded-full border border-gray-100 tracking-wide"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* 3. Stats Row */}
                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-stretch border border-gray-100 rounded-2xl overflow-hidden mb-10">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`flex-1 flex items-center gap-4 px-6 py-5 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-gray-100' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">{stat.label}</span>
                                    <span className="text-base font-bold text-gray-900">{stat.value}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* 4. Rescue Details */}
                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="flex-1 flex items-center gap-4 px-6 py-5 bg-gray-50/70 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 flex-shrink-0 shadow-sm">
                                <IconCalendar className="w-[18px] h-[18px]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">구조 날짜</span>
                                <span className="text-base font-bold text-gray-900">{rescueDate}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-4 px-6 py-5 bg-gray-50/70 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 flex-shrink-0 shadow-sm">
                                <IconMapPin className="w-[18px] h-[18px]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">구조 장소</span>
                                <span className="text-base font-bold text-gray-900">{rescueLocation}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. Personality & Medical — Two column cards */}
                    <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
                        <div className="relative bg-white rounded-2xl border border-gray-100 p-8 group hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-trust/40 to-transparent" />
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-brand-trust/5 flex items-center justify-center text-brand-trust">
                                    <IconHeart className="w-[18px] h-[18px]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">성격 및 특징</h3>
                            </div>
                            <p className="text-gray-500 text-[15px] leading-relaxed break-keep font-light">{personality}</p>
                        </div>

                        <div className="relative bg-white rounded-2xl border border-gray-100 p-8 group hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-400">
                                    <IconShield className="w-[18px] h-[18px]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">건강 및 병력</h3>
                            </div>
                            <p className="text-gray-500 text-[15px] leading-relaxed break-keep font-light">{medicalHistory}</p>
                        </div>
                    </motion.div>

                    {/* 6. CTA Section */}
                    {(() => {
                        const isAdopted = statusSlug === 'adopted' || statusName.includes('입양 완료');
                        return (
                            <motion.div variants={fadeInUp} className="border-t border-gray-100 pt-8">
                                <div className="flex justify-start">
                                    {isAdopted ? (
                                        <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-semibold text-sm tracking-tight cursor-not-allowed select-none">
                                            <span>입양이 완료된 아이입니다</span>
                                        </div>
                                    ) : (
                                        <Link
                                            href="/process"
                                            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold text-sm tracking-tight shadow-[0_4px_20px_-8px_rgba(0,0,0,0.3)] hover:bg-brand-trust hover:shadow-brand-trust/20 hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            <span>입양 신청하기</span>
                                            <svg className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                                <p className="text-gray-300 text-xs mt-4 font-medium tracking-widest uppercase">
                                    신중하게 생각하시고 결정해주세요. 생명은 물건이 아닙니다.
                                </p>
                            </motion.div>
                        );
                    })()}
                </motion.div>

                {/* 7. WordPress Content Body */}
                {animal.content && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-16 bg-gray-50/50 rounded-[2rem] border border-gray-100 p-8 md:p-12 lg:p-16 w-full"
                    >
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-1 h-6 bg-brand-trust rounded-full" />
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">상세 이야기</h2>
                        </div>
                        <div
                            className="prose prose-lg prose-gray max-w-none prose-headings:tracking-tight prose-p:text-gray-500 prose-p:font-light prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: animal.content }}
                        />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
