'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_ANIMAL } from '@/lib/mutations';
import { CreateAnimalData, CreateAnimalVariables } from '@/lib/mutations';
import { AnimalInput } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { RichEditor } from '@/components/admin/ui/RichEditor';
import { toast } from 'sonner';
import { animalStatusOptions, animalTypeOptions, genderOptions } from '@/lib/admin-options';
import { GET_ANIMAL_TAXONOMIES } from '@/lib/queries';
import { GetAnimalTaxonomiesData } from '@/types/graphql';

// 초기 폼 상태
const initialFormState: AnimalInput = {
  title: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  animalFields: {
    age: '',
    breed: '',
    gender: '미상',
    weight: '',
    rescueDate: '',
    rescueLocation: '',
    personality: '',
    medicalHistory: '',
    hashtags: '',
    image: '',
  },
  animalTypeSlugs: [],
  animalStatusSlug: 'available',
};

// 폼 검증 에러 타입
interface FormErrors {
  title?: string;
  excerpt?: string;
  content?: string;
  animalTypeSlugs?: string;
}

const toTermInputId = (term: { id?: string; databaseId: number }): string => {
  if (term.id) {
    return term.id;
  }
  return btoa(`term:${term.databaseId}`);
};

export default function NewAnimalPage() {
  const router = useRouter();
  const { data: taxonomyData } = useQuery<GetAnimalTaxonomiesData>(GET_ANIMAL_TAXONOMIES);
  
  const [createAnimal, { loading: isCreating }] = useMutation<CreateAnimalData, CreateAnimalVariables>(CREATE_ANIMAL, {
    refetchQueries: ['GetAdminAnimals'],
    onCompleted: () => {
      toast.success('동물 정보가 등록되었습니다.');
      router.push('/admin/animals');
    },
    onError: (error) => {
      toast.error(`등록 실패: ${error.message}`);
      setIsSubmitting(false);
    }
  });
  const [formData, setFormData] = useState<AnimalInput>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeIdBySlug = new Map(
    taxonomyData?.animalTypes?.nodes?.map((item) => [item.slug, toTermInputId(item)]) || [],
  );
  const statusIdBySlug = new Map(
    taxonomyData?.animalStatuses?.nodes?.map((item) => [item.slug, toTermInputId(item)]) || [],
  );

  // 필드 변경 핸들러
  const handleChange = (field: keyof AnimalInput, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // animalFields 변경 핸들러
  const handleAnimalFieldChange = (field: keyof AnimalInput['animalFields'], value: string) => {
    setFormData(prev => ({
      ...prev,
      animalFields: { ...prev.animalFields, [field]: value }
    }));
  };

  // 동물 타입 체크박스 토글
  const handleTypeToggle = (slug: string) => {
    setFormData(prev => {
      const currentTypes = prev.animalTypeSlugs;
      const newTypes = currentTypes.includes(slug)
        ? currentTypes.filter(t => t !== slug)
        : [...currentTypes, slug];
      return { ...prev, animalTypeSlugs: newTypes };
    });
    if (errors.animalTypeSlugs) {
      setErrors(prev => ({ ...prev, animalTypeSlugs: undefined }));
    }
  };

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '이름을 입력해주세요.';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = '요약을 입력해주세요.';
    }
    if (!formData.content.trim() || formData.content === '<p></p>') {
      newErrors.content = '본문을 입력해주세요.';
    }
    if (formData.animalTypeSlugs.length === 0) {
      newErrors.animalTypeSlugs = '동물 타입을 선택해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 저장 핸들러
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const animalTypeIds = formData.animalTypeSlugs
        .map((slug) => typeIdBySlug.get(slug))
        .filter((value): value is string => Boolean(value));
      const animalStatusId = statusIdBySlug.get(formData.animalStatusSlug);

      if (!animalStatusId || animalTypeIds.length === 0) {
        toast.error('동물 타입/상태 분류 정보를 다시 불러온 뒤 저장해주세요.');
        setIsSubmitting(false);
        return;
      }

      await createAnimal({
        variables: {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          status: 'PUBLISH',
          animalTypes: {
            nodes: animalTypeIds.map((id) => ({ id })),
          },
          animalStatuses: {
            nodes: [{ id: animalStatusId }],
          },
          age: formData.animalFields.age,
          breed: formData.animalFields.breed,
          gender: formData.animalFields.gender,
          weight: formData.animalFields.weight,
          personality: formData.animalFields.personality,
          medicalHistory: formData.animalFields.medicalHistory,
          hashtags: formData.animalFields.hashtags,
        }
      });
    } catch (error) {
      console.error('Create animal error:', error);
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    router.push('/admin/animals');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">새 동물 등록</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 왼쪽: 이미지 섹션 */}
        <div className="space-y-6">
          {/* 대표 이미지 */}
          <Card>
            <CardHeader>
              <CardTitle>대표 이미지</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => handleChange('featuredImage', url)}
                previewHeight={200}
              />
            </CardContent>
          </Card>

          {/* 상세 이미지 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 이미지</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.animalFields.image}
                onChange={(url) => handleAnimalFieldChange('image', url)}
                previewHeight={200}
              />
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 폼 섹션 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보 <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">이름 <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="동물 이름을 입력하세요"
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">품종</Label>
                  <Input
                    id="breed"
                    value={formData.animalFields.breed}
                    onChange={(e) => handleAnimalFieldChange('breed', e.target.value)}
                    placeholder="예: 골든 리트리버"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="age">나이</Label>
                  <Input
                    id="age"
                    value={formData.animalFields.age}
                    onChange={(e) => handleAnimalFieldChange('age', e.target.value)}
                    placeholder="예: 2살"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    value={formData.animalFields.gender}
                    onValueChange={(value) => handleAnimalFieldChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">체중</Label>
                  <Input
                    id="weight"
                    value={formData.animalFields.weight}
                    onChange={(e) => handleAnimalFieldChange('weight', e.target.value)}
                    placeholder="예: 5kg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">요약 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="동물에 대한 간단한 소개"
                  rows={2}
                />
                {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
              </div>
            </CardContent>
          </Card>

          {/* 본문 */}
          <Card>
            <CardHeader>
              <CardTitle>본문 <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent>
              <RichEditor
                value={formData.content}
                onChange={(html) => handleChange('content', html)}
                error={errors.content}
                placeholder="동물에 대한 상세 정보를 입력하세요..."
                minHeight="300px"
              />
            </CardContent>
          </Card>

          {/* 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personality">성격</Label>
                <Textarea
                  id="personality"
                  value={formData.animalFields.personality}
                  onChange={(e) => handleAnimalFieldChange('personality', e.target.value)}
                  placeholder="동물의 성격 특성"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">의료이력</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.animalFields.medicalHistory}
                  onChange={(e) => handleAnimalFieldChange('medicalHistory', e.target.value)}
                  placeholder="백신 접종, 중성화 수술 등"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">해시태그</Label>
                <Input
                  id="hashtags"
                  value={formData.animalFields.hashtags}
                  onChange={(e) => handleAnimalFieldChange('hashtags', e.target.value)}
                  placeholder="예: #사랑스러운 #활발한"
                />
              </div>
            </CardContent>
          </Card>

          {/* 분류 */}
          <Card>
            <CardHeader>
              <CardTitle>분류 <span className="text-red-500">*</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  동물 타입 <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-4">
                  {animalTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${option.value}`}
                        checked={formData.animalTypeSlugs.includes(option.value as string)}
                        onCheckedChange={() => handleTypeToggle(option.value as string)}
                      />
                      <Label htmlFor={`type-${option.value}`} className="cursor-pointer font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.animalTypeSlugs && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.animalTypeSlugs}</p>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={formData.animalStatusSlug}
                  onValueChange={(value) => handleChange('animalStatusSlug', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {animalStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
