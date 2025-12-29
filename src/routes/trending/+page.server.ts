import type { PageServerLoad } from './$types';

interface TagV3 {
    tagId: number;
    tagName: string;
    tagEnName: string;
}

interface Book {
    bookId: string;
    bookName: string;
    coverWap: string;
    chapterCount: number;
    introduction: string;
    tags: string[];
    tagV3s: TagV3[];
    playCount: string;
    shelfTime: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const response = await fetch('https://dramabox.sansekai.my.id/api/dramabox/trending');

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: Book[] = await response.json();

        return {
            books: data
        };
    } catch (error) {
        console.error('Failed to fetch trending books:', error);
        return {
            books: []
        };
    }
};
