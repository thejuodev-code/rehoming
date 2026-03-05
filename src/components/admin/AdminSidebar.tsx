'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PawPrint,
  MessageSquare,
  Activity,
  HeartHandshake,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 사이드바 메뉴 아이템 인터페이스
 */
interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  subItems?: { title: string; path: string }[];
}

/**
 * 어드민 사이드바 Props 인터페이스
 */
export interface AdminSidebarProps {
  /** 모바일에서 사이드바 열림 상태 */
  isOpen: boolean;
  /** 모바일에서 사이드바 닫기 핸들러 */
  onClose: () => void;
}

/**
 * 어드민 사이드바 컴포넌트
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'A';

  const handleLogout = () => {
    logout();
    onClose();
    router.replace('/admin');
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      title: '대시보드',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: '동물 관리',
      path: '/admin/animals',
      icon: <PawPrint className="h-5 w-5" />,
      subItems: [
        { title: '동물 목록', path: '/admin/animals' },
        { title: '동물 등록', path: '/admin/animals/new' },
      ],
    },
    {
      title: '입양 후기',
      path: '/admin/reviews',
      icon: <MessageSquare className="h-5 w-5" />,
      subItems: [
        { title: '후기 목록', path: '/admin/reviews' },
        { title: '후기 등록', path: '/admin/reviews/new' },
      ],
    },
    {
      title: '활동/프로젝트',
      path: '/admin/activities',
      icon: <Activity className="h-5 w-5" />,
      subItems: [
        { title: '활동 목록', path: '/admin/activities' },
        { title: '활동 등록', path: '/admin/activities/new' },
      ],
    },
    {
      title: '후원/봉사 게시판',
      path: '/admin/support',
      icon: <HeartHandshake className="h-5 w-5" />,
      subItems: [
        { title: '게시글 목록', path: '/admin/support' },
        { title: '게시글 작성', path: '/admin/support/new' },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center px-6 bg-slate-950">
        <Link href="/admin" className="flex items-center space-x-2 text-white" onClick={() => onClose()}>
          <PawPrint className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold tracking-tight">리호밍센터 어드민</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus[item.title] || active;

            return (
              <div key={item.title} className="space-y-1">
                {hasSubItems ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.title)}
                    className={`group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 flex-shrink-0 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-300'}`}>
                        {item.icon}
                      </span>
                      {item.title}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => onClose()}
                    className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 flex-shrink-0 ${active ? 'text-primary-foreground' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                )}

                {/* 서브 메뉴 */}
                {hasSubItems && isExpanded && (
                  <div className="mt-1 space-y-1 pl-11 pr-3">
                    {item.subItems!.map((subItem) => {
                      const subActive = pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.path}
                          onClick={() => onClose()}
                          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            subActive
                              ? 'bg-slate-800 text-primary'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      
      <Separator className="bg-slate-800" />
      
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{user?.name || '관리자'}</p>
            <p className="text-xs font-medium text-slate-400">{user?.email || '-'}</p>
          </div>
          <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 border-none">
            Admin
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일 사이드바 (Sheet) */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-64 p-0 border-r-0 [&>button]:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:bg-slate-900 lg:text-slate-300">
        <SidebarContent />
      </aside>
    </>
  );
};
