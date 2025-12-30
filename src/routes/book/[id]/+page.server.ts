import type { PageServerLoad } from './$types';
import { fetchBookDetail } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const { id } = params;

    try {
        const { book, episodes } = await fetchBookDetail(fetch, id);

        return {
            book,
            episodes
        };
    } catch (error) {
        console.error('Failed to fetch book data:', error);
        throw error;
    }
};
