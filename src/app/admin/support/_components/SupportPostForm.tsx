'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { RichEditor } from '@/components/admin/ui/RichEditor';
import { SupportPostInput, SupportPostListItem } from '@/types/admin';
import { toast } from 'sonner';
interface SupportPostFormProps {
  initialData?: SupportPostListItem;
  onSubmit: (data: SupportPostInput) => void;
  isSubmitting?: boolean;
}

const supportCategoryOptions = [
  { value: 'notice', label: '공지' },
  { value: 'volunteer', label: '봉사' },
  { value: 'news', label: '소식' },
  { value: 'support', label: '후원' },
];

export default function SupportPostForm({ initialData, onSubmit, isSubmitting = false }: SupportPostFormProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isNotice, setIsNotice] = useState(initialData?.isNotice || false);
  const [attachedFile, setAttachedFile] = useState(initialData?.attachedFile || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.supportCategorySlugs || []
  );

  // If initialData has category string but no slugs (legacy data), try to map it
  useEffect(() => {
    if (initialData && (!initialData.supportCategorySlugs || initialData.supportCategorySlugs.length === 0)) {
      const found = supportCategoryOptions.find(opt => opt.label === initialData.category);
      if (found) {
        setSelectedCategories([found.value]);
      }
    }
  }, [initialData]);

  const handleCategoryChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('카테고리를 최소 하나 이상 선택해주세요.');
      return;
    }

    const formData: SupportPostInput = {
      title,
      content,
      supportMeta: {
        isNotice,
        viewCount: initialData?.viewCount || 0,
        attachedFile: attachedFile || undefined,
      },
      supportCategorySlugs: selectedCategories,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">제목 <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="게시글 제목을 입력하세요"
            required
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>카테고리</Label>
          <div className="flex flex-wrap gap-4">
            {supportCategoryOptions.map((option) => (
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

        {/* Notice Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="isNotice">공지사항 설정</Label>
            <span className="text-xs text-slate-500">이 게시글을 공지사항으로 등록합니다.</span>
          </div>
          <Checkbox
            id="isNotice"
            checked={isNotice}
            onCheckedChange={(checked) => setIsNotice(checked as boolean)}
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">본문</label>
          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="내용을 입력하세요..."
            minHeight="400px"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">첨부파일</label>
          <ImageUpload
            value={attachedFile}
            onChange={setAttachedFile}
            accept="*/*" // Allow all files as per requirement "문서도 가능하도록"
            maxSize={10}
          />
          <p className="mt-1 text-xs text-slate-500">이미지 또는 문서를 업로드할 수 있습니다.</p>
        </div>

        {/* View Count (Read Only for Edit) */}
        {initialData && (
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center text-sm text-slate-500">
              <span className="font-medium mr-2">조회수:</span>
              <span>{initialData.viewCount.toLocaleString()}회</span>
            </div>
          </div>
        )}
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
          {isSubmitting ? '처리 중...' : (initialData ? '수정하기' : '등록하기')}
        </Button>
      </div>
    </form>
  );
}
