"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Mock Data Structure (Designed to match future WP GraphQL schema)
export interface SupportPost {
    id: string;         // e.g., databaseId or uuid
    slug: string;       // URL slug for the post
    category: string;   // e.g., '공지', '후원', '봉사', '캠페인'
    title: string;      // Post title
    author: string;     // Author name (e.g., '관리자', '홍길동')
    date: string;       // Published date (YYYY.MM.DD)
    viewCount: number;  // Number of views
    isNotice?: boolean; // Pinned to the top
}

export const mockPosts: SupportPost[] = [
    {
        id: "post-1",
        slug: "monthly-support-guide",
        category: "공지",
        title: "정기 후원 및 일시 후원 계좌 안내",
        author: "관리자",
        date: "2024.03.15",
        viewCount: 12450,
        isNotice: true,
    },
    {
        id: "post-2",
        slug: "volunteer-recruitment-2403",
        category: "공지",
        title: "2024년 3월 정기 자원봉사자 모집 안내",
        author: "관리자",
        date: "2024.03.10",
        viewCount: 8932,
        isNotice: true,
    },
    {
        id: "post-3",
        slug: "medical-support-happy",
        category: "후원",
        title: "[도움요청] 교통사고 구조견 '해피'의 긴급 수술비 모금",
        author: "리호밍센터",
        date: "2024.03.18",
        viewCount: 521,
    },
    {
        id: "post-4",
        slug: "volunteer-review-weekend",
        category: "봉사",
        title: "주말 견사 청소 및 산책 봉사 다녀왔습니다!",
        author: "김봉사",
        date: "2024.03.17",
        viewCount: 204,
    },
    {
        id: "post-5",
        slug: "corporate-sponsorship-goodcompany",
        category: "소식",
        title: "(주)착한기업에서 사료 100포를 후원해주셨습니다.",
        author: "관리자",
        date: "2024.03.14",
        viewCount: 1105,
    },
    {
        id: "post-6",
        slug: "blanket-donation-guide",
        category: "후원",
        title: "겨울철 이불 및 담요 후원 관련 안내사항",
        author: "관리자",
        date: "2024.03.05",
        viewCount: 3412,
    },
    {
        id: "post-7",
        slug: "volunteer-orientation-video",
        category: "봉사",
        title: "신규 자원봉사자 필수 시청 오리엔테이션 영상",
        author: "관리자",
        date: "2024.03.01",
        viewCount: 5600,
    },
    {
        id: "post-8",
        slug: "healing-music-project",
        category: "소식",
        title: "유기동물을 위한 힐링 음원 프로젝트 수익금 기부",
        author: "싱어송라이터A",
        date: "2024.02.28",
        viewCount: 890,
    }
];

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pt-32 pb-40">
            <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-brand-trust text-[13px] font-bold tracking-widest uppercase mb-4 shadow-sm">
                        Support & Volunteer
                    </span>
                    <h1 className="text-4xl md:text-[2.75rem] font-extrabold text-gray-900 mb-6 tracking-tight">
                        후원, 봉사 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">안내</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto break-keep">
                        새로운 가족을 찾는 천사들에게 따뜻한 손길을 내어주세요.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">

                    {/* Board Utils (Search & Filter) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-10 py-8 border-b border-gray-100 gap-4">
                        <div className="text-sm font-medium text-gray-500">
                            총 <span className="text-brand-trust font-bold">{mockPosts.length}</span>개의 글이 있습니다.
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium">
                                <option>전체</option>
                                <option>공지</option>
                                <option>후원</option>
                                <option>봉사</option>
                                <option>소식</option>
                            </select>
                            <div className="relative w-full sm:w-64">
                                <input type="text" className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-4 outline-none transition-colors" placeholder="검색어를 입력하세요" />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                            </div>
                            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap hidden md:block">
                                검색
                            </button>
                        </div>
                    </div>

                    {/* Board Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-50/80 border-b border-gray-100 text-[14px]">
                                <tr>
                                    <th scope="col" className="px-6 py-5 font-bold text-center w-24 hidden sm:table-cell">번호</th>
                                    <th scope="col" className="px-6 py-5 font-bold text-center w-28 hidden md:table-cell">분류</th>
                                    <th scope="col" className="px-6 py-5 font-bold text-center">제목</th>
                                    <th scope="col" className="px-6 py-5 font-bold text-center w-32 hidden md:table-cell">작성자</th>
                                    <th scope="col" className="px-6 py-5 font-bold text-center w-28 hidden sm:table-cell">작성일</th>
                                    <th scope="col" className="px-6 py-5 font-bold text-center w-24 hidden lg:table-cell">조회수</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-[15px]">
                                {mockPosts.map((post, index) => (
                                    <tr key={post.id} className={`group hover:bg-blue-50/30 transition-colors duration-200 cursor-pointer ${post.isNotice ? 'bg-orange-50/30' : ''}`}>
                                        <td className="px-6 py-5 text-center hidden sm:table-cell">
                                            {post.isNotice ? (
                                                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded">공지</span>
                                            ) : (
                                                <span className="text-gray-400 font-medium">{mockPosts.length - index}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center hidden md:table-cell">
                                            <span className={`text-[13px] font-bold ${post.category === '공지' ? 'text-orange-600' : post.category === '후원' ? 'text-blue-600' : post.category === '봉사' ? 'text-green-600' : 'text-gray-500'}`}>
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {/* Mobile View Title formatting */}
                                            <div className="flex items-center gap-2 mb-1 md:hidden">
                                                {post.isNotice && <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none pt-[3px]">공지</span>}
                                                <span className="text-brand-trust text-[12px] font-bold">{post.category}</span>
                                            </div>
                                            <Link href={`/support/${post.slug}`} className={`block truncate max-w-[200px] sm:max-w-md lg:max-w-2xl font-medium transition-colors ${post.isNotice ? 'text-gray-900 font-bold' : 'text-gray-800 group-hover:text-brand-trust'}`}>
                                                {post.title}
                                            </Link>
                                            {/* Mobile View Footer formatting */}
                                            <div className="flex md:hidden items-center gap-3 mt-2 text-[12px] text-gray-400">
                                                <span>{post.author}</span>
                                                <span className="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
                                                <span>{post.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center hidden md:table-cell font-medium text-gray-500">{post.author}</td>
                                        <td className="px-6 py-5 text-center hidden sm:table-cell text-sm text-gray-400">{post.date}</td>
                                        <td className="px-6 py-5 text-center hidden lg:table-cell text-sm text-gray-400">{post.viewCount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center py-10 border-t border-gray-100 bg-white">
                        <nav aria-label="Page navigation" className="flex items-center gap-1">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-trust hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-trust text-white font-bold shadow-md shadow-brand-trust/20">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 font-medium hover:text-brand-trust hover:bg-blue-50 transition-colors">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 font-medium hover:text-brand-trust hover:bg-blue-50 transition-colors">3</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-trust hover:bg-blue-50 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </nav>
                    </div>

                </div>
            </div>
        </div>
    );
}
