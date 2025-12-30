import type { PageServerLoad } from './$types';
import { fetchHomeSections } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch }) => {
    const sections = await fetchHomeSections(fetch);
    return {
        sections
    };
};
