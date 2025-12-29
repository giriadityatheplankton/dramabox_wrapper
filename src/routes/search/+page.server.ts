import type { PageServerLoad } from './$types';

interface TagV3 {
    tagId: number;
    tagName: string;
    tagEnName: string;
}

interface Book {
    bookId: string;
    bookName: string;
    coverWap?: string;
    cover?: string;
    chapterCount: number;
    introduction: string;
    tags: string[];
    tagV3s: TagV3[];
    playCount: string;
    shelfTime: string;
}

export const load: PageServerLoad = async ({ fetch, url }) => {
    const query = url.searchParams.get('query');

    if (!query) {
        return {
            books: [],
            query: ''
        };
    }

    try {
        const response = await fetch(`https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: Book[] = await response.json();

        return {
            books: data,
            query
        };
    } catch (error) {
        console.error('Failed to search books:', error);
        return {
            books: [],
            query
        };
    }
};
