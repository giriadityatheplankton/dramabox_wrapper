import type { UnifiedBook, UnifiedEpisode, HomeSection, SourceType } from '$lib/types/book';

const DB_BASE = 'https://dramabox.sansekai.my.id/api/dramabox';
const NS_BASE = 'https://netshort.sansekai.my.id/api/netshort';

export const isNetshort = (id: string) => id.startsWith('ns-');
export const getCleanId = (id: string) => id.startsWith('ns-') ? id.replace('ns-', '') : id;

function stripHtml(text: string): string {
    return (text || "").replace(/<\/?[^>]+(>|$)/g, "");
}

export function normalizeDramabox(book: any): UnifiedBook {
    return {
        id: String(book.bookId),
        originalId: String(book.bookId),
        source: 'db',
        name: stripHtml(book.bookName),
        cover: book.coverWap || book.cover,
        introduction: book.introduction,
        tags: book.tags || [],
        playCount: book.playCount,
        chapterCount: book.chapterCount
    };
}

export function normalizeNetshort(item: any): UnifiedBook {
    return {
        id: `ns-${item.shortPlayId}`,
        originalId: String(item.shortPlayId),
        source: 'ns',
        name: stripHtml(item.shortPlayName),
        cover: item.shortPlayCover,
        introduction: item.shotIntroduce || '',
        tags: item.labelArray || (item.labelNames ? item.labelNames.split(',') : []),
        playCount: item.heatScoreShow || item.formatHeatScore,
        chapterCount: item.totalEpisode
    };
}

export async function fetchHomeSections(customFetch: any): Promise<HomeSection[]> {
    const sections: HomeSection[] = [];

    try {
        const [dbRes, nsRes] = await Promise.all([
            customFetch(`${DB_BASE}/foryou`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${NS_BASE}/theaters`).then((r: Response) => r.ok ? r.json() : [])
        ]);

        // Dramabox section
        const rawDbBooks = Array.isArray(dbRes) ? dbRes : (dbRes?.data || []);
        const dbBooks = rawDbBooks
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);

        if (dbBooks.length > 0) {
            sections.push({
                title: 'Dramabox - For You',
                books: dbBooks
            });
        }

        // Netshort sections
        if (nsRes && Array.isArray(nsRes)) {
            nsRes.forEach((group: any) => {
                const books = (group.contentInfos || [])
                    .filter((item: any) => item.shortPlayId)
                    .map(normalizeNetshort);
                if (books.length > 0) {
                    sections.push({
                        title: `Netshort - ${group.contentName}`,
                        books: books
                    });
                }
            });
        }
    } catch (e) {
        console.error('Fetch home failed:', e);
    }

    return sections;
}

export async function fetchBookDetail(customFetch: any, id: string): Promise<{ book: UnifiedBook, episodes: UnifiedEpisode[] }> {
    const cleanId = getCleanId(id);
    const source: SourceType = isNetshort(id) ? 'ns' : 'db';

    if (source === 'db') {
        const [detailRes, episodesRes] = await Promise.all([
            customFetch(`${DB_BASE}/detail?bookId=${cleanId}`).then((r: Response) => r.json()),
            customFetch(`${DB_BASE}/allepisode?bookId=${cleanId}`).then((r: Response) => r.json())
        ]);

        const detail = detailRes.data?.book || detailRes;
        const episodesListData = episodesRes.data?.episodeList || episodesRes.data?.episodes || episodesRes.episodes || episodesRes.data || episodesRes || [];

        const episodes = (Array.isArray(episodesListData) ? episodesListData : []).map((ep: any, index: number) => {
            let videoUrl = '';
            if (ep.cdnList?.length > 0) {
                const defaultCdn = ep.cdnList.find((c: any) => c.isDefault) || ep.cdnList[0];
                if (defaultCdn?.videoPathList?.length > 0) {
                    videoUrl = defaultCdn.videoPathList[0].videoPath;
                }
            }
            return {
                id: String(ep.episodeId),
                no: ep.episodeNo || ep.orderNo || ep.episode_no || ep.no || (index + 1),
                name: ep.episodeName,
                cover: ep.episodeCover,
                videoUrl
            };
        });

        return {
            book: normalizeDramabox(detail),
            episodes
        };
    } else {
        const res = await customFetch(`${NS_BASE}/allepisode?shortPlayId=${cleanId}`).then((r: Response) => r.json());

        const episodes = (res.shortPlayEpisodeInfos || []).map((ep: any) => ({
            id: String(ep.episodeId),
            no: ep.episodeNo,
            cover: ep.episodeCover,
            videoUrl: ep.playVoucher || ''
        }));

        return {
            book: normalizeNetshort(res),
            episodes
        };
    }
}

export async function searchBooks(customFetch: any, query: string): Promise<UnifiedBook[]> {
    try {
        const [dbRes, nsRes] = await Promise.all([
            customFetch(`${DB_BASE}/search?query=${query}`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${NS_BASE}/search?query=${query}`).then((r: Response) => r.ok ? r.json() : { searchCodeSearchResult: [] })
        ]);

        const dbBooks = (Array.isArray(dbRes) ? dbRes : (dbRes.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);
        const nsBooks = (nsRes.searchCodeSearchResult || [])
            .filter((item: any) => item.shortPlayId)
            .map(normalizeNetshort);

        return [...dbBooks, ...nsBooks];
    } catch (e) {
        console.error('Search failed:', e);
        return [];
    }
}

export async function fetchLatestBooks(customFetch: any): Promise<UnifiedBook[]> {
    try {
        const res = await customFetch(`${DB_BASE}/latest`).then((r: Response) => r.json());
        return (Array.isArray(res) ? res : (res?.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);
    } catch (e) {
        console.error('Fetch latest failed:', e);
        return [];
    }
}

export async function fetchTrendingBooks(customFetch: any): Promise<UnifiedBook[]> {
    try {
        const res = await customFetch(`${DB_BASE}/trending`).then((r: Response) => r.json());
        return (Array.isArray(res) ? res : (res?.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);
    } catch (e) {
        console.error('Fetch trending failed:', e);
        return [];
    }
}

export async function fetchVipContent(customFetch: any): Promise<any> {
    try {
        const res = await customFetch(`${DB_BASE}/vip`).then((r: Response) => r.json());
        const data = res?.data || res;
        return (data.columnVoList || []).map((col: any) => ({
            ...col,
            bookList: (col.bookList || [])
                .filter((item: any) => item.bookId)
                .map(normalizeDramabox)
        }));
    } catch (e) {
        console.error('Fetch VIP failed:', e);
        return [];
    }
}
