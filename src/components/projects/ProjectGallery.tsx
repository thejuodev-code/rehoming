'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Project, ProjectCategoryConfig, ProjectNode, GetProjectsData, GraphQLResponse } from '@/types/project';
import FilterBar from './FilterBar';
import ProjectCard from './ProjectCard';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://lovejuo123.mycafe24.com/graphql';

const PROJECT_CATEGORIES: ProjectCategoryConfig[] = [
    { slug: 'all', label: '전체', icon: '✦' },
    { slug: 'rescue', label: '구조', icon: '♥' },
    { slug: 'partnership', label: '파트너십', icon: '★' },
    { slug: 'medical', label: '의료', icon: '✚' },
    { slug: 'campaign', label: '캠페인', icon: '◆' },
    { slug: 'education', label: '교육', icon: '◈' },
    { slug: 'support', label: '후원', icon: '❋' },
];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop';

const GET_PROJECTS_QUERY = `
    query GetProjects {
        projects(first: 100) {
            nodes {
                databaseId
                title
                content
                projectCategories {
                    nodes {
                        name
                        slug
                    }
                }
                activityFields {
                    type
                    impactSummary
                    pintoimpact
                }
                featuredImage {
                    node {
                        sourceUrl
                    }
                }
            }
        }
    }
`;

function extractFirstImageFromContent(content?: string): string {
    if (!content) {
        return '';
    }
    const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] || '';
}

function transformProjectData(node: ProjectNode): Project {
    const category = node.projectCategories?.nodes?.[0];
    return {
        id: node.databaseId,
        title: node.title,
        categoryName: category?.name || '',
        categorySlug: category?.slug || '',
        image: node.featuredImage?.node?.sourceUrl || extractFirstImageFromContent(node.content) || PLACEHOLDER_IMAGE,
        impactSummary: node.activityFields?.impactSummary || node.campaignFields?.impactsummary || '',
    };
}

export default function ProjectGallery() {
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(API_URL, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: GET_PROJECTS_QUERY }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json: GraphQLResponse<GetProjectsData> = await response.json();

                if (json.errors && json.errors.length > 0) {
                    throw new Error(json.errors[0].message);
                }

                if (json.data?.projects?.nodes) {
                    const transformed = json.data.projects.nodes.map(transformProjectData);
                    setAllProjects(transformed);
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        return () => controller.abort();
    }, []);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'all') {
            return allProjects;
        }
        return allProjects.filter((project) => project.categorySlug === activeFilter);
    }, [allProjects, activeFilter]);

    const handleFilterChange = useCallback((slug: string) => {
        setActiveFilter(slug);
    }, []);

    if (error) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">데이터를 불러올 수 없습니다</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <FilterBar
                categories={PROJECT_CATEGORIES}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
            />

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-6 bg-gray-200 rounded w-full" />
                                <div className="h-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">해당 카테고리의 프로젝트가 없습니다</h3>
                    <p className="text-gray-500 mb-6">다른 카테고리를 선택해보세요</p>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-brand-trust transition-all duration-300"
                    >
                        전체 보기
                    </button>
                </div>
            )}

            {!loading && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
