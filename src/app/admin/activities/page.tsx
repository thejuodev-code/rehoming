'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ACTIVITIES } from '@/lib/queries';
import { DeleteActivityData, DeleteActivityVariables, DELETE_ACTIVITY } from '@/lib/mutations';
import { GetActivitiesData } from '@/types/graphql';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Search, Loader2, ImageIcon } from 'lucide-react';

export default function ActivitiesPage() {
  const { data, loading, error } = useQuery<GetActivitiesData>(GET_ACTIVITIES);
  const [deleteActivity] = useMutation<DeleteActivityData, DeleteActivityVariables>(DELETE_ACTIVITY, {
    refetchQueries: ['GetActivities'],
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  const activities = useMemo(() => {
    if (!data?.projects?.nodes) {
      return [];
    }

    return data.projects.nodes.map((activity) => ({
      id: activity.databaseId,
      slug: activity.slug,
      title: activity.title,
      type: activity.activityFields?.type || '-',
      category: activity.projectCategories?.nodes?.[0]?.name || '-',
      imageUrl: activity.featuredImage?.node?.sourceUrl,
      createdAt: activity.date ? new Date(activity.date).toLocaleDateString('ko-KR') : '-',
    }));
  }, [data]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return activities.filter((activity) => {
      // 검색어 필터링
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 타입 필터링
      const matchesType = typeFilter === 'all' || activity.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [activities, searchTerm, typeFilter]);

  // 삭제 모달 열기
  const handleDeleteClick = (id: number) => {
    setSelectedActivityId(id);
    setDeleteModalOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (selectedActivityId) {
      await deleteActivity({
        variables: { id: selectedActivityId.toString() },
      });
      setDeleteModalOpen(false);
      setSelectedActivityId(null);
    }
  };


  // 활동 타입 옵션 (유니크한 값 추출)
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(activities.map(a => a.type)));
    return [
      { value: 'all', label: '모든 타입' },
      ...types.map(type => ({ value: type, label: type }))
    ];
  }, [activities]);

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
        <h1 className="text-2xl font-bold text-slate-900">활동/프로젝트 관리</h1>
        <Link href="/admin/activities/new">
          <Button>새 활동 등록</Button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="타입 필터" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
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
              <TableHead>이미지</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  등록된 활동이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                      {activity.imageUrl ? (
                        <img
                          src={activity.imageUrl}
                          alt="활동 이미지"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{activity.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{activity.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{activity.category}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{activity.createdAt}</TableCell>
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
                          <Link href={`/admin/activities/${activity.slug}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteClick(activity.id)}
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
            <DialogTitle>활동 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 활동을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
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
