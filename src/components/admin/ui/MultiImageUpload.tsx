'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, X } from 'lucide-react';

export interface MultiImageUploadProps {
  value: string[]; // image URLs
  onChange: (urls: string[]) => void;
  maxCount?: number; // default: 10
  accept?: string;
  maxSize?: number;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxCount = 10,
  accept = 'image/*',
  maxSize = 5,
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    setError(null);
    
    const newFiles = Array.from(files);
    
    if (value.length + newFiles.length > maxCount) {
      setError(`최대 ${maxCount}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (accept !== '*/*' && !file.type.match(accept.replace('*', '.*'))) {
        setError('지원하지 않는 파일 형식이 포함되어 있습니다.');
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        setError(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
        return;
      }
      validFiles.push(file);
    }

    const newUrls = validFiles.map(file => {
      const mockUrl = URL.createObjectURL(file);
      console.log('Mock upload:', mockUrl);
      return mockUrl;
    });

    onChange([...value, ...newUrls]);
  }, [accept, maxCount, maxSize, onChange, value]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow uploading the same file again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const handleRemove = useCallback((indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = value.filter((_, index) => index !== indexToRemove);
    onChange(newValues);
  }, [onChange, value]);

  const handleSetRepresentative = useCallback((indexToSet: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (indexToSet === 0) return;
    
    const newValues = [...value];
    const item = newValues.splice(indexToSet, 1)[0];
    newValues.unshift(item);
    onChange(newValues);
  }, [onChange, value]);

  // Reordering logic
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newValues = [...value];
    const draggedItem = newValues[draggedIndex];
    
    newValues.splice(draggedIndex, 1);
    newValues.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onChange(newValues);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 bg-muted/50 hover:border-primary hover:bg-muted'}
          ${error ? 'border-destructive bg-destructive/5' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple
          onChange={onFileInputChange}
        />
        
        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">클릭하여 업로드</span> 또는 드래그 앤 드롭
        </p>
        <Badge variant="secondary" className="mt-2">
          최대 {maxSize}MB, 최대 {maxCount}장
        </Badge>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`relative aspect-square rounded-lg overflow-hidden border group cursor-move
                ${index === 0 ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'}
                ${draggedIndex === index ? 'opacity-50' : 'opacity-100'}
              `}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {index === 0 && (
                <Badge className="absolute top-2 left-2 shadow-sm">
                  대표
                </Badge>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleSetRepresentative(index, e)}
                    className="h-8 text-xs shadow-sm"
                  >
                    대표 지정
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={(e) => handleRemove(index, e)}
                  className="rounded-full shadow-sm"
                  title="삭제"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
