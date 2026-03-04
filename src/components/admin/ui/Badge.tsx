import React from 'react';

/**
 * 배지 컴포넌트의 Props 인터페이스
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 배지의 시각적 스타일 변형 */
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** 배지 내용 */
  children: React.ReactNode;
}

/**
 * 어드민 공통 상태 배지 컴포넌트
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    const variants = {
      default: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
