import AboutTabs from '@/components/about/AboutTabs';

export default function AboutPage() {
    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            {/* 프리미엄 히어로 헤더 섹션 */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-28 lg:py-36">
                {/* 배경 장식 요소들 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-brand-trust/10 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-400/5 blur-3xl" />
                    {/* 격자 패턴 */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 text-center">
                    {/* 배지 */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/70 text-sm font-medium mb-8 tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-trust animate-pulse" />
                        About Rehoming Center
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                        모든 생명에게는<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-brand-trust">사랑받을 자격이 있습니다</span>
                    </h1>
                    <p className="text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                        리호밍센터는 상처받은 동물들의 새로운 시작을 함께합니다
                    </p>
                </div>
            </section>

            {/* 통계 스트립 */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                        {[
                            { value: '98%', label: '입양 성공률' },
                            { value: '500+', label: '누적 입양 완료' },
                            { value: '5년', label: '운영 경력' },
                            { value: '24/7', label: '케어 시스템' },
                        ].map((stat) => (
                            <div key={stat.label} className="py-8 px-6 lg:px-12 text-center">
                                <div className="text-3xl lg:text-4xl font-extrabold text-brand-trust mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 탭 컨텐츠 (full-width) */}
            <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20 lg:py-28">
                <AboutTabs />
            </section>
        </div>
    );
}
