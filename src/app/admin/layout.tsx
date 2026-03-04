'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthGuard } from '@/components/admin/auth/AdminAuthGuard';

/**
 * 어드민 전용 레이아웃 컴포넌트
 * 기존 Header/Footer를 사용하지 않고 독립적인 레이아웃을 구성합니다.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <AdminAuthGuard>
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
          {/* 사이드바 */}
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {/* 메인 콘텐츠 영역 */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* 상단 헤더 */}
            <AdminHeader onMenuToggle={toggleSidebar} />

            {/* 메인 콘텐츠 스크롤 영역 */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminAuthGuard>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
