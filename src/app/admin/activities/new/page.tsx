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
import { ActivityInput } from '@/types/admin';
import { CREATE_ACTIVITY, CreateActivityData, CreateActivityVariables } from '@/lib/mutations';
const activityCategoryOptions = [
  { value: 'protection', label: '보호' },
  { value: 'training', label: '교정' },
  { value: 'matching', label: '매칭' },
  { value: 'campaign', label: '캠페인' },
  { value: 'education', label: '교육' },
];

export default function NewActivityPage() {
  const router = useRouter();
  const [createActivity] = useMutation<CreateActivityData, CreateActivityVariables>(CREATE_ACTIVITY, {
    refetchQueries: ['GetActivities'],
    onCompleted: () => {
      toast.success('활동이 등록되었습니다.');
      router.push('/admin/activities');
    },
    onError: (error) => {
      toast.error(`등록 실패: ${error.message}`);
      setIsSubmitting(false);
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [activityType, setActivityType] = useState('');
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
    
    // Validation
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

    const formData: ActivityInput = {
      title,
      excerpt,
      content,
      featuredImage: featuredImage || undefined,
      activityFields: {
        type: activityType,
        impactSummary,
        pintoimpact,
      },
      projectCategorySlugs: selectedCategories,
    };

    try {
      await createActivity({
        variables: {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          status: 'PUBLISH',
          featuredImageId: undefined,
          activityFields: {
            type: formData.activityFields.type,
            impactSummary: formData.activityFields.impactSummary,
            pintoimpact: formData.activityFields.pintoimpact,
          },
          projectCategories: formData.projectCategorySlugs,
        },
      });
    } catch (error) {
      console.error('Create activity error:', error);
      toast.error('등록 중 오류가 발생했습니다.');
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
          {/* Featured Image - 상단 배치 */}
          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">대표 이미지</p>
            <ImageUpload
              value={featuredImage}
              onChange={setFeaturedImage}
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
            <Label htmlFor="activityType">활동 타입 <span className="text-red-500">*</span></Label>
            <Input
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              placeholder="예: 캠페인, 모집, 활동, 정보"
              required
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
            <Label>카테고리</Label>
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
