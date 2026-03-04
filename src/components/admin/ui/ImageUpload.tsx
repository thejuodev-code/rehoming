'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, X } from 'lucide-react';

export interface ImageUploadProps {
  value?: string; // image URL
  onChange: (url: string) => void;
  accept?: string; // default: 'image/*'
  maxSize?: number; // MB, default: 5
  previewWidth?: number;
  previewHeight?: number;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5,
  previewWidth = 200,
  previewHeight = 200,
  error: externalError,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const error = externalError || internalError;

  const handleFile = useCallback((file: File) => {
    setInternalError(null);

    // Type validation
    if (accept !== '*/*' && !file.type.match(accept.replace('*', '.*'))) {
      setInternalError('지원하지 않는 파일 형식입니다.');
      return;
    }

    // Size validation
    if (file.size > maxSize * 1024 * 1024) {
      setInternalError(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`);
      return;
    }

    // Mock upload
    const mockUrl = URL.createObjectURL(file);
    console.log('Mock upload:', mockUrl);
    onChange(mockUrl);
  }, [accept, maxSize, onChange]);

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
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed transition-colors cursor-pointer overflow-hidden
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 bg-muted/50 hover:border-primary hover:bg-muted'}
          ${error ? 'border-destructive bg-destructive/5' : ''}
        `}
        style={{ minHeight: previewHeight }}
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
          onChange={onFileInputChange}
        />

        {value ? (
          <div className="relative w-full h-full flex items-center justify-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: previewHeight }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                className="rounded-full shadow-sm"
                title="이미지 삭제"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">클릭하여 업로드</span> 또는 드래그 앤 드롭
            </p>
            <Badge variant="secondary" className="mt-2">
              최대 {maxSize}MB
            </Badge>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
