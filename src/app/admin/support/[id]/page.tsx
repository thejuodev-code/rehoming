'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SUPPORT_POST_BY_SLUG } from '@/lib/queries';
import SupportPostForm from '../_components/SupportPostForm';
import { SupportPostInput, SupportPostListItem } from '@/types/admin';
import { toast } from 'sonner';
import { GetSupportPostBySlugResponse } from '@/types/support';
import { UPDATE_SUPPORT_POST, UpdateSupportPostData, UpdateSupportPostVariables } from '@/lib/mutations';

export default function EditSupportPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = decodeURIComponent(String(params.id || ''));
  const { data, loading } = useQuery<GetSupportPostBySlugResponse>(GET_SUPPORT_POST_BY_SLUG, {
    variables: { id: slug },
    skip: !slug,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const [updateSupportPost] = useMutation<UpdateSupportPostData, UpdateSupportPostVariables>(UPDATE_SUPPORT_POST, {
    refetchQueries: ['GetSupportPosts'],
    onError: (error) => {
      toast.error(`수정 실패: ${error.message}`);
      setIsSubmitting(false);
    },
  });
  const [post, setPost] = useState<SupportPostListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const source = data?.supportPost;
    if (!source) {
      return;
    }

    setPost({
      id: source.databaseId,
      title: source.title,
      category: source.supportCategories?.nodes?.[0]?.name || '기타',
      supportCategorySlugs: source.supportCategories?.nodes?.map((category) => category.slug) || [],
      content: source.content || '',
      attachedFile: source.supportMeta?.attachedFile?.node?.sourceUrl,
      isNotice: Boolean(source.supportMeta?.isNotice),
      viewCount: source.supportMeta?.viewCount || 0,
      authorName: source.author?.node?.name || '관리자',
      createdAt: source.date ? new Date(source.date).toLocaleDateString('ko-KR') : '-',
    });
  }, [data]);

  useEffect(() => {
    if (!loading && !data?.supportPost) {
      toast.error('게시글을 찾을 수 없습니다.');
      router.push('/admin/support');
    }
  }, [loading, data, router]);

  const handleSubmit = async (formData: SupportPostInput) => {
    if (!post) return;

    setIsSubmitting(true);
    try {
      // 1단계: GraphQL mutation (표준 WP 필드 + 택소노미)
      await updateSupportPost({
        variables: {
          id: post.id.toString(),
          title: formData.title,
          content: formData.content,
          status: 'PUBLISH',
          supportCategories: {
            nodes: formData.supportCategorySlugs.map((slug) => ({ slug })),
          },
        },
      });

      // 2단계: ACF 필드 저장 (AJAX)
      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
      const token = (await import('@/lib/auth')).getAuthToken() || '';

      const fieldsForm = new FormData();
      fieldsForm.append('action', 'rehoming_save_support_fields');
      fieldsForm.append('token', token);
      fieldsForm.append('post_id', String(post.id));
      fieldsForm.append('isNotice', formData.supportMeta.isNotice ? 'true' : 'false');
      fieldsForm.append('viewCount', String(post.viewCount));
      if (formData.supportMeta.attachedFile) {
        fieldsForm.append('attachedFile', formData.supportMeta.attachedFile);
      }
      await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, { method: 'POST', body: fieldsForm });

      toast.success('게시글이 수정되었습니다.');
      router.push('/admin/support');
    } catch (error) {
      console.error('Failed to update post:', error);
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">게시글 수정</h1>
      </div>
      <SupportPostForm
        initialData={post}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
