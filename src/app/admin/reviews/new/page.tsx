'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { CREATE_REVIEW, CreateReviewData, CreateReviewVariables } from '@/lib/mutations';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { RichEditor } from '@/components/admin/ui/RichEditor';

export default function NewReviewPage() {
  const router = useRouter();
  const [createReview] = useMutation<CreateReviewData, CreateReviewVariables>(CREATE_REVIEW, {
    refetchQueries: ['GetReviews'],
  });

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    authorName: '',
    animalName: '',
    animalType: '강아지' as '강아지' | '고양이' | '기타',
    adoptionDate: '',
    quote: '',
    isPinned: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 핸들러
  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, featuredImage: url }));
  };

  // 본문 에디터 핸들러
  const handleContentChange = (html: string) => {
    setFormData((prev) => ({ ...prev, content: html }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!formData.authorName.trim()) {
      toast.error('작성자명을 입력해주세요.');
      return;
    }
    if (!formData.animalName.trim()) {
      toast.error('동물 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createReview({
        variables: {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          status: 'PUBLISH',
          featuredImageId: undefined,
          reviewFields: {
            authorName: formData.authorName,
            animalName: formData.animalName,
            animalType: formData.animalType,
            adoptionDate: formData.adoptionDate,
            quote: formData.quote,
            isPinned: formData.isPinned,
          },
        },
      });

      toast.success('입양 후기가 등록되었습니다.');
      router.push('/admin/reviews');
    } catch (error) {
      toast.error('등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소
  const handleCancel = () => {
    router.push('/admin/reviews');
  };

  // 동물 타입 옵션
  const animalTypeOptions = [
    { value: '강아지', label: '강아지' },
    { value: '고양이', label: '고양이' },
    { value: '기타', label: '기타' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">새 입양 후기 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 대표 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle>대표 이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={formData.featuredImage}
              onChange={handleImageChange}
              previewWidth={400}
              previewHeight={250}
            />
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="후기 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">요약</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="후기 요약을 입력하세요 (목록에 표시됨)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* 작성자 및 동물 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>작성자 및 동물 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="authorName">작성자명 <span className="text-red-500">*</span></Label>
                <Input
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  placeholder="작성자명을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="animalName">동물 이름 <span className="text-red-500">*</span></Label>
                <Input
                  id="animalName"
                  name="animalName"
                  value={formData.animalName}
                  onChange={handleInputChange}
                  placeholder="입양한 동물 이름을 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="animalType">동물 타입</Label>
                <Select
                  value={formData.animalType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      animalType: value as '강아지' | '고양이' | '기타',
                    }))
                  }
                >
                  <SelectTrigger id="animalType">
                    <SelectValue placeholder="동물 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adoptionDate">입양일</Label>
                <Input
                  id="adoptionDate"
                  name="adoptionDate"
                  type="date"
                  value={formData.adoptionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">핵심 문구</Label>
              <Input
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleInputChange}
                placeholder="강조하고 싶은 문구를 입력하세요"
              />
            </div>
          </CardContent>
        </Card>

        {/* 본문 */}
        <Card>
          <CardHeader>
            <CardTitle>본문</CardTitle>
          </CardHeader>
          <CardContent>
            <RichEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="입양 후기 내용을 입력하세요..."
              minHeight="300px"
            />
          </CardContent>
        </Card>

        {/* 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>설정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isPinned"
                checked={formData.isPinned}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPinned: checked as boolean }))}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="isPinned" className="cursor-pointer">상단 고정</Label>
                <p className="text-xs text-slate-500">
                  상단 고정 시 목록 최상단에 표시됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}
