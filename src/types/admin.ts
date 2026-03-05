// 어드민용 입력 타입 (Mutation용)
export interface AnimalInput {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageId?: number;
  featuredImageUrl?: string;
  animalFields: {
    age: string;
    breed: string;
    gender: '남아' | '여아' | '미상';
    weight: string;
    personality: string;
    medicalHistory: string;
    hashtags: string;
    image?: string;
  };
  animalTypeSlugs: string[]; // ['dog', 'cat', 'etc']
  animalStatusSlug: string; // 'available', 'urgent', 'adopted'
}

export interface ReviewInput {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  reviewFields: {
    authorName: string;
    animalName: string;
    animalType: '강아지' | '고양이' | '기타';
    adoptionDate: string;
    quote: string;
    isPinned: boolean;
  };
}

export interface ActivityInput {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  activityFields: {
    type: string;
    impactSummary: string;
    pintoimpact: boolean;
  };
  projectCategorySlugs: string[];
}

export interface SupportPostInput {
  title: string;
  content: string;
  supportMeta: {
    isNotice: boolean;
    viewCount: number;
    attachedFile?: string;
  };
  supportCategorySlugs: string[];
}

// 목록용 요약 타입
export interface AnimalListItem {
  id: number;
  title: string;
  status: string;
  statusSlug: string;
  type: string;
  age: string;
  gender: string;
  createdAt: string;
  imageUrl?: string;
}

export interface ReviewListItem {
  id: number;
  title: string;
  authorName: string;
  animalName: string;
  animalType: string;
  isPinned: boolean;
  createdAt: string;
  imageUrl?: string;
}

export interface ActivityListItem {
  id: number;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
}

export interface SupportPostListItem {
  id: number;
  title: string;
  category: string;
  supportCategorySlugs?: string[];
  content?: string;
  attachedFile?: string;
  isNotice: boolean;
  viewCount: number;
  authorName: string;
  createdAt: string;
}

// 대시보드 통계
export interface DashboardStats {
  totalAnimals: number;
  availableAnimals: number;
  adoptedAnimals: number;
  urgentAnimals: number;
  totalReviews: number;
  totalActivities: number;
  totalSupportPosts: number;
}
