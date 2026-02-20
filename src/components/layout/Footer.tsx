import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12 text-sm text-gray-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-200 pb-8">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-4 text-xl font-bold tracking-tighter text-brand-trust">
                            리호밍센터 (Rehoming Center)
                        </Link>
                        <p className="mb-2">대한민국에서 가장 아름답고 신뢰할 수 있는 동물 보호소 연계 플랫폼입니다.</p>
                        <p>우리의 목표는 모든 유기동물이 따뜻한 가족을 만나는 것입니다.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">바로가기</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="hover:text-brand-trust transition-colors">보호소 소개</Link></li>
                            <li><Link href="/process" className="hover:text-brand-trust transition-colors">입양 절차</Link></li>
                            <li><Link href="/adopt" className="hover:text-brand-trust transition-colors">입양 공고</Link></li>
                            <li><Link href="/donate" className="hover:text-brand-trust transition-colors">후원 안내</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">고객센터</h3>
                        <ul className="space-y-2">
                            <li>이메일: contact@rehomingcenter.kr</li>
                            <li>전화: 02-1234-5678</li>
                            <li>상담시간: 평일 10:00 - 17:00</li>
                            <li>(주말 및 공휴일 휴무)</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                        <p className="mb-1"><strong>사업자 정보</strong></p>
                        <p className="text-xs space-y-1 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
                            <span>상호명: 사랑해주오 입양센터 인천점</span>
                            <span className="hidden md:inline">|</span>
                            <span>대표자: 박성휘</span>
                            <span className="hidden md:inline">|</span>
                            <span>사업자등록번호: 759-85-02543</span>
                        </p>
                        <p className="text-xs space-y-1 md:space-y-0 md:space-x-4 flex flex-col md:flex-row mt-1">
                            <span>주소: 인천광역시 남동구 논현로46번길 22, B동 1층 105호</span>
                        </p>
                    </div>
                    <p className="text-xs">&copy; {new Date().getFullYear()} Rehoming Center. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
