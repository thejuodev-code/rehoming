'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_REVIEWS } from '@/lib/queries';
import { GetReviewsData } from '@/types/graphql';
import { DELETE_REVIEW, DeleteReviewData, DeleteReviewVariables, UPDATE_REVIEW, UpdateReviewData, UpdateReviewVariables } from '@/lib/mutations';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Search, Loader2, ImageIcon } from 'lucide-react';
export default function ReviewsPage() {
  const { data, loading, error } = useQuery<GetReviewsData>(GET_REVIEWS, {
    variables: { first: 100 },
  });
  const [deleteReview] = useMutation<DeleteReviewData, DeleteReviewVariables>(DELETE_REVIEW, {
    refetchQueries: ['GetReviews'],
  });
  const [updateReview] = useMutation<UpdateReviewData, UpdateReviewVariables>(UPDATE_REVIEW, {
    refetchQueries: ['GetReviews'],
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [pinnedFilter, setPinnedFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const reviews = useMemo(() => {
    if (!data?.reviews?.nodes) {
      return [];
    }

    return data.reviews.nodes.map((review) => ({
      id: review.databaseId,
      slug: review.slug,
      title: review.title,
      authorName: review.reviewFields?.authorName || '-',
      animalName: review.reviewFields?.animalName || '-',
      animalType: review.reviewFields?.animalType || '기타',
      isPinned: Boolean(review.reviewFields?.isPinned),
      createdAt: review.date ? new Date(review.date).toLocaleDateString('ko-KR') : '-',
      imageUrl: review.featuredImage?.node?.sourceUrl,
    }));
  }, [data]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return reviews.filter((review) => {
      // 검색어 필터링
      const matchesSearch = 
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.animalName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 고정 여부 필터링
      const matchesPinned = 
        pinnedFilter === 'all' ||
        (pinnedFilter === 'pinned' && review.isPinned) ||
        (pinnedFilter === 'unpinned' && !review.isPinned);
      
      return matchesSearch && matchesPinned;
    });
  }, [reviews, searchTerm, pinnedFilter]);

  // 삭제 모달 열기
  const handleDeleteClick = (id: number) => {
    setSelectedReviewId(id);
    setDeleteModalOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (selectedReviewId) {
      await deleteReview({
        variables: { id: selectedReviewId.toString() },
      });
      setDeleteModalOpen(false);
      setSelectedReviewId(null);
    }
  };

  // 고정 토글
  const handleTogglePin = async (reviewId: number, currentPinned: boolean) => {
    const targetReview = reviews.find((review) => review.id === reviewId);
    if (!targetReview) {
      return;
    }

    await updateReview({
      variables: {
        id: reviewId.toString(),
        title: targetReview.title,
        status: 'PUBLISH',
        reviewFields: {
          authorName: targetReview.authorName,
          animalName: targetReview.animalName,
          animalType: targetReview.animalType,
          isPinned: !currentPinned,
        },
      },
    });
  };


  // 고정 여부 필터 옵션
  const pinnedOptions = [
    { value: 'all', label: '전체' },
    { value: 'pinned', label: '고정' },
    { value: 'unpinned', label: '일반' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">입양 후기 관리</h1>
        <Link href="/admin/reviews/new">
          <Button>새 후기 등록</Button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="제목, 작성자, 동물이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={pinnedFilter} onValueChange={setPinnedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="고정 여부" />
            </SelectTrigger>
            <SelectContent>
              {pinnedOptions.map((option) => (
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
              <TableHead>대표이미지</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자명</TableHead>
              <TableHead>동물이름</TableHead>
              <TableHead>동물타입</TableHead>
              <TableHead>고정여부</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  등록된 입양 후기가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                      {review.imageUrl ? (
                        <img
                          src={review.imageUrl}
                          alt={review.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{review.title}</TableCell>
                  <TableCell className="text-slate-600">{review.authorName}</TableCell>
                  <TableCell className="text-slate-600">{review.animalName}</TableCell>
                  <TableCell>
                    <Badge variant={review.animalType === '강아지' ? 'secondary' : review.animalType === '고양이' ? 'default' : 'outline'}>
                      {review.animalType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleTogglePin(review.id, review.isPinned)}
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                        review.isPinned
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {review.isPinned ? '고정' : '일반'}
                    </button>
                  </TableCell>
                  <TableCell className="text-slate-500">{review.createdAt}</TableCell>
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
                          <Link href={`/admin/reviews/${review.slug}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteClick(review.id)}
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

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>입양 후기 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 입양 후기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
