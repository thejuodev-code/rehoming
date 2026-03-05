'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MEDIA_ITEMS } from '@/lib/queries';
import { DELETE_MEDIA_ITEM, DeleteMediaItemData, DeleteMediaItemVariables } from '@/lib/mutations';
import { getAuthToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Loader2,
  ImageIcon,
  Trash2,
  FileText,
  Film,
  Info,
  Link2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';

interface MediaNode {
  databaseId: number;
  title: string;
  sourceUrl: string;
  mediaItemUrl: string;
  mimeType: string;
  fileSize: number | null;
  date: string;
  mediaDetails: {
    width: number;
    height: number;
    sizes: Array<{
      sourceUrl: string;
      name: string;
      width: string;
      height: string;
    }>;
  } | null;
}

interface GetMediaItemsData {
  mediaItems: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    nodes: MediaNode[];
  };
}

interface MediaUsage {
  postId: number;
  title: string;
  postType: string;
  usageType: 'thumbnail' | 'content' | 'acf_field';
}

const POST_TYPE_LABELS: Record<string, string> = {
  animal: '동물',
  project: '활동',
  review: '후기',
  support: '게시판',
  post: '블로그',
  page: '페이지',
};

const USAGE_TYPE_LABELS: Record<string, string> = {
  thumbnail: '대표이미지',
  content: '본문 삽입',
  acf_field: 'ACF 필드',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getMimeCategory(mimeType: string): 'image' | 'video' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

function getThumbnailUrl(item: MediaNode): string | null {
  if (!item.mimeType.startsWith('image/')) return null;
  const thumbnail = item.mediaDetails?.sizes?.find(
    (s) => s.name === 'thumbnail' || s.name === 'medium'
  );
  return thumbnail?.sourceUrl || item.sourceUrl;
}

export default function MediaPage() {
  const { data, loading, error, fetchMore, refetch } = useQuery<GetMediaItemsData>(GET_MEDIA_ITEMS, {
    variables: { first: 100 },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const [deleteMediaItem] = useMutation<DeleteMediaItemData, DeleteMediaItemVariables>(
    DELETE_MEDIA_ITEM,
    {
      onError: (err) => {
        console.error('Delete error:', err);
        toast.error(`삭제 실패: ${err.message}`);
      },
    }
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [usageFilter, setUsageFilter] = useState<'all' | 'used' | 'unused'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | 'bulk' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [usageTarget, setUsageTarget] = useState<MediaNode | null>(null);
  const [usageData, setUsageData] = useState<MediaUsage[] | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [usageChecked, setUsageChecked] = useState(false);

  const mediaItems: MediaNode[] = useMemo(() => {
    return data?.mediaItems?.nodes || [];
  }, [data]);

  // 페이지 로드 시 사용 여부 벌크 체크
  useEffect(() => {
    if (mediaItems.length === 0) return;

    const checkBulkUsage = async () => {
      try {
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
        const token = getAuthToken() || '';
        const ids = mediaItems.map((m) => m.databaseId).join(',');

        const formData = new FormData();
        formData.append('action', 'rehoming_check_media_usage_bulk');
        formData.append('token', token);
        formData.append('attachment_ids', ids);

        const res = await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();

        if (json.success) {
          setUsedIds(new Set(json.data.usedIds));
        }
      } catch {
        // 실패해도 페이지는 정상 동작
      } finally {
        setUsageChecked(true);
      }
    };

    checkBulkUsage();
  }, [mediaItems]);

  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === 'all' || getMimeCategory(item.mimeType) === typeFilter;
      const matchesUsage =
        !usageChecked || usageFilter === 'all' ||
        (usageFilter === 'used' && usedIds.has(item.databaseId)) ||
        (usageFilter === 'unused' && !usedIds.has(item.databaseId));
      return matchesSearch && matchesType && matchesUsage;
    });
  }, [mediaItems, searchTerm, typeFilter, usageFilter, usedIds, usageChecked]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.databaseId)));
    }
  }, [selectedIds.size, filteredItems]);

  const handleDeleteClick = (id: number) => {
    setDeleteTarget(id);
    setDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedIds.size === 0) return;
    setDeleteTarget('bulk');
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = deleteTarget === 'bulk' ? Array.from(selectedIds) : [deleteTarget as number];

      for (const id of ids) {
        await deleteMediaItem({ variables: { id: id.toString() } });
      }

      toast.success(`${ids.length}개 미디어가 삭제되었습니다.`);
      setSelectedIds(new Set());
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      refetch();
    } catch {
      // error handled in mutation onError
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCheckUsage = async (item: MediaNode) => {
    setUsageTarget(item);
    setUsageData(null);
    setUsageModalOpen(true);
    setUsageLoading(true);

    try {
      const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
      const token = getAuthToken() || '';

      const formData = new FormData();
      formData.append('action', 'rehoming_find_media_usage');
      formData.append('token', token);
      formData.append('attachment_id', String(item.databaseId));

      const res = await fetch(`${wpUrl}/wp-admin/admin-ajax.php`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setUsageData(json.data.usage);
      } else {
        toast.error('사용처 조회 실패');
        setUsageData([]);
      }
    } catch {
      toast.error('사용처 조회 중 오류 발생');
      setUsageData([]);
    } finally {
      setUsageLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (data?.mediaItems?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data.mediaItems.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            mediaItems: {
              ...fetchMoreResult.mediaItems,
              nodes: [...prev.mediaItems.nodes, ...fetchMoreResult.mediaItems.nodes],
            },
          };
        },
      });
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">미디어 관리</h1>
        <div className="flex items-center space-x-2">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDeleteClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              선택 삭제 ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="파일명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="파일 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 유형</SelectItem>
              <SelectItem value="image">이미지</SelectItem>
              <SelectItem value="video">동영상</SelectItem>
              <SelectItem value="document">문서</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {usageChecked && (
          <div className="w-full sm:w-48">
            <Select value={usageFilter} onValueChange={(v) => setUsageFilter(v as 'all' | 'used' | 'unused')}>
              <SelectTrigger>
                <SelectValue placeholder="사용 여부" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="used">사용 중</SelectItem>
                <SelectItem value="unused">미사용</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center text-sm text-slate-500">
          총 {filteredItems.length}개
          {usageChecked && (
            <span className="ml-2 text-slate-400">
              (사용 중 {mediaItems.filter(m => usedIds.has(m.databaseId)).length} / 미사용 {mediaItems.filter(m => !usedIds.has(m.databaseId)).length})
            </span>
          )}
        </div>
      </div>

      {/* 전체 선택 */}
      {filteredItems.length > 0 && (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
          >
            {selectedIds.size === filteredItems.length ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>전체 선택</span>
          </button>
        </div>
      )}

      {/* 그리드 뷰 */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <ImageIcon className="h-12 w-12 mb-4" />
          <p>미디어 파일이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.has(item.databaseId);
            const isUsed = usageChecked && usedIds.has(item.databaseId);
            const thumbUrl = getThumbnailUrl(item);
            const category = getMimeCategory(item.mimeType);

            return (
              <div
                key={item.databaseId}
                className={`group relative rounded-lg border bg-white overflow-hidden transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20'
                    : isUsed
                    ? 'border-blue-200'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* 체크박스 */}
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(item.databaseId)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* 사용 중 배지 */}
                {isUsed && (
                  <div className="absolute bottom-[72px] left-2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
                      <Link2 className="h-2.5 w-2.5" />
                      사용 중
                    </span>
                  </div>
                )}

                {/* 썸네일 영역 */}
                <div
                  className="aspect-square bg-slate-100 flex items-center justify-center cursor-pointer"
                  onClick={() => toggleSelect(item.databaseId)}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl.replace(/^http:\/\//, 'https://')}
                      alt={item.title || ''}
                      className="h-full w-full object-cover"
                    />
                  ) : category === 'video' ? (
                    <Film className="h-10 w-10 text-slate-400" />
                  ) : (
                    <FileText className="h-10 w-10 text-slate-400" />
                  )}
                </div>

                {/* 정보 영역 */}
                <div className="p-2">
                  <p className="text-xs font-medium text-slate-700 truncate" title={item.title}>
                    {item.title || '제목 없음'}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-400">
                      {formatFileSize(item.fileSize)}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      {item.mimeType.split('/')[1]?.toUpperCase() || '?'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.date ? new Date(item.date).toLocaleDateString('ko-KR') : '-'}
                  </p>
                </div>

                {/* 호버 액션 버튼 */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckUsage(item);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 backdrop-blur-sm shadow-sm hover:bg-blue-50 text-slate-600 hover:text-blue-600"
                    title="사용처 확인"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(item.databaseId);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 backdrop-blur-sm shadow-sm hover:bg-red-50 text-slate-600 hover:text-red-600"
                    title="삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 더 불러오기 */}
      {data?.mediaItems?.pageInfo?.hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={handleLoadMore}>
            더 불러오기
          </Button>
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>미디어 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              {deleteTarget === 'bulk'
                ? `선택한 ${selectedIds.size}개의 미디어를 삭제하시겠습니까?`
                : '이 미디어를 삭제하시겠습니까?'}{' '}
              사용 중인 글에서 이미지가 깨질 수 있습니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 사용처 확인 다이얼로그 */}
      <Dialog open={usageModalOpen} onOpenChange={setUsageModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>사용처 확인</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {usageTarget && (
              <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-lg">
                {getThumbnailUrl(usageTarget) ? (
                  <img
                    src={getThumbnailUrl(usageTarget)!.replace(/^http:\/\//, 'https://')}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-slate-200 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{usageTarget.title || '제목 없음'}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(usageTarget.fileSize)}</p>
                </div>
              </div>
            )}

            {usageLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : usageData && usageData.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <p className="text-sm">사용 중인 글이 없습니다.</p>
                <p className="text-xs text-slate-400 mt-1">안전하게 삭제할 수 있습니다.</p>
              </div>
            ) : usageData ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {usageData.map((usage, idx) => (
                  <div
                    key={`${usage.postId}-${idx}`}
                    className="flex items-center justify-between p-2 rounded-md border border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{usage.title}</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {POST_TYPE_LABELS[usage.postType] || usage.postType}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {USAGE_TYPE_LABELS[usage.usageType] || usage.usageType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsageModalOpen(false)}>
              닫기
            </Button>
            {usageData && usageTarget && (
              <Button
                variant="destructive"
                onClick={() => {
                  setUsageModalOpen(false);
                  handleDeleteClick(usageTarget.databaseId);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
