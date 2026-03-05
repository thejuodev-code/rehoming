'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { RichEditor } from '@/components/admin/ui/RichEditor';
import { CREATE_ACTIVITY, CreateActivityData, CreateActivityVariables } from '@/lib/mutations';

const activityCategoryOptions = [
  { value: 'education', label: '교육' },
  { value: 'rescue', label: '구조' },
  { value: 'medical', label: '의료' },
  { value: 'campaign', label: '캠페인' },
  { value: 'partnership', label: '파트너쉽' },
  { value: 'donation', label: '후원' },
];

export default function NewActivityPage() {
  const router = useRouter();
  const [createActivity] = useMutation<CreateActivityData, CreateActivityVariables>(CREATE_ACTIVITY, {
    refetchQueries: ['GetActivities'],
    onError: (error) => {
      toast.error(`등록 실패: ${error.message}`);
      setIsSubmitting(false);
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImageId, setFeaturedImageId] = useState<number | undefined>();
  const [impactSummary, setImpactSummary] = useState('');
  const [pintoimpact, setPintoimpact] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const result = await createActivity({
        variables: {
          title,
          content,
          excerpt,
          status: 'PUBLISH',
          projectCategories: {
            nodes: selectedCategories.map((slug) => ({ slug })),
          },
        },
      });

      const newPostId = result.data?.createProject?.project?.databaseId;
      if (newPostId) {
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
        const token = (await import('@/lib/auth')).getAuthToken() || '';

        // 2단계: ACF 필드 저장 (AJAX)
        const fieldsForm = new FormData();
        fieldsForm.append('action', 'rehoming_save_activity_fields');
        fieldsForm.append('token', token);
        fieldsForm.append('post_id', String(newPostId));
        fieldsForm.append('impactSummary', impactSummary);
        fieldsForm.append('pintoimpact', pintoimpact ? 'true' : 'false');
        await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });

        // 3단계: 썸네일 연결 (AJAX)
        if (featuredImageId) {
          const thumbForm = new FormData();
          thumbForm.append('action', 'rehoming_set_thumbnail');
          thumbForm.append('token', token);
          thumbForm.append('post_id', String(newPostId));
          thumbForm.append('attachment_id', String(featuredImageId));
          await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: thumbForm });
        }

        // 4단계: 카테고리 연결 (wp_set_object_terms via AJAX or taxonomy already handled)
        // projectCategories는 GraphQL에서 처리되지 않으므로 별도 처리 필요할 수 있음
      }

      toast.success('활동이 등록되었습니다.');
      router.push('/admin/activities');
    } catch (error) {
      console.error('Create activity error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">새 활동 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
          {/* Featured Image */}
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
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="활동 제목을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">요약</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="활동 요약을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactSummary">임팩트 요약</Label>
            <Textarea
              id="impactSummary"
              value={impactSummary}
              onChange={(e) => setImpactSummary(e.target.value)}
              placeholder="이 활동의 임팩트를 요약해주세요"
              rows={3}
            />
          </div>

          {/* Categories */}
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
                  <Label htmlFor={`category-${option.value}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pintoimpact Toggle */}
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

          {/* Content */}
          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">본문</p>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="활동 내용을 입력하세요..."
              minHeight="400px"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
