import type { PageServerLoad } from './$types';
import { fetchTrendingBooks } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch }) => {
    const books = await fetchTrendingBooks(fetch);
    return {
        books
    };
};
