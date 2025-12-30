import type { PageServerLoad } from './$types';
import { fetchVipContent } from '$lib/services/api';

export const load: PageServerLoad = async ({ fetch }) => {
    const columns = await fetchVipContent(fetch);
    return {
        columns
    };
};
