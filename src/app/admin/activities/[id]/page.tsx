'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { RichEditor } from '@/components/admin/ui/RichEditor';
import { GET_ACTIVITIES } from '@/lib/queries';
import { GetActivitiesData } from '@/types/graphql';
import { UPDATE_ACTIVITY, UpdateActivityData, UpdateActivityVariables } from '@/lib/mutations';

const activityCategoryOptions = [
  { value: 'protection', label: '보호' },
  { value: 'training', label: '교정' },
  { value: 'matching', label: '매칭' },
  { value: 'campaign', label: '캠페인' },
  { value: 'education', label: '교육' },
];

const categoryLabelToValue: Record<string, string> = {
  '보호': 'protection',
  '교정': 'training',
  '매칭': 'matching',
  '캠페인': 'campaign',
  '교육': 'education',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditActivityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const activitySlug = resolvedParams.id;

  const { data, loading } = useQuery<GetActivitiesData>(GET_ACTIVITIES);
  const [updateActivity] = useMutation<UpdateActivityData, UpdateActivityVariables>(UPDATE_ACTIVITY, {
    refetchQueries: ['GetActivities'],
  });

  const activity = data?.projects?.nodes?.find((item) => item.slug === activitySlug);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [activityType, setActivityType] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [pintoimpact, setPintoimpact] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setExcerpt(activity.excerpt || '');
      setContent(activity.content || '');
      setFeaturedImage(activity.featuredImage?.node?.sourceUrl || '');
      setActivityType(activity.activityFields?.type || '');
      setImpactSummary(activity.activityFields?.impactSummary || '');
      setPintoimpact(Boolean(activity.activityFields?.pintoimpact));
      const mappedCategories =
        activity.projectCategories?.nodes?.map((category) => category.slug || categoryLabelToValue[category.name]) || [];
      setSelectedCategories(mappedCategories.filter(Boolean));
    }
  }, [activity]);

  useEffect(() => {
    if (!loading && !activity) {
      toast.error('활동을 찾을 수 없습니다.');
      router.push('/admin/activities');
    }
  }, [activity, loading, router]);

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activity) {
      return;
    }
    
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!activityType.trim()) {
      toast.error('활동 타입을 입력해주세요.');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('카테고리를 최소 하나 이상 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateActivity({
        variables: {
          id: activity.databaseId.toString(),
          title,
          excerpt,
          content,
          status: 'PUBLISH',
          featuredImageId: undefined,
          activityFields: {
            type: activityType,
            impactSummary,
            pintoimpact,
          },
          projectCategories: selectedCategories,
        },
      });

      toast.success('활동이 수정되었습니다.');
      router.push('/admin/activities');
    } catch (error) {
      console.error('Update activity error:', error);
      toast.error('활동 수정 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  if (loading || !activity) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">활동 편집</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">대표 이미지</p>
            <ImageUpload value={featuredImage} onChange={setFeaturedImage} previewHeight={240} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목 <span className="text-red-500">*</span></Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="활동 제목을 입력하세요" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">요약</Label>
            <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="활동 요약을 입력하세요" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityType">활동 타입 <span className="text-red-500">*</span></Label>
            <Input id="activityType" value={activityType} onChange={(e) => setActivityType(e.target.value)} placeholder="예: 캠페인, 모집, 활동, 정보" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactSummary">임팩트 요약</Label>
            <Textarea id="impactSummary" value={impactSummary} onChange={(e) => setImpactSummary(e.target.value)} placeholder="이 활동의 임팩트를 요약해주세요" rows={3} />
          </div>

          <div className="space-y-2">
            <Label>카테고리 <span className="text-red-500">*</span></Label>
            <div className="flex flex-wrap gap-4">
              {activityCategoryOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${option.value}`}
                    checked={selectedCategories.includes(option.value)}
                    onCheckedChange={(checked) => handleCategoryChange(option.value, checked as boolean)}
                  />
                  <Label htmlFor={`category-${option.value}`} className="cursor-pointer font-normal">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="pintoimpact">핀투임팩트 여부</Label>
              <span className="text-xs text-slate-500">이 활동을 핀투임팩트 프로젝트로 표시합니다.</span>
            </div>
            <Checkbox
              id="pintoimpact"
              checked={pintoimpact}
              onCheckedChange={(checked) => setPintoimpact(checked as boolean)}
            />
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">본문</p>
            <RichEditor value={content} onChange={setContent} placeholder="활동 내용을 입력하세요..." minHeight="400px" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>취소</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '수정 중...' : '수정하기'}</Button>
        </div>
      </form>
    </div>
  );
}
