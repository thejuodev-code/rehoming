'use client';

import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '@/lib/queries';
import { GetPostsData } from '@/types/graphql';

export default function ReviewsPage() {
    const { loading, error, data } = useQuery<GetPostsData>(GET_POSTS, {
        variables: { first: 10 }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-6 text-brand-trust">Adoption Reviews</h1>

            {loading && (
                <div className="flex justify-center py-10">
                    <p className="text-gray-500 animate-pulse">후기를 불러오는 중입니다...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-600">에러가 발생했습니다: {error.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data?.posts?.nodes?.map((post: any) => (
                    <article key={post.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        {post.featuredImage?.node?.sourceUrl && (
                            <img
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.title}
                                className="w-full h-64 object-cover rounded-xl mb-4"
                            />
                        )}
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">{post.title}</h2>
                        <div
                            className="text-gray-600 leading-relaxed line-clamp-3 mb-4"
                            dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                        <div className="flex items-center text-sm text-gray-400">
                            <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                        </div>
                    </article>
                ))}
            </div>

            {!loading && !error && data?.posts?.nodes?.length === 0 && (
                <p className="text-center text-gray-500 py-20">아직 등록된 후기가 없습니다.</p>
            )}
        </div>
    );
}
