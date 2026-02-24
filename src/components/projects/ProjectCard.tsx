'use client';

import Image from 'next/image';
import { Project } from '@/types/project';

interface ProjectCardProps {
    project: Project;
}


const CATEGORY_STYLES: Record<string, { gradient: string; bg: string; text: string }> = {
    rescue: {
        gradient: 'from-blue-600 to-cyan-500',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        text: 'text-blue-700',
    },
    partnership: {
        gradient: 'from-violet-600 to-purple-500',
        bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
        text: 'text-violet-700',
    },
    medical: {
        gradient: 'from-emerald-600 to-teal-500',
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        text: 'text-emerald-700',
    },
    campaign: {
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        text: 'text-amber-700',
    },
    education: {
        gradient: 'from-rose-500 to-pink-500',
        bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
        text: 'text-rose-700',
    },
    support: {
        gradient: 'from-cyan-500 to-blue-500',
        bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
        text: 'text-cyan-700',
    },
};


const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop';

export default function ProjectCard({ project }: ProjectCardProps) {
    const style = CATEGORY_STYLES[project.categorySlug] || {
        gradient: 'from-gray-600 to-gray-500',
        bg: 'bg-gray-50',
        text: 'text-gray-700',
    };

    const imageSrc = project.image || PLACEHOLDER_IMAGE;

    return (
        <article className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${style.gradient} text-white shadow-md`}>
                        {project.categoryName}
                    </span>
                </div>
            </div>


            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 break-keep group-hover:text-brand-trust transition-colors">
                    {project.title}
                </h3>


                {project.impactSummary && (
                    <div className={`flex items-start gap-2 p-3 ${style.bg} rounded-xl`}>
                        <svg className={`w-4 h-4 ${style.text} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`text-sm ${style.text} font-medium line-clamp-2 break-keep`}>
                            {project.impactSummary}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}
