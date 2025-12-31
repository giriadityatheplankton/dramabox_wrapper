import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchBookDetail } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const { id } = params;

    try {
        const { book, episodes } = await fetchBookDetail(fetch, id);

        if (!book || !book.originalId) {
            throw error(404, 'Short film not found or no longer available');
        }

        return {
            book,
            episodes
        };
    } catch (err: any) {
        if (err.status === 404) throw err;
        console.error('Failed to fetch book data:', err);
        throw error(500, 'Internal Server Error');
    }
};
