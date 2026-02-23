'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KakaoMapLocation from './KakaoMapLocation';
import ImagePlaceholder from '../common/ImagePlaceholder';

const TABS = [
    { id: 'intro', label: '보호소 소개', icon: '🏠' },
    { id: 'values', label: '핵심 가치', icon: '💛' },
    { id: 'location', label: '오시는 길', icon: '📍' },
] as const;

type TabId = typeof TABS[number]['id'];

const VALUES = [
    {
        icon: '🌱',
        title: '생명 존중',
        desc: '모든 생명은 소중하며, 이유 없이 버려질 수 없습니다. 끝까지 최선의 사랑을 다해 보살핍니다.',
        accent: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-100',
    },
    {
        icon: '🤝',
        title: '투명한 입양',
        desc: '아이들과 입양 가족 모두가 행복할 수 있도록 신중하고 투명하게 모든 절차를 진행합니다.',
        accent: 'from-blue-50 to-indigo-50',
        border: 'border-blue-100',
    },
    {
        icon: '🎓',
        title: '행동 교정',
        desc: '물리적 치료를 넘어 마음의 상처까지 치유하고 전문 훈련사와 함께 사회화 교육을 병행합니다.',
        accent: 'from-violet-50 to-purple-50',
        border: 'border-violet-100',
    },
    {
        icon: '🏡',
        title: '평생 책임',
        desc: '입양 후에도 지속적인 모니터링과 상담 시스템을 통해 파양 없는 입양 문화를 만들어 갑니다.',
        accent: 'from-amber-50 to-orange-50',
        border: 'border-amber-100',
    },
];

export default function AboutTabs() {
    const [activeTab, setActiveTab] = useState<TabId>('intro');

    return (
        <div className="w-full">
            {/* 탭 헤더 - 더 세련된 스타일 */}
            <div className="flex justify-center mb-20">
                <div className="inline-flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold rounded-xl transition-colors duration-300 z-10 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-br from-brand-trust to-blue-700 rounded-xl -z-10 shadow-lg shadow-brand-trust/30"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                />
                            )}
                            <span className="text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* ─── 보호소 소개 ─── */}
                    {activeTab === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center"
                        >
                            {/* 이미지 영역 */}
                            <div className="relative">
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40">
                                    <ImagePlaceholder width="100%" height="100%" text="따뜻한 보호소 전경 사진" className="!bg-gray-50" />
                                </div>
                                {/* 플로팅 뱃지 */}
                                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl px-6 py-4 shadow-xl border border-gray-100 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">✅</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">이달의 입양 현황</p>
                                        <p className="text-lg font-extrabold text-gray-900">12마리 새 가족!</p>
                                    </div>
                                </div>
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="space-y-8">
                                <div>
                                    <span className="inline-block text-sm font-semibold tracking-widest text-brand-trust uppercase mb-4">Our Story</span>
                                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                                        사랑으로 맞이하는<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-trust to-blue-500">새로운 안식처</span>
                                    </h2>
                                    <p className="text-xl text-gray-500 font-light leading-relaxed break-keep">
                                        리호밍센터는 파양되거나 유기된 강아지와 고양이들이 다시 밝게 웃는 날까지,
                                        전문 훈련사·수의사·케어팀과 함께 24시간 헌신적으로 돌봅니다.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { icon: '🩺', text: '입양 전 전문 수의사 종합 검진 완료' },
                                        { icon: '🧠', text: '맞춤형 행동 교정 및 사회화 교육' },
                                        { icon: '💌', text: '입양 후 평생 AS 시스템 운영' },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-2xl">{item.icon}</span>
                                            <p className="text-base font-medium text-gray-700">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── 핵심 가치 ─── */}
                    {activeTab === 'values' && (
                        <motion.div
                            key="values"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            <div className="text-center mb-16 max-w-2xl mx-auto">
                                <span className="inline-block text-sm font-semibold tracking-widest text-brand-trust uppercase mb-4">Our Values</span>
                                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">리호밍센터가 믿는 가치</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {VALUES.map((v, i) => (
                                    <motion.div
                                        key={v.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.35 }}
                                        className={`group p-8 rounded-3xl bg-gradient-to-br ${v.accent} border ${v.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default`}
                                    >
                                        <div className="text-5xl mb-6">{v.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                                        <p className="text-base text-gray-600 font-light leading-relaxed">{v.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── 오시는 길 ─── */}
                    {activeTab === 'location' && (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 items-start"
                        >
                            {/* 왼쪽: 주소 정보 카드들 */}
                            <div className="space-y-5">
                                <div>
                                    <span className="inline-block text-sm font-semibold tracking-widest text-brand-trust uppercase mb-4">Location</span>
                                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">찾아오시는 길</h2>
                                    <p className="text-gray-500 text-base">언제든 방문하세요, 따뜻하게 맞이하겠습니다.</p>
                                </div>

                                {/* 주소 카드 */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-brand-trust/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-brand-trust" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">주소</p>
                                            <p className="text-base font-semibold text-gray-800">인천광역시 남동구 논현로46번길 22</p>
                                            <p className="text-sm text-gray-500">B동 1층 105호</p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">운영 시간</p>
                                            <p className="text-base font-semibold text-gray-800">월 – 금: 10:00 – 18:00</p>
                                            <p className="text-sm text-gray-500">주말 방문은 사전 예약 필요</p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">문의 전화</p>
                                            <p className="text-base font-semibold text-gray-800">오른쪽 채팅 버튼으로 문의하세요</p>
                                            <p className="text-sm text-gray-500">채널톡 채팅 상담 운영 중</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 카카오 지도 */}
                            <div className="w-full h-[500px] lg:h-[560px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/60 border border-gray-100 relative bg-gray-50">
                                <KakaoMapLocation />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
