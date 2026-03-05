'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_REVIEWS } from '@/lib/queries';
import { GetReviewsData } from '@/types/graphql';
import { UPDATE_REVIEW, UpdateReviewData, UpdateReviewVariables } from '@/lib/mutations';
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

interface PageProps {
  params: { id: string };
}

export default function EditReviewPage({ params }: PageProps) {
  const router = useRouter();
  const reviewSlug = decodeURIComponent(params.id);
  const { data, loading: isQueryLoading } = useQuery<GetReviewsData>(GET_REVIEWS, {
    variables: { first: 100 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [updateReview] = useMutation<UpdateReviewData, UpdateReviewVariables>(UPDATE_REVIEW, {
    refetchQueries: ['GetReviews'],
    onError: (error) => {
      toast.error(`수정 실패: ${error.message}`);
      setIsSubmitting(false);
    }
  });
  const existingReview = data?.reviews?.nodes?.find((review) => review.slug === reviewSlug);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    featuredImageId: undefined as number | undefined,
    authorName: '',
    animalName: '',
    animalType: '강아지' as '강아지' | '고양이' | '기타',
    adoptionDate: '',
    quote: '',
    isPinned: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (existingReview) {
      setFormData({
        title: existingReview.title,
        excerpt: existingReview.excerpt || '',
        content: existingReview.content || '',
        featuredImageUrl: existingReview.featuredImage?.node?.sourceUrl || '',
        featuredImageId: undefined,
        authorName: existingReview.reviewFields?.authorName || '',
        animalName: existingReview.reviewFields?.animalName || '',
        animalType: (existingReview.reviewFields?.animalType || '강아지') as '강아지' | '고양이' | '기타',
        adoptionDate: existingReview.reviewFields?.adoptionDate || '',
        quote: existingReview.reviewFields?.quote || '',
        isPinned: Boolean(existingReview.reviewFields?.isPinned),
      });
      setIsLoading(false);
    } else if (!isQueryLoading) {
      setIsLoading(false);
    }
  }, [existingReview, isQueryLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (!existingReview) return;

    setIsSubmitting(true);

    try {
      // 1단계: GraphQL mutation (표준 WP 필드만)
      await updateReview({
        variables: {
          id: existingReview.databaseId.toString(),
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          status: 'PUBLISH',
        },
      });

      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
      const token = (await import('@/lib/auth')).getAuthToken() || '';

      // 2단계: ACF 필드 저장 (AJAX)
      const fieldsForm = new FormData();
      fieldsForm.append('action', 'rehoming_save_review_fields');
      fieldsForm.append('token', token);
      fieldsForm.append('post_id', String(existingReview.databaseId));
      fieldsForm.append('authorName', formData.authorName);
      fieldsForm.append('animalName', formData.animalName);
      fieldsForm.append('animalType', formData.animalType);
      fieldsForm.append('adoptionDate', formData.adoptionDate);
      fieldsForm.append('quote', formData.quote);
      fieldsForm.append('isPinned', formData.isPinned ? 'true' : 'false');
      await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });

      // 3단계: 썸네일 연결 (AJAX) - 새로 업로드한 경우만
      if (formData.featuredImageId) {
        const thumbForm = new FormData();
        thumbForm.append('action', 'rehoming_set_thumbnail');
        thumbForm.append('token', token);
        thumbForm.append('post_id', String(existingReview.databaseId));
        thumbForm.append('attachment_id', String(formData.featuredImageId));
        await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: thumbForm });
      }

      toast.success('입양 후기가 수정되었습니다.');
      router.push('/admin/reviews');
    } catch (error) {
      console.error('Update review error:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/reviews');
  };

  const animalTypeOptions = [
    { value: '강아지', label: '강아지' },
    { value: '고양이', label: '고양이' },
    { value: '기타', label: '기타' },
  ];

  if (isLoading || isQueryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">입양 후기 편집</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">로딩 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!existingReview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">입양 후기 편집</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">존재하지 않는 후기입니다.</p>
            <Link href="/admin/reviews">
              <Button variant="outline" className="mt-4">
                목록으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">입양 후기 편집</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 대표 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle>대표 이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={formData.featuredImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, featuredImageUrl: url }))}
              onUploadComplete={(id, url) => {
                setFormData((prev) => ({ ...prev, featuredImageId: id, featuredImageUrl: url }));
              }}
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
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
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
