import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ML_STREAM_BASE = 'https://api.sansekai.my.id/api/melolo/stream';

export const GET: RequestHandler = async ({ params, fetch }) => {
    const { id } = params;

    try {
        const res = await fetch(`${ML_STREAM_BASE}?videoId=${id}`).then(r => r.ok ? r.json() : null);

        if (!res) {
            return json({ error: 'Failed to fetch stream from Melolo' }, { status: 502 });
        }

        return json(res);
    } catch (e) {
        console.error('Proxy Melolo stream failed:', e);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
