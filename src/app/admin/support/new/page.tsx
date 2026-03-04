'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import SupportPostForm from '../_components/SupportPostForm';
import { SupportPostInput } from '@/types/admin';
import { toast } from 'sonner';
import { CREATE_SUPPORT_POST, CreateSupportPostData, CreateSupportPostVariables } from '@/lib/mutations';

export default function NewSupportPostPage() {
  const router = useRouter();
  const [createSupportPost] = useMutation<CreateSupportPostData, CreateSupportPostVariables>(CREATE_SUPPORT_POST, {
    refetchQueries: ['GetSupportPosts'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SupportPostInput) => {
    setIsSubmitting(true);
    try {
      await createSupportPost({
        variables: {
        title: data.title,
        content: data.content,
          status: 'PUBLISH',
          supportMeta: {
            isNotice: data.supportMeta.isNotice,
            viewCount: data.supportMeta.viewCount,
            attachedFile: data.supportMeta.attachedFile,
          },
          supportCategories: data.supportCategorySlugs,
        },
      });
      
      toast.success('게시글이 등록되었습니다.');
      router.push('/admin/support');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">새 게시글 등록</h1>
      </div>
      <SupportPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
