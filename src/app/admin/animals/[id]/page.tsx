'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ANIMAL_BY_SLUG, GET_ANIMAL_TAXONOMIES } from '@/lib/queries';
import { UPDATE_ANIMAL, DELETE_ANIMAL } from '@/lib/mutations';
import { GetAnimalBySlugData, GetAnimalTaxonomiesData } from '@/types/graphql';
import { UpdateAnimalData, UpdateAnimalVariables, DeleteAnimalData, DeleteAnimalVariables } from '@/lib/mutations';
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
import { Loader2 } from 'lucide-react';
import { animalStatusOptions, animalTypeOptions, genderOptions } from '@/lib/admin-options';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAnimalPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  // GraphQL로 동물 데이터 가져오기
  const { data, loading, error } = useQuery<GetAnimalBySlugData>(GET_ANIMAL_BY_SLUG, {
    variables: { id },
    skip: !id,
  });
  const { data: taxonomyData } = useQuery<GetAnimalTaxonomiesData>(GET_ANIMAL_TAXONOMIES);
  
  // Update mutation
  const [updateAnimal, { loading: isUpdating }] = useMutation<UpdateAnimalData, UpdateAnimalVariables>(UPDATE_ANIMAL, {
    refetchQueries: ['GetAdminAnimals', 'GetAnimalBySlug'],
    onCompleted: () => {
      toast.success('동물 정보가 수정되었습니다.');
      router.push('/admin/animals');
    },
    onError: (error) => {
      toast.error(`수정 실패: ${error.message}`);
      setIsSubmitting(false);
    }
  });
  
  // Delete mutation
  const [deleteAnimal, { loading: isDeleting }] = useMutation<DeleteAnimalData, DeleteAnimalVariables>(DELETE_ANIMAL, {
    refetchQueries: ['GetAdminAnimals'],
    onCompleted: () => {
      toast.success('동물 정보가 삭제되었습니다.');
      router.push('/admin/animals');
    },
    onError: (error) => {
      toast.error(`삭제 실패: ${error.message}`);
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

  // 기존 데이터 로드
  useEffect(() => {
    if (data?.animal) {
      const animal = data.animal;
      
      // 타입 매핑
      const typeSlugs = animal.animalTypes?.nodes?.map(n => n.slug) || [];
      const statusSlug = animal.animalStatuses?.nodes?.[0]?.slug || 'available';
      const gender = animal.animalFields?.gender || '미상';
      
      setFormData({
        title: animal.title,
        excerpt: animal.excerpt?.replace(/<[^>]*>/g, '') || '',
        content: animal.content || '',
        featuredImage: animal.featuredImage?.node?.sourceUrl || '',
        animalFields: {
          age: animal.animalFields?.age || '',
          breed: animal.animalFields?.breed || '',
          gender: gender as '남아' | '여아' | '미상',
          weight: animal.animalFields?.weight || '',
          rescueDate: '',
          rescueLocation: '',
          personality: animal.animalFields?.personality || '',
          medicalHistory: animal.animalFields?.medicalHistory || '',
          hashtags: animal.animalFields?.hashtags || '',
          image: animal.animalFields?.image?.node?.sourceUrl || '',
        },
        animalTypeSlugs: typeSlugs,
        animalStatusSlug: statusSlug,
      });
    }
  }, [data]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error('동물 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/admin/animals');
    }
  }, [error, router]);

  // 필드 변경 핸들러
  const handleChange = (field: keyof AnimalInput, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!data?.animal) {
      return;
    }

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

      await updateAnimal({
        variables: {
          id: data.animal.databaseId.toString(),
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
      console.error('Update animal error:', error);
      setIsSubmitting(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!data?.animal) {
      return;
    }

    if (!confirm('정말로 이 동물 정보를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deleteAnimal({
        variables: { id: data.animal.databaseId.toString() }
      });
    } catch (error) {
      console.error('Delete animal error:', error);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data?.animal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-slate-600">동물 정보를 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => router.push('/admin/animals')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">동물 정보 수정</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/admin/animals')}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 왼쪽: 이미지 섹션 */}
        <div className="space-y-6">
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
