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
  const slug = String(params.id || '');
  const { data, loading } = useQuery<GetSupportPostBySlugResponse>(GET_SUPPORT_POST_BY_SLUG, {
    variables: { id: slug },
    skip: !slug,
  });
  const [updateSupportPost] = useMutation<UpdateSupportPostData, UpdateSupportPostVariables>(UPDATE_SUPPORT_POST, {
    refetchQueries: ['GetSupportPosts'],
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

  const handleSubmit = async (data: SupportPostInput) => {
    if (!post) return;

    setIsSubmitting(true);
    try {
      await updateSupportPost({
        variables: {
          id: post.id.toString(),
        title: data.title,
        content: data.content,
          status: 'PUBLISH',
          supportMeta: {
            isNotice: data.supportMeta.isNotice,
            viewCount: post.viewCount,
            attachedFile: data.supportMeta.attachedFile,
          },
          supportCategories: data.supportCategorySlugs,
        },
      });

      toast.success('게시글이 수정되었습니다.');
      router.push('/admin/support');
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('게시글 수정에 실패했습니다.');
    } finally {
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
