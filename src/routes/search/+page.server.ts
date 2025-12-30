import type { PageServerLoad } from './$types';
import { searchBooks } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch, url }) => {
    const query = url.searchParams.get('query') || '';

    if (!query) {
        return { books: [], query };
    }

    const books = await searchBooks(fetch, query);

    return {
        books,
        query
    };
};
