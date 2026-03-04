'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ANIMALS, GET_REVIEWS, GET_ACTIVITIES, GET_SUPPORT_POSTS } from '@/lib/queries';
import { GetAnimalsData, GetReviewsData, GetActivitiesData } from '@/types/graphql';
import { GetSupportPostsResponse } from '@/types/support';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, PawPrint, Heart, CheckCircle, AlertTriangle, MessageSquare, Calendar, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ title, value, icon, colorClass }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`rounded-full p-3 ${colorClass}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: animalsData, loading: animalsLoading } = useQuery<GetAnimalsData>(GET_ANIMALS, {
    variables: { first: 100 }
  });
  
  const { data: reviewsData, loading: reviewsLoading } = useQuery<GetReviewsData>(GET_REVIEWS, {
    variables: { first: 100 }
  });
  
  const { data: activitiesData, loading: activitiesLoading } = useQuery<GetActivitiesData>(GET_ACTIVITIES);
  
  const { data: supportData, loading: supportLoading } = useQuery<GetSupportPostsResponse>(GET_SUPPORT_POSTS, {
    variables: { first: 100 }
  });

  const animals = animalsData?.animals?.nodes || [];
  const totalAnimals = animals.length;
  
  const availableAnimals = animals.filter((a: any) => 
    a.animalStatuses?.nodes?.some((s: any) => s.slug === 'available')
  ).length;
  
  const urgentAnimals = animals.filter((a: any) => 
    a.animalStatuses?.nodes?.some((s: any) => s.slug === 'urgent')
  ).length;
  
  const adoptedAnimals = animals.filter((a: any) => 
    a.animalStatuses?.nodes?.some((s: any) => s.slug === 'adopted')
  ).length;

  const totalReviews = reviewsData?.reviews?.nodes?.length || 0;
  const totalActivities = activitiesData?.projects?.nodes?.length || 0;
  const totalSupportPosts = supportData?.supportPosts?.nodes?.length || 0;

  const recentAnimals = [...animals]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentReviews = [...(reviewsData?.reviews?.nodes || [])]
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const isLoading = animalsLoading || reviewsLoading || activitiesLoading || supportLoading;

  const getAnimalType = (animal: any): string => {
    return animal.animalTypes?.nodes?.[0]?.name || '강아지';
  };

  const getAnimalStatus = (animal: any) => {
    const status = animal.animalStatuses?.nodes?.[0];
    return status || { name: '입양 가능', slug: 'available' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
        <p className="text-slate-500">보호소 운영 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="총 동물 수" value={totalAnimals} icon={<PawPrint className="h-5 w-5" />} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="입양 가능" value={availableAnimals} icon={<Heart className="h-5 w-5" />} colorClass="bg-green-100 text-green-600" />
        <StatCard title="입양 완료" value={adoptedAnimals} icon={<CheckCircle className="h-5 w-5" />} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="긴급 상태" value={urgentAnimals} icon={<AlertTriangle className="h-5 w-5" />} colorClass="bg-red-100 text-red-600" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="입양 후기" value={totalReviews} icon={<MessageSquare className="h-5 w-5" />} colorClass="bg-yellow-100 text-yellow-600" />
        <StatCard title="활동/프로젝트" value={totalActivities} icon={<Calendar className="h-5 w-5" />} colorClass="bg-indigo-100 text-indigo-600" />
        <StatCard title="후원/봉사 게시글" value={totalSupportPosts} icon={<FileText className="h-5 w-5" />} colorClass="bg-teal-100 text-teal-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/animals/new">
              <Button><Plus className="mr-2 h-4 w-4" />동물 등록</Button>
            </Link>
            <Link href="/admin/reviews/new">
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" />후기 등록</Button>
            </Link>
            <Link href="/admin/activities/new">
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" />활동 등록</Button>
            </Link>
            <Link href="/admin/support/new">
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" />게시글 등록</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>최근 등록 동물</CardTitle>
          <Link href="/admin/animals">
            <Button variant="ghost" size="sm">전체 보기</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentAnimals.length === 0 ? (
            <p className="text-slate-500 text-center py-4">등록된 동물이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {recentAnimals.map((animal: any) => {
                const status = getAnimalStatus(animal);
                return (
                  <div key={animal.databaseId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-slate-200 overflow-hidden">
                        {animal.featuredImage?.node?.sourceUrl ? (
                          <img src={animal.featuredImage.node.sourceUrl} alt={animal.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <PawPrint className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{animal.title}</p>
                        <p className="text-sm text-slate-500">{getAnimalType(animal)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status.slug === 'urgent' ? 'bg-red-100 text-red-700' :
                      status.slug === 'adopted' ? 'bg-slate-100 text-slate-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {status.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>최근 입양 후기</CardTitle>
          <Link href="/admin/reviews">
            <Button variant="ghost" size="sm">전체 보기</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-slate-500 text-center py-4">등록된 후기가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review: any) => (
                <div key={review.databaseId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-slate-200 overflow-hidden">
                      {review.featuredImage?.node?.sourceUrl ? (
                        <img src={review.featuredImage.node.sourceUrl} alt={review.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <MessageSquare className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{review.title}</p>
                      <p className="text-sm text-slate-500">{review.reviewFields?.animalName}</p>
                    </div>
                  </div>
                  {review.reviewFields?.isPinned && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">고정</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
