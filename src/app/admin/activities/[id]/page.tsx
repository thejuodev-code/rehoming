'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  { value: 'education', label: '교육' },
  { value: 'rescue', label: '구조' },
  { value: 'medical', label: '의료' },
  { value: 'campaign', label: '캠페인' },
  { value: 'partnership', label: '파트너쉽' },
  { value: 'donation', label: '후원' },
];

const categoryLabelToValue: Record<string, string> = {
  '교육': 'education',
  '구조': 'rescue',
  '의료': 'medical',
  '캠페인': 'campaign',
  '파트너쉽': 'partnership',
  '후원': 'donation',
};

interface PageProps {
  params: { id: string };
}

export default function EditActivityPage({ params }: PageProps) {
  const router = useRouter();
  const activitySlug = decodeURIComponent(params.id);

  const { data, loading } = useQuery<GetActivitiesData>(GET_ACTIVITIES, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [updateActivity] = useMutation<UpdateActivityData, UpdateActivityVariables>(UPDATE_ACTIVITY, {
    refetchQueries: ['GetActivities'],
    onError: (error) => {
      toast.error(`수정 실패: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const activity = data?.projects?.nodes?.find((item) => item.slug === activitySlug);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState<number | undefined>();
  const [impactSummary, setImpactSummary] = useState('');
  const [pintoimpact, setPintoimpact] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setExcerpt(activity.excerpt || '');
      setContent(activity.content || '');
      setFeaturedImageUrl(activity.featuredImage?.node?.sourceUrl || '');
      setImpactSummary(activity.activityFields?.impactSummary || '');
      setPintoimpact(Boolean(activity.activityFields?.pintoimpact));
      const mappedCategories =
        activity.projectCategories?.nodes?.map((category) => category.slug || categoryLabelToValue[category.name]) || [];
      setSelectedCategories(mappedCategories.filter(Boolean));
    }
  }, [activity]);

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activity) return;

    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('카테고리를 최소 하나 이상 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1단계: GraphQL mutation (표준 WP 필드만)
      await updateActivity({
        variables: {
          id: activity.databaseId.toString(),
          title,
          content,
          excerpt,
          status: 'PUBLISH',
          projectCategories: {
            nodes: selectedCategories.map((slug) => ({ slug })),
          },
        },
      });

      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
      const token = (await import('@/lib/auth')).getAuthToken() || '';

      // 2단계: ACF 필드 저장 (AJAX)
      const fieldsForm = new FormData();
      fieldsForm.append('action', 'rehoming_save_activity_fields');
      fieldsForm.append('token', token);
      fieldsForm.append('post_id', String(activity.databaseId));
      fieldsForm.append('impactSummary', impactSummary);
      fieldsForm.append('pintoimpact', pintoimpact ? 'true' : 'false');
      await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });

      // 3단계: 썸네일 연결 (AJAX) - 새로 업로드한 경우만
      if (featuredImageId) {
        const thumbForm = new FormData();
        thumbForm.append('action', 'rehoming_set_thumbnail');
        thumbForm.append('token', token);
        thumbForm.append('post_id', String(activity.databaseId));
        thumbForm.append('attachment_id', String(featuredImageId));
        await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: thumbForm });
      }

      toast.success('활동이 수정되었습니다.');
      router.push('/admin/activities');
    } catch (error) {
      console.error('Update activity error:', error);
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
            <ImageUpload
              value={featuredImageUrl}
              onChange={setFeaturedImageUrl}
              onUploadComplete={(id, url) => {
                setFeaturedImageId(id);
                setFeaturedImageUrl(url);
              }}
              previewHeight={240}
            />
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
