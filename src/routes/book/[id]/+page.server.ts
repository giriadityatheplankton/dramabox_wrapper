import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
    const { id } = params;

    try {
        const [detailRes, episodesRes] = await Promise.all([
            fetch(`https://dramabox.sansekai.my.id/api/dramabox/detail?bookId=${id}`),
            fetch(`https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${id}`)
        ]);

        if (!detailRes.ok) {
            throw new Error(`Detail API error: ${detailRes.status}`);
        }

        // Episodes might fail or be empty, handle gracefully
        const detail = await detailRes.json();
        const book = detail.data?.book || detail;
        let episodes = [];

        if (episodesRes.ok) {
            try {
                const episodesData = await episodesRes.json();
                const rawEpisodes = episodesData.episodes || episodesData || [];

                episodes = Array.isArray(rawEpisodes) ? rawEpisodes.map((ep: any) => {
                    let videoUrl = '';
                    if (ep.cdnList?.length > 0) {
                        const defaultCdn = ep.cdnList.find((c: any) => c.isDefault) || ep.cdnList[0];
                        if (defaultCdn?.videoPathList?.length > 0) {
                            videoUrl = defaultCdn.videoPathList[0].videoPath;
                        }
                    }
                    return { ...ep, videoUrl };
                }) : [];
            } catch (e) {
                console.error('Failed to parse episodes:', e);
            }
        }

        return {
            book: book,
            episodes: Array.isArray(episodes) ? episodes : []
        };
    } catch (error) {
        console.error('Failed to fetch book data:', error);
        throw error;
    }
};
