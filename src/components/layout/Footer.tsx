import Link from "next/link";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";

export default function Footer() {
    return (
        <footer className="bg-[#1C1C1E] text-gray-300 py-24 text-sm border-t border-gray-800">
            <div className="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12">
                {/* Top Section: Branding, Links, and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-12 mb-20 pb-16 border-b border-gray-800">

                    {/* Brand Idea / Slogan (Spans 4 columns) */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start leading-relaxed">
                        <Link href="/" className="inline-block mb-8">
                            <div className="flex items-center gap-4">
                                <ImagePlaceholder width="48px" height="48px" text="로고" className="rounded-xl border-gray-700 bg-gray-800/50 !text-gray-400" />
                                <h2 className="text-3xl font-bold tracking-tighter text-white">
                                    리호밍센터 <span className="text-gray-500 font-light text-xl">Rehoming</span>
                                </h2>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed bg-gray-900/50 p-8 rounded-3xl border border-gray-800/50 inline-block w-full">
                            "평생 함께 할 가족을 만나는<br />
                            <span className="text-gray-200 font-medium text-lg">가장 아름답고 완벽한 여정</span>"
                            <br /><br />
                            <span className="text-sm text-gray-500 font-light mt-2 block">
                                대한민국을 대표하는 프리미엄 입양 연계 플랫폼
                            </span>
                        </p>
                    </div>

                    {/* Navigation Links (Spans 3 columns) */}
                    <div className="md:col-span-5 lg:col-span-3 lg:col-start-6">
                        <h3 className="font-bold text-white mb-6 tracking-wide text-xs uppercase text-brand-trust">바로가기</h3>
                        <ul className="grid grid-cols-1 gap-4">
                            <li><Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">센터 소개</Link></li>
                            <li><Link href="/process" className="hover:text-white hover:translate-x-1 inline-block transition-all">입양 절차</Link></li>
                            <li><Link href="/adopt" className="hover:text-white hover:translate-x-1 inline-block transition-all">입양 공고</Link></li>
                            <li><Link href="/reviews" className="hover:text-white hover:translate-x-1 inline-block transition-all">입양 후기</Link></li>

                        </ul>
                    </div>

                    {/* Contact & Support (Spans 4 columns) */}
                    <div className="md:col-span-7 lg:col-span-4">
                        <h3 className="font-bold text-white mb-6 tracking-wide text-xs uppercase text-brand-trust">고객센터</h3>
                        <div className="bg-[#242426] rounded-2xl p-6 border border-gray-800">
                            <div className="text-3xl font-bold text-white mb-1 tracking-tight">010-7700-6655</div>
                            <p className="text-gray-400 mb-6 font-light text-xs">24시간 연중무휴 상담 환영</p>

                            <ul className="space-y-4 text-gray-400">
                                <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                                    <span className="text-gray-500">센터 운영</span>
                                    <span className="text-white font-medium">연중무휴 10:00 - 22:00</span>
                                </li>
                                <li className="flex justify-between items-center pb-1">
                                    <span className="text-gray-500">이메일 문의</span>
                                    <a href="mailto:juolovelove@gmail.com" className="text-white hover:text-brand-trust transition-colors">juolovelove@gmail.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Legal & Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="text-gray-500">
                        <p className="mb-4 text-white font-medium text-xs tracking-wider">사랑해주오 입양센터 인천점</p>
                        <div className="space-y-2 text-xs font-light leading-relaxed">
                            <p className="flex flex-col sm:flex-row sm:space-x-4">
                                <span>대표자: 박성휘</span>
                                <span className="hidden sm:inline text-gray-700">|</span>
                                <span>사업자등록번호: 759-85-02543</span>
                                <span className="hidden sm:inline text-gray-700">|</span>
                                <span>대표번호: 010-7700-6655</span>
                            </p>
                            <p>주소: 인천광역시 남동구 논현로46번길 22, B동 1층 105호</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-4">
                        <div className="flex gap-4 mb-2">
                            {/* Social Placeholder Icons */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-trust hover:text-white transition-all"><span className="sr-only">Instagram</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-trust hover:text-white transition-all"><span className="sr-only">KakaoTalk</span><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-5.523 0-10 3.582-10 8 0 2.85 1.849 5.343 4.673 6.777-.32 1.139-1.09 4.197-1.127 4.398-.045.26.113.25.263.15 0 0 3.287-2.185 4.604-3.056.516.059 1.047.089 1.587.089 5.523 0 10-3.582 10-8s-4.477-8-10-8z" /></svg></a>
                        </div>
                        <p className="text-xs text-gray-600 font-mono tracking-widest">&copy; {new Date().getFullYear()} REHOMING CENTER.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
