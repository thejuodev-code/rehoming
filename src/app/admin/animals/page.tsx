'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ADMIN_ANIMALS } from '@/lib/queries';
import { DELETE_ANIMAL } from '@/lib/mutations';
import { GetAnimalsData } from '@/types/graphql';
import { DeleteAnimalData, DeleteAnimalVariables } from '@/lib/mutations';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Search, Loader2, ImageIcon } from 'lucide-react';

const animalStatusOptions = [
  { value: 'available', label: '입양 가능' },
  { value: 'urgent', label: '긴급' },
  { value: 'adopted', label: '입양 완료' },
];

export default function AnimalsPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetAnimalsData>(GET_ADMIN_ANIMALS, {
    variables: { first: 100 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  
  const [deleteAnimal, { loading: isDeleting }] = useMutation<DeleteAnimalData, DeleteAnimalVariables>(DELETE_ANIMAL, {
    refetchQueries: ['GetAdminAnimals'],
    onCompleted: () => {
      setDeleteModalOpen(false);
      setSelectedAnimalId(null);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      alert(`삭제 실패: ${error.message}`);
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);

  // GraphQL 데이터를 목록 형식으로 변환
  const animals = useMemo(() => {
    if (!data?.animals?.nodes) return [];
    return data.animals.nodes.map((animal) => ({
      id: animal.databaseId,
      title: animal.title,
      imageUrl: animal.featuredImage?.node?.sourceUrl || animal.animalFields?.image?.node?.sourceUrl,
      type: animal.animalTypes?.nodes?.[0]?.name || '강아지',
      age: animal.animalFields?.age || '미상',
      gender: animal.animalFields?.gender || '미상',
      status: animal.animalStatuses?.nodes?.[0]?.name || '입양 가능',
      statusSlug: animal.animalStatuses?.nodes?.[0]?.slug || 'available',
      createdAt: animal.date ? new Date(animal.date).toLocaleDateString('ko-KR') : '-',
      slug: animal.slug,
    }));
  }, [data]);

  // 상태에 따른 배지 변형
  const getStatusVariant = (statusSlug: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (statusSlug) {
      case 'available':
        return 'default';
      case 'urgent':
        return 'destructive';
      case 'adopted':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return animals.filter((animal) => {
      // 검색어 필터링
      const matchesSearch = animal.title.toLowerCase().includes(searchTerm.toLowerCase());
      // 상태 필터링
      const matchesStatus = statusFilter === 'all' || animal.statusSlug === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [animals, searchTerm, statusFilter]);

  // 삭제 모달 열기
  const handleDeleteClick = (id: number) => {
    setSelectedAnimalId(id);
    setDeleteModalOpen(true);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    if (!selectedAnimalId) return;
    
    try {
      await deleteAnimal({
        variables: { id: selectedAnimalId.toString() }
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  // 상태 필터 옵션
  const statusFilterOptions = [
    { value: 'all', label: '모든 상태' },
    ...animalStatusOptions
  ];

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // 에러 상태
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
        <h1 className="text-2xl font-bold text-slate-900">동물 관리</h1>
        <Link href="/admin/animals/new">
          <Button>새 동물 등록</Button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              {statusFilterOptions.map((option) => (
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
              <TableHead>이름</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>나이</TableHead>
              <TableHead>성별</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  등록된 동물이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((animal) => (
                <TableRow key={animal.id} className="cursor-pointer hover:bg-slate-50" onClick={() => router.push(`/admin/animals/${animal.slug}`)}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                      {animal.imageUrl ? (
                        <img
                          src={animal.imageUrl}
                          alt={animal.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/animals/${animal.slug}`} className="font-medium text-slate-900 hover:text-blue-600 hover:underline">
                      {animal.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{animal.type}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{animal.age}</TableCell>
                  <TableCell className="text-slate-600">{animal.gender}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(animal.statusSlug)}>{animal.status}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{animal.createdAt}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">메뉴 열기</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/animals/${animal.slug}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            수정
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDeleteClick(animal.id)}
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
            <DialogTitle>동물 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 동물 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
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
