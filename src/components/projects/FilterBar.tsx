'use client';

import { ProjectCategoryConfig } from '@/types/project';

interface FilterBarProps {
    categories: ProjectCategoryConfig[];
    activeFilter: string;
    onFilterChange: (slug: string) => void;
}


const CATEGORY_STYLES: Record<string, { gradient: string }> = {
    rescue: { gradient: 'from-blue-600 to-cyan-500' },
    partnership: { gradient: 'from-violet-600 to-purple-500' },
    medical: { gradient: 'from-emerald-600 to-teal-500' },
    campaign: { gradient: 'from-amber-500 to-orange-500' },
    education: { gradient: 'from-rose-500 to-pink-500' },
    support: { gradient: 'from-cyan-500 to-blue-500' },
};

export default function FilterBar({ categories, activeFilter, onFilterChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => {
                const style = CATEGORY_STYLES[category.slug];
                const isActive = activeFilter === category.slug;

                return (
                    <button
                        key={category.slug}
                        type="button"
                        onClick={() => onFilterChange(category.slug)}
                        className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                            isActive
                                ? `text-white shadow-lg scale-105 ${style ? `bg-gradient-to-r ${style.gradient}` : 'bg-gray-900'}`
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-1.5">
                            {category.icon && <span className="text-xs">{category.icon}</span>}
                            {category.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
