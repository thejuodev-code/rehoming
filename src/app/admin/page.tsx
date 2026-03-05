'use client';

import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_ANIMALS, GET_REVIEWS, GET_ACTIVITIES, GET_SUPPORT_POSTS } from '@/lib/queries';
import { GetAnimalsData, GetReviewsData, GetActivitiesData } from '@/types/graphql';
import { GetSupportPostsResponse } from '@/types/support';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import {
  Plus,
  PawPrint,
  Heart,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  FileText,
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Globe,
  Search,
  Share2,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// GA4 Mock Data (나중에 실제 API로 교체)
// ==========================================
const MOCK_WEEKLY_VISITORS = [
  { day: '월', visitors: 142, pageViews: 387 },
  { day: '화', visitors: 165, pageViews: 421 },
  { day: '수', visitors: 189, pageViews: 512 },
  { day: '목', visitors: 156, pageViews: 398 },
  { day: '금', visitors: 201, pageViews: 534 },
  { day: '토', visitors: 278, pageViews: 689 },
  { day: '일', visitors: 312, pageViews: 745 },
];

const MOCK_TOP_PAGES = [
  { path: '/adopt', title: '입양하기', views: 1243, avgTime: '2:34' },
  { path: '/', title: '메인 페이지', views: 987, avgTime: '1:12' },
  { path: '/reviews', title: '입양 후기', views: 654, avgTime: '3:21' },
  { path: '/support', title: '후원/봉사', views: 432, avgTime: '1:45' },
  { path: '/process', title: '입양 절차', views: 321, avgTime: '2:08' },
];

const MOCK_TRAFFIC_SOURCES = [
  { source: '직접 방문', value: 42, color: 'var(--color-chart-1)' },
  { source: '검색 유입', value: 35, color: 'var(--color-chart-2)' },
  { source: 'SNS', value: 15, color: 'var(--color-chart-3)' },
  { source: '기타', value: 8, color: 'var(--color-chart-4)' },
];

const MOCK_GA_SUMMARY = {
  totalVisitors: 1443,
  visitorChange: 12.5,
  totalPageViews: 3686,
  pageViewChange: 8.3,
  avgSessionDuration: '2:15',
  durationChange: -3.2,
  bounceRate: 42.1,
  bounceChange: -5.7,
};

// ==========================================
// Chart Configs
// ==========================================
const visitorsChartConfig: ChartConfig = {
  visitors: { label: '방문자', color: 'var(--color-chart-1)' },
  pageViews: { label: '페이지뷰', color: 'var(--color-chart-2)' },
};

const trafficChartConfig: ChartConfig = {
  direct: { label: '직접 방문', color: 'var(--color-chart-1)' },
  search: { label: '검색 유입', color: 'var(--color-chart-2)' },
  sns: { label: 'SNS', color: 'var(--color-chart-3)' },
  etc: { label: '기타', color: 'var(--color-chart-4)' },
};

// ==========================================
// Sub Components
// ==========================================
function StatCard({
  title,
  value,
  icon,
  colorClass,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function GaSummaryCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="rounded-lg bg-background p-2 shadow-sm">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        <p className="text-lg font-bold tracking-tight">{value}</p>
      </div>
      <div
        className={`flex items-center gap-0.5 text-xs font-medium ${
          isPositive ? 'text-emerald-600' : 'text-red-500'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {Math.abs(change)}%
      </div>
    </div>
  );
}

// ==========================================
// Main Dashboard
// ==========================================
export default function AdminDashboardPage() {
  const { data: animalsData, loading: animalsLoading } = useQuery<GetAnimalsData>(
    GET_ADMIN_ANIMALS,
    { variables: { first: 100 }, fetchPolicy: 'network-only' }
  );
  const { data: reviewsData, loading: reviewsLoading } = useQuery<GetReviewsData>(GET_REVIEWS, {
    variables: { first: 100 },
  });
  const { data: activitiesData, loading: activitiesLoading } = useQuery<GetActivitiesData>(
    GET_ACTIVITIES
  );
  const { data: supportData, loading: supportLoading } = useQuery<GetSupportPostsResponse>(
    GET_SUPPORT_POSTS,
    { variables: { first: 100 } }
  );

  const animals = animalsData?.animals?.nodes || [];
  const totalAnimals = animals.length;

  const getStatusSlug = (animal: any): string =>
    animal.animalStatuses?.nodes?.[0]?.slug || 'available';

  const availableAnimals = animals.filter((a: any) => getStatusSlug(a) === 'available').length;
  const urgentAnimals = animals.filter((a: any) => getStatusSlug(a) === 'urgent').length;
  const adoptedAnimals = animals.filter((a: any) => getStatusSlug(a) === 'adopted').length;

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

  const getAnimalType = (animal: any): string => animal.animalTypes?.nodes?.[0]?.name || '강아지';
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
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground">보호소 운영 현황을 한눈에 확인하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/animals/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              동물 등록
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. 동물 현황 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 동물 수"
          value={totalAnimals}
          icon={<PawPrint className="h-5 w-5" />}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="입양 가능"
          value={availableAnimals}
          icon={<Heart className="h-5 w-5" />}
          colorClass="bg-emerald-100 text-emerald-600"
          subtitle="새 가족을 기다리는 중"
        />
        <StatCard
          title="입양 완료"
          value={adoptedAnimals}
          icon={<CheckCircle className="h-5 w-5" />}
          colorClass="bg-violet-100 text-violet-600"
          subtitle="새 가족을 만났어요"
        />
        <StatCard
          title="긴급 보호"
          value={urgentAnimals}
          icon={<AlertTriangle className="h-5 w-5" />}
          colorClass="bg-red-100 text-red-600"
          subtitle="긴급 입양 필요"
        />
      </div>

      {/* 2. GA4 분석 섹션 */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* 주간 방문자 추이 (넓게) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">주간 방문자 추이</CardTitle>
                <CardDescription>최근 7일간 방문자 및 페이지뷰</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                Mock Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={visitorsChartConfig} className="h-[260px] w-full">
              <BarChart data={MOCK_WEEKLY_VISITORS} barGap={4}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="visitors"
                  fill="var(--color-visitors)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="pageViews"
                  fill="var(--color-pageViews)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* GA 요약 지표 (좁게) */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">트래픽 요약</CardTitle>
            <CardDescription>전주 대비 변화율</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <GaSummaryCard
              title="총 방문자"
              value={MOCK_GA_SUMMARY.totalVisitors.toLocaleString()}
              change={MOCK_GA_SUMMARY.visitorChange}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <GaSummaryCard
              title="페이지뷰"
              value={MOCK_GA_SUMMARY.totalPageViews.toLocaleString()}
              change={MOCK_GA_SUMMARY.pageViewChange}
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            <GaSummaryCard
              title="평균 세션 시간"
              value={MOCK_GA_SUMMARY.avgSessionDuration}
              change={MOCK_GA_SUMMARY.durationChange}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <GaSummaryCard
              title="이탈률"
              value={`${MOCK_GA_SUMMARY.bounceRate}%`}
              change={MOCK_GA_SUMMARY.bounceChange}
              icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. 인기 페이지 + 유입 경로 */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* 인기 페이지 */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">인기 페이지 TOP 5</CardTitle>
                <CardDescription>가장 많이 조회된 페이지</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                Mock Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {MOCK_TOP_PAGES.map((page, i) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-semibold tabular-nums">
                        {page.views.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">조회수</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium tabular-nums text-muted-foreground">
                        {page.avgTime}
                      </p>
                      <p className="text-[10px] text-muted-foreground">체류시간</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 유입 경로 */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">유입 경로</CardTitle>
            <CardDescription>방문자 유입 채널 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trafficChartConfig} className="h-[180px] w-full">
              <PieChart>
                <Pie
                  data={MOCK_TRAFFIC_SOURCES}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  nameKey="source"
                  strokeWidth={2}
                  stroke="var(--color-background)"
                >
                  {MOCK_TRAFFIC_SOURCES.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <span>
                          {name}: <strong>{value}%</strong>
                        </span>
                      )}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {MOCK_TRAFFIC_SOURCES.map((source) => (
                <div key={source.source} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-muted-foreground truncate">{source.source}</span>
                  <span className="ml-auto font-medium tabular-nums">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. 운영 현황 카드 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">입양 후기</p>
                <p className="text-3xl font-bold tracking-tight">{totalReviews}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">활동/프로젝트</p>
                <p className="text-3xl font-bold tracking-tight">{totalActivities}</p>
              </div>
              <div className="rounded-xl p-3 bg-indigo-100 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">후원/봉사 게시글</p>
                <p className="text-3xl font-bold tracking-tight">{totalSupportPosts}</p>
              </div>
              <div className="rounded-xl p-3 bg-teal-100 text-teal-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. 최근 등록 + 빠른 액션 */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* 최근 등록 동물 */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">최근 등록 동물</CardTitle>
              <CardDescription>최근에 등록된 동물 목록</CardDescription>
            </div>
            <Link href="/admin/animals">
              <Button variant="ghost" size="sm">
                전체 보기
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentAnimals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">등록된 동물이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {recentAnimals.map((animal: any) => {
                  const status = getAnimalStatus(animal);
                  return (
                    <Link
                      key={animal.databaseId}
                      href={`/admin/animals/${animal.slug}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                          {animal.featuredImage?.node?.sourceUrl ? (
                            <img
                              src={animal.featuredImage.node.sourceUrl}
                              alt={animal.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <PawPrint className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {animal.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getAnimalType(animal)} ·{' '}
                            {animal.date
                              ? new Date(animal.date).toLocaleDateString('ko-KR')
                              : '-'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          status.slug === 'urgent'
                            ? 'destructive'
                            : status.slug === 'adopted'
                            ? 'secondary'
                            : 'default'
                        }
                        className="text-[11px]"
                      >
                        {status.name}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 후기 + 빠른 액션 */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">최근 입양 후기</CardTitle>
                <CardDescription>최근 등록된 후기</CardDescription>
              </div>
              <Link href="/admin/reviews">
                <Button variant="ghost" size="sm">
                  전체 보기
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">등록된 후기가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {recentReviews.slice(0, 4).map((review: any) => (
                    <Link
                      key={review.databaseId}
                      href={`/admin/reviews/${review.databaseId}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted overflow-hidden shrink-0">
                        {review.featuredImage?.node?.sourceUrl ? (
                          <img
                            src={review.featuredImage.node.sourceUrl}
                            alt={review.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {review.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.reviewFields?.animalName || '-'}
                        </p>
                      </div>
                      {review.reviewFields?.isPinned && (
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          고정
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">빠른 액션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/admin/animals/new">
                  <Button className="w-full justify-start" size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    동물 등록
                  </Button>
                </Link>
                <Link href="/admin/reviews/new">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    후기 등록
                  </Button>
                </Link>
                <Link href="/admin/activities/new">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    활동 등록
                  </Button>
                </Link>
                <Link href="/admin/support/new">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    게시글 등록
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
