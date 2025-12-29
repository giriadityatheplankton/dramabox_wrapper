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

interface Column {
    columnId: number;
    title: string;
    subTitle: string;
    style: string;
    bookList: Book[];
}

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const response = await fetch('https://dramabox.sansekai.my.id/api/dramabox/vip');

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            columns: (data.columnVoList || []) as Column[]
        };
    } catch (error) {
        console.error('Failed to fetch VIP data:', error);
        return {
            columns: []
        };
    }
};
