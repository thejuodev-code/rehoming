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
    onError: (error) => {
      toast.error(`등록 실패: ${error.message}`);
      setIsSubmitting(false);
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SupportPostInput) => {
    setIsSubmitting(true);
    try {
      // 1단계: GraphQL mutation (표준 WP 필드 + 택소노미)
      const result = await createSupportPost({
        variables: {
          title: data.title,
          content: data.content,
          status: 'PUBLISH',
          supportCategories: {
            nodes: data.supportCategorySlugs.map((slug) => ({ slug })),
          },
        },
      });

      const newPostId = result.data?.createSupportPost?.supportPost?.databaseId;
      if (newPostId) {
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
        const token = (await import('@/lib/auth')).getAuthToken() || '';

        // 2단계: ACF 필드 저장 (AJAX)
        const fieldsForm = new FormData();
        fieldsForm.append('action', 'rehoming_save_support_fields');
        fieldsForm.append('token', token);
        fieldsForm.append('post_id', String(newPostId));
        fieldsForm.append('isNotice', data.supportMeta.isNotice ? 'true' : 'false');
        fieldsForm.append('viewCount', '0');
        if (data.supportMeta.attachedFile) {
          fieldsForm.append('attachedFile', data.supportMeta.attachedFile);
        }
        await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });
      }

      toast.success('게시글이 등록되었습니다.');
      router.push('/admin/support');
    } catch (error) {
      console.error('Failed to create post:', error);
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
