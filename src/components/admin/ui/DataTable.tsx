'use client';

import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

/**
 * 데이터 테이블 컬럼 정의 인터페이스
 */
export interface ColumnDef<T> {
  /** 컬럼 식별자 */
  id: string;
  /** 컬럼 헤더 텍스트 */
  header: string;
  /** 데이터 접근자 (키 또는 함수) */
  accessorKey?: keyof T;
  /** 커스텀 셀 렌더러 */
  cell?: (info: { row: T; value: any }) => React.ReactNode;
  /** 정렬 가능 여부 */
  sortable?: boolean;
}

/**
 * 데이터 테이블 Props 인터페이스
 */
export interface DataTableProps<T> {
  /** 테이블 데이터 */
  data: T[];
  /** 컬럼 정의 */
  columns: ColumnDef<T>[];
  /** 검색 가능 여부 */
  searchable?: boolean;
  /** 검색 대상 필드 */
  searchField?: keyof T;
  /** 페이지네이션 사용 여부 */
  pagination?: boolean;
  /** 페이지당 항목 수 */
  pageSize?: number;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 데이터가 없을 때 표시할 메시지 */
  emptyMessage?: string;
}

/**
 * 어드민 공통 데이터 테이블 컴포넌트
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchField,
  pagination = false,
  pageSize = 10,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 검색 필터링
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm || !searchField) return data;
    
    return data.filter((item) => {
      const value = item[searchField];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchable, searchTerm, searchField]);

  // 정렬
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = columns.find((c) => c.id === sortConfig.key);
      if (!column || !column.accessorKey) return 0;

      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, columns]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column || !column.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnId) {
        if (current.direction === 'asc') return { key: columnId, direction: 'desc' };
        return null;
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* 툴바 (검색 등) */}
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="w-full max-w-sm">
            <Input
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // 검색 시 첫 페이지로 이동
              }}
            />
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 border-b border-slate-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`px-6 py-3 font-medium ${column.sortable ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}`}
                    onClick={() => handleSort(column.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-slate-400">
                          {sortConfig?.key === column.id ? (
                            sortConfig.direction === 'asc' ? '↑' : '↓'
                          ) : (
                            '↕'
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center space-x-2">
                      <svg className="h-5 w-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>데이터를 불러오는 중...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        {column.cell
                          ? column.cell({ row, value: column.accessorKey ? row[column.accessorKey] : undefined })
                          : column.accessorKey
                          ? String(row[column.accessorKey])
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-slate-500">
            총 <span className="font-medium text-slate-900">{sortedData.length}</span>개 중{' '}
            <span className="font-medium text-slate-900">
              {(currentPage - 1) * pageSize + 1}
            </span>
            -
            <span className="font-medium text-slate-900">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>
            개 표시
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // 간단한 페이지네이션 로직 (현재 페이지 주변 표시)
                let pageNum = currentPage;
                if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
