'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { useQuery } from '@apollo/client/react';
import { GET_ANIMALS } from '@/lib/queries';
import { GetAnimalsData, AnimalPost } from '@/types/graphql';


// ==========================================
// 카테고리 (하드코딩 또는 서버 데이터)
// ==========================================
const CATEGORIES = [
    { id: 'all', name: '모든 아이들' },
    { id: 'dog', name: '강아지' },
    { id: 'cat', name: '고양이' }
];

const STATUS_FILTERS = [
    { id: 'all', name: '모든 상태' },
    { id: 'urgent', name: '🚨 긴급 찾기' },
    { id: 'available', name: '✨ 입양 가능' },
    { id: 'foster', name: '🏡 임보 중' },
    { id: 'adopted', name: '🎊 입양 완료' }
];

// ==========================================
// 🎨 ANIMATION VARIANTS
// ==========================================
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeScaleUp = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.3 } }
};

export default function AdoptPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeStatus, setActiveStatus] = useState('all');

    // GraphQL 데이터 가져오기
    const { loading, error, data } = useQuery<GetAnimalsData>(GET_ANIMALS, {
        variables: { first: 50 },
        fetchPolicy: 'cache-and-network'
    });

    // WordPress 데이터를 UI에 맞게 매핑
    const animals = data?.animals?.nodes?.map((node: AnimalPost) => {
        const typeNode = node.animalTypes?.nodes?.[0];
        const statusNode = node.animalStatuses?.nodes?.[0];

        const animalTypeSlug = typeNode?.slug || 'unknown';
        const animalTypeName = typeNode?.name || '미분류';

        const statusSlug = statusNode?.slug || 'available';
        const statusName = statusNode?.name || '입양 가능';
        const isUrgent = statusSlug === 'urgent' || statusName.includes('긴급');

        // 필드 추출 (ACF)
        const age = node.animalFields?.age || '나이 미상';
        const gender = node.animalFields?.gender || '성별 미상';
        const breed = node.animalFields?.breed || animalTypeName;

        // 해시태그 파싱 (쉼표로 구분되었다고 가정)
        const rawHashtags = node.animalFields?.hashtags || '';
        const tags = rawHashtags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        // 이미지 우선순위 추출
        const acfImage = node.animalFields?.image?.node?.sourceUrl;
        const featuredImage = node.featuredImage?.node?.sourceUrl;
        const contentMatch = node.content?.match(/<img[^>]+src="([^">]+)"/);
        const contentImage = contentMatch ? contentMatch[1] : null;
        const fallbackImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop';

        return {
            id: node.databaseId.toString(),
            name: node.title,
            slug: node.slug,
            type: animalTypeSlug,
            breed,
            age,
            gender,
            status: statusName,
            statusSlug,
            urgent: isUrgent,
            tags,
            image: acfImage || featuredImage || contentImage || fallbackImage
        };
    }) || [];

    // 1. 카테고리 & 상태 필터링
    const filteredAnimals = animals.filter((animal: any) => {
        // 동물 종류 필터
        const categoryMatch = activeCategory === 'all'
            ? true
            : animal.type === activeCategory;

        // 입양 상태 필터
        const statusMatch = activeStatus === 'all'
            ? true
            : activeStatus === 'urgent'
                ? animal.urgent
                : activeStatus === 'available'
                    ? animal.statusSlug === 'available' || animal.status.includes('입양 가능')
                    : activeStatus === 'foster'
                        ? animal.statusSlug === 'foster' || animal.status.includes('임보')
                        : activeStatus === 'adopted'
                            ? animal.statusSlug === 'adopted' || animal.status.includes('입양 완료')
                            : true;

        return categoryMatch && statusMatch;
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pt-32 pb-40">
            {/* 1. Hero / Header Section */}
            <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-gray-200 pb-10">
                    <div className="max-w-2xl">
                        <span className="inline-block text-brand-trust font-bold tracking-widest text-sm uppercase mb-4">
                            Meet Our Angels
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight break-keep">
                            당신의 평생을 바꿀<br />가족을 만나보세요
                        </h1>
                    </div>
                    <div className="flex flex-col flex-shrink-0 items-start md:items-end">
                        <p className="text-gray-500 font-medium mb-4">
                            모든 천사들은 철저한 건강검진을 거쳤습니다.
                        </p>
                        <Link
                            href="/process"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-800 font-bold text-sm rounded-full border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all group"
                        >
                            <span className="mr-2">입양 절차 다시보기</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Filter Tabs (Pill style) */}
            <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 mb-12 flex flex-col gap-6">
                {/* 1st Row: Main Tabs (Type) */}
                <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`relative px-7 py-3.5 rounded-full font-extrabold text-base md:text-lg transition-all duration-300 shadow-sm border ${activeCategory === category.id
                                ? "bg-gray-900 border-gray-900 text-white shadow-xl scale-105"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-900/30 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* 2nd Row: Status Filters */}
                <div className="flex flex-wrap gap-3 items-center bg-white p-2.5 rounded-full border border-gray-100 shadow-sm self-start inline-flex">
                    <span className="text-gray-400 font-bold text-sm ml-3 mr-1 hidden sm:block">상태:</span>
                    {STATUS_FILTERS.map(status => (
                        <button
                            key={status.id}
                            onClick={() => setActiveStatus(status.id)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeStatus === status.id
                                ? status.id === 'urgent'
                                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105"
                                    : "bg-gray-900 text-white shadow-md shadow-gray-900/30 scale-105"
                                : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {status.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* 3. Query States & Gallery */}
            <section className="w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] h-[450px] shadow-sm border border-gray-100 flex flex-col">
                                <div className="w-full h-[250px] bg-gray-200 rounded-t-[2rem]"></div>
                                <div className="p-8 flex flex-col gap-4">
                                    <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="w-full py-20 text-center">
                        <p className="text-rose-500 font-bold mb-2">데이터를 불러오는 중 오류가 발생했습니다.</p>
                        <p className="text-gray-500">{error.message}</p>
                    </div>
                )}

                {/* Data State */}
                {!loading && !error && (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredAnimals.map((animal: any) => (
                                <Link href={`/adopt/${animal.slug}`} key={animal.id} passHref legacyBehavior>
                                    <motion.a
                                        layout
                                        variants={fadeScaleUp}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-trust/10 border border-gray-100 transition-all duration-500 flex flex-col cursor-pointer block"
                                    >
                                        {/* Image Box */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                                            <motion.div
                                                className="w-full h-full"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            >
                                                <img
                                                    src={animal.image}
                                                    alt={animal.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>

                                            {/* Status Badge Overlays */}
                                            <div className="absolute top-5 left-5 flex flex-col gap-2">
                                                <span className={`inline-flex items-center px-4 py-1.5 backdrop-blur-md font-extrabold text-sm tracking-wide rounded-full shadow-lg ${animal.urgent ? 'bg-rose-500/95 text-white' :
                                                    animal.statusSlug === 'adopted' || animal.status.includes('입양 완료') ? 'bg-slate-700/90 text-slate-200' :
                                                        animal.statusSlug === 'available' || animal.status.includes('입양 가능') ? 'bg-green-500/95 text-white' :
                                                            animal.statusSlug === 'foster' || animal.status.includes('임보') ? 'bg-amber-400/95 text-amber-900' :
                                                                'bg-gray-800/95 text-white'
                                                    }`}>
                                                    {animal.urgent && <span className="animate-pulse mr-2 text-sm">🚨</span>}
                                                    {(!animal.urgent && (animal.statusSlug === 'available' || animal.status.includes('입양 가능'))) && <span className="w-2.5 h-2.5 rounded-full bg-white mr-2 animate-pulse"></span>}
                                                    {(!animal.urgent && (animal.statusSlug === 'adopted' || animal.status.includes('입양 완료'))) && <span className="mr-1.5 opacity-80">🎉</span>}
                                                    {animal.status}
                                                </span>
                                            </div>

                                            {/* Hover Overlay '자세히 보기' */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                                <span className="text-white font-bold tracking-wide flex items-center">
                                                    자세히 보기
                                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{animal.name}</h2>
                                                <span className="px-3 py-1 bg-gray-100 text-gray-500 font-bold text-xs rounded-full">
                                                    {animal.age}
                                                </span>
                                            </div>

                                            <ul className="space-y-2 mb-6 text-sm text-gray-600 font-medium">
                                                <li className="flex items-center gap-2">
                                                    <span className="w-5 text-center">🐾</span>
                                                    {animal.breed}
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="w-5 text-center">🏷️</span>
                                                    {animal.gender}
                                                </li>
                                            </ul>

                                            {animal.tags && animal.tags.length > 0 && (
                                                <div className="mt-auto pt-5 border-t border-gray-100 flex flex-wrap gap-2.5">
                                                    {animal.tags.map((tag: string, index: number) => (
                                                        <span key={index} className="inline-flex items-center px-3 py-1.5 text-sm font-extrabold text-brand-primary bg-brand-primary/10 rounded-full border border-brand-primary/20 shadow-sm">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.a>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredAnimals.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full py-32 flex flex-col items-center justify-center text-center"
                    >
                        <span className="text-6xl mb-6">✨</span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">모든 아이들이 가족을 찾았어요!</h3>
                        <p className="text-gray-500 font-light max-w-md">
                            현재 해당 조건에 기다리고 있는 아이가 없거나, 아직 데이터가 등록되지 않았습니다.
                        </p>
                    </motion.div>
                )}

            </section>
        </div>
    );
}
