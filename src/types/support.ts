export interface SupportGraphQLNode {
    databaseId: number;
    title: string;
    slug: string;
    date: string;
    content?: string;
    author: {
        node: {
            name: string;
        }
    };
    supportCategories: {
        nodes: {
            name: string;
            slug: string;
        }[]
    };
    supportMeta: {
        isNotice: boolean;
        viewCount: number;
        attachedFile?: {
            node: {
                sourceUrl: string;
                mimeType: string;
                mediaItemUrl: string;
                title: string;
                fileSize?: number;
            }
        } | null;
    } | null;
}

export interface GetSupportPostsResponse {
    supportPosts: {
        nodes: SupportGraphQLNode[];
    };
}

export interface GetSupportPostBySlugResponse {
    supportPost: SupportGraphQLNode;
}
