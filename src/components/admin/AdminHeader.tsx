'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 어드민 헤더 Props 인터페이스
 */
export interface AdminHeaderProps {
  /** 사이드바 토글 핸들러 */
  onMenuToggle: () => void;
}

/**
 * 어드민 상단 헤더 컴포넌트
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/admin');
  };

  // 사용자 이니셜 생성
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700 lg:hidden"
          onClick={onMenuToggle}
        >
          <span className="sr-only">사이드바 열기</span>
          <Menu className="h-6 w-6" />
        </Button>
        
        {/* 데스크탑에서는 숨김, 모바일에서만 로고 표시 */}
        <div className="ml-4 flex items-center lg:hidden">
          <span className="text-lg font-bold text-slate-900">리호밍센터</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* 알림 아이콘 (Mock) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-slate-500 rounded-full"
        >
          <span className="sr-only">알림 보기</span>
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        {/* 프로필 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || '관리자'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@rehoming.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>프로필</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
