'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/admin/auth/LoginForm';
import { Loader2 } from 'lucide-react';

/**
 * 인증이 필요한 어드민 페이지를 보호하는 컴포넌트
 * 로그인되지 않은 경우 로그인 폼을 표시합니다.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중인 경우
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 폼 표시
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
