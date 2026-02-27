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
