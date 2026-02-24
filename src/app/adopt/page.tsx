'use client';

import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '@/lib/queries';
import { GetPostsData } from '@/types/graphql';

export default function AdoptPage() {
    const { loading, error, data } = useQuery<GetPostsData>(GET_POSTS, {
        variables: { first: 6 }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-6 text-brand-trust">Adopt a Pet</h1>

            {loading && <p>로딩 중...</p>}
            {error && <p>에러 발생: {error.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.posts?.nodes
                    ?.filter((post: any) => !post.categories?.nodes?.some((cat: any) => cat.slug === 'activity'))
                    .map((post: any) => (
                        <div key={post.id} className="border rounded-lg p-4 shadow-sm">
                            {post.featuredImage?.node?.sourceUrl && (
                                <img
                                    src={post.featuredImage.node.sourceUrl}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}
                            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                            <div
                                className="text-gray-600 text-sm"
                                dangerouslySetInnerHTML={{ __html: post.excerpt }}
                            />
                        </div>
                    ))}
            </div>

            {!loading && !error && data?.posts?.nodes?.filter((post: any) => !post.categories?.nodes?.some((cat: any) => cat.slug === 'activity')).length === 0 && (
                <p className="text-gray-500">등록된 동물이 없습니다.</p>
            )}
        </div>
    );
}
