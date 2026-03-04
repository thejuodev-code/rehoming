'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_SUPPORT_POSTS } from '@/lib/queries';
import { GetSupportPostsResponse } from '@/types/support';
import { DELETE_SUPPORT_POST, DeleteSupportPostData, DeleteSupportPostVariables } from '@/lib/mutations';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
const supportCategoryOptions = [
  { value: 'all', label: '전체 카테고리' },
  { value: '후원금 내역', label: '후원금 내역' },
  { value: '봉사 활동', label: '봉사 활동' },
  { value: '후원자 소식', label: '후원자 소식' },
  { value: '공지사항', label: '공지사항' },
  { value: '모집', label: '모집' },
  { value: '행사', label: '행사' },
  { value: '정보', label: '정보' },
  { value: '운영', label: '운영' },
  { value: '재정', label: '재정' },
  { value: '사업 계획', label: '사업 계획' },
  { value: '교육', label: '교육' },
];

const noticeOptions = [
  { value: 'all', label: '전체' },
  { value: 'true', label: '공지' },
  { value: 'false', label: '일반' },
];

export default function SupportPostListPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetSupportPostsResponse>(GET_SUPPORT_POSTS, {
    variables: { first: 100 },
  });
  const [deleteSupportPost] = useMutation<DeleteSupportPostData, DeleteSupportPostVariables>(DELETE_SUPPORT_POST, {
    refetchQueries: ['GetSupportPosts'],
  });
  
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [noticeFilter, setNoticeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const supportPosts = useMemo(() => {
    if (!data?.supportPosts?.nodes) {
      return [];
    }

    return data.supportPosts.nodes.map((post) => ({
      id: post.databaseId,
      slug: post.slug,
      title: post.title,
      category: post.supportCategories?.nodes?.[0]?.name || '기타',
      viewCount: post.supportMeta?.viewCount || 0,
      isNotice: Boolean(post.supportMeta?.isNotice),
      authorName: post.author?.node?.name || '관리자',
      createdAt: post.date ? new Date(post.date).toLocaleDateString('ko-KR') : '-',
    }));
  }, [data]);

  const filteredData = useMemo(() => {
    return supportPosts.filter((post) => {
      const categoryMatch = categoryFilter === 'all' || post.category === categoryFilter;
      const noticeMatch = noticeFilter === 'all' || String(post.isNotice) === noticeFilter;
      const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && noticeMatch && searchMatch;
    });
  }, [supportPosts, categoryFilter, noticeFilter, searchTerm]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSupportPost({
        variables: { id: deleteId.toString() },
      });
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm text-slate-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">후원/봉사 게시판 관리</h1>
        <Button onClick={() => router.push('/admin/support/new')}>
          새 게시글 등록
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="제목 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {supportCategoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-32">
          <Select value={noticeFilter} onValueChange={setNoticeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="공지 여부" />
            </SelectTrigger>
            <SelectContent>
              {noticeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  등록된 게시글이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="text-slate-500">#{post.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{post.title}</span>
                      {post.isNotice && (
                        <span className="text-xs text-red-500 font-medium mt-0.5">공지사항</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{post.viewCount.toLocaleString()}</TableCell>
                  <TableCell>{post.authorName}</TableCell>
                  <TableCell className="text-slate-500">{post.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">메뉴 열기</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/support/${post.slug}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setDeleteId(post.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 게시글을 삭제하시겠습니까?</p>
            <p className="text-sm text-slate-500 mt-2">삭제된 데이터는 복구할 수 없습니다.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
