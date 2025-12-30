import type { PageServerLoad } from './$types';
import { fetchLatestBooks } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch }) => {
    const books = await fetchLatestBooks(fetch);
    return {
        books
    };
};
