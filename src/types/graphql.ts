export interface WordPressPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
}

export interface GetPostsData {
    posts: {
        nodes: WordPressPost[];
    };
}

export interface WordPressPage {
    id: string;
    title: string;
    slug: string;
    content: string;
}

export interface GetPagesData {
    pages: {
        nodes: WordPressPage[];
    };
}
