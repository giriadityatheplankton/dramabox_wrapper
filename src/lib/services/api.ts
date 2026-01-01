import type { UnifiedBook, UnifiedEpisode, HomeSection, SourceType } from '$lib/types/book';

const DB_BASE = 'https://dramabox.sansekai.my.id/api/dramabox';
const NS_BASE = 'https://netshort.sansekai.my.id/api/netshort';
const ML_BASE = 'https://api.sansekai.my.id/api/melolo';
const ML_STREAM_BASE = 'https://api.sansekai.my.id/api/melolo/stream';

class InMemoryCache {
    private cache: Map<string, { data: any; expiry: number }> = new Map();
    private duration: number = 10 * 60 * 1000; // 10 minutes

    get(key: string): any {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        console.log(`[CACHE HIT] ${key}`);
        return item.data;
    }

    set(key: string, data: any): void {
        console.log(`[CACHE MISS] Setting ${key}`);
        this.cache.set(key, {
            data,
            expiry: Date.now() + this.duration
        });
    }
}

const apiCache = new InMemoryCache();

export const isNetshort = (id: string) => id.startsWith('ns-');
export const isMelolo = (id: string) => id.startsWith('ml-');
export const getCleanId = (id: string) => {
    if (id.startsWith('ns-')) return id.replace('ns-', '');
    if (id.startsWith('ml-')) return id.replace('ml-', '');
    return id;
};

function stripHtml(text: string): string {
    return (text || "").replace(/<\/?[^>]+(>|$)/g, "");
}

function getProxiedImage(url: string | undefined): string {
    if (!url) return '';
    if (url.includes('.heic')) {
        // Use wsrv.nl to proxy and convert HEIC to WebP
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
    }
    return url;
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
    if (!item) {
        return {
            id: 'unknown',
            originalId: '',
            source: 'ns',
            name: 'Unknown Title',
            cover: '',
            introduction: '',
            tags: [],
            playCount: '',
            chapterCount: 0
        };
    }
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

export function normalizeMelolo(item: any): UnifiedBook {
    if (!item) {
        return {
            id: 'unknown',
            originalId: '',
            source: 'ml',
            name: 'Unknown Title',
            cover: '',
            introduction: '',
            tags: [],
            playCount: '',
            chapterCount: 0
        };
    }

    let tags: string[] = [];
    try {
        if (item.category_info) {
            const parsed = JSON.parse(item.category_info);
            tags = Array.isArray(parsed) ? parsed.map((c: any) => c.Name) : [];
        } else if (item.category_schema) {
            const parsed = JSON.parse(item.category_schema);
            tags = Array.isArray(parsed) ? parsed.map((c: any) => c.name) : [];
        }
    } catch (e) {
        console.warn('Failed to parse Melolo tags', e);
    }

    return {
        id: `ml-${item.book_id || item.series_id_str || item.series_id}`,
        originalId: String(item.book_id || item.series_id_str || item.series_id),
        source: 'ml',
        name: stripHtml(item.book_name || item.series_title),
        cover: getProxiedImage(item.thumb_url || item.series_cover),
        introduction: item.abstract || item.series_intro || '',
        tags: tags,
        playCount: item.read_count || item.series_play_cnt,
        chapterCount: item.serial_count || item.episode_cnt
    };
}

export async function fetchHomeSections(customFetch: any): Promise<HomeSection[]> {
    const cacheKey = 'home_sections';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const sections: HomeSection[] = [];

    try {
        const [dbRes, nsRes, mlLatestRes, mlTrendingRes] = await Promise.all([
            customFetch(`${DB_BASE}/foryou`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${NS_BASE}/theaters`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${ML_BASE}/latest`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${ML_BASE}/trending`).then((r: Response) => r.ok ? r.json() : [])
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

        // Melolo sections
        console.log('mlLatestRes keys:', Object.keys(mlLatestRes || {}));
        const mlLatestBooks = (mlLatestRes?.books || [])
            .filter((item: any) => item.book_id)
            .map(normalizeMelolo);
        if (mlLatestBooks.length > 0) {
            sections.push({
                title: 'Melolo - Terbaru',
                books: mlLatestBooks
            });
        }

        const mlTrendingBooks = (mlTrendingRes?.books || [])
            .filter((item: any) => item.book_id)
            .map(normalizeMelolo);
        if (mlTrendingBooks.length > 0) {
            sections.push({
                title: 'Melolo - Trending',
                books: mlTrendingBooks
            });
        }
    } catch (e) {
        console.error('Fetch home failed:', e);
    }

    if (sections.length > 0) {
        apiCache.set(cacheKey, sections);
    }
    return sections;
}

export async function fetchBookDetail(customFetch: any, id: string): Promise<{ book: UnifiedBook, episodes: UnifiedEpisode[] }> {
    const cacheKey = `book_detail_${id}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const cleanId = getCleanId(id);

    if (isMelolo(id)) {
        try {
            console.log(`[DEBUG] Fetching Melolo detail for ID: ${id}, Clean ID: ${cleanId}`);
            const res = await customFetch(`${ML_BASE}/detail?bookId=${cleanId}`).then((r: Response) => r.ok ? r.json() : null);

            if (res?.code !== 0 && res?.message) {
                console.warn(`Melolo API error for ${cleanId}: ${res.message}`);
                return {
                    book: {
                        id: id,
                        originalId: cleanId,
                        source: 'ml',
                        name: 'Content Unavailable',
                        cover: '',
                        introduction: `This content is no longer available on Melolo (Error ${res.code}: ${res.message})`,
                        tags: []
                    },
                    episodes: []
                };
            }

            const data = res?.data?.video_data || res?.data || {};
            const videoList = data.video_list || data.episode_list || [];

            console.log(`[DEBUG] Found ${videoList.length} episodes for Melolo book ${cleanId}`);

            const episodes = videoList.map((ep: any) => ({
                id: String(ep.vid || ep.episode_id),
                no: ep.vid_index || ep.episode_no || ep.no,
                name: ep.title || ep.episode_name,
                cover: getProxiedImage(ep.episode_cover || ep.cover),
                videoUrl: '' // Fetched on demand
            }));

            const result = {
                book: normalizeMelolo(data),
                episodes
            };
            apiCache.set(cacheKey, result);
            return result;
        } catch (e) {
            console.error('Fetch Melolo detail failed:', e);
            throw e;
        }
    } else if (isNetshort(id)) {
        const res = await customFetch(`${NS_BASE}/allepisode?shortPlayId=${cleanId}`).then((r: Response) => r.ok ? r.json() : null);

        if (!res) {
            return {
                book: normalizeNetshort(null),
                episodes: []
            };
        }

        const episodes = (res.shortPlayEpisodeInfos || []).map((ep: any) => ({
            id: String(ep.episodeId),
            no: ep.episodeNo,
            cover: ep.episodeCover,
            videoUrl: ep.playVoucher || ''
        }));

        const result = {
            book: normalizeNetshort(res),
            episodes
        };
        apiCache.set(cacheKey, result);
        return result;
    } else {
        // Dramabox
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
                id: String(ep.episodeId || ep.chapterId || ep.chapterIndex || index),
                no: ep.episodeNo || ep.orderNo || ep.episode_no || ep.no || (index + 1),
                name: ep.episodeName,
                cover: ep.episodeCover,
                videoUrl
            };
        });

        const result = {
            book: normalizeDramabox(detail),
            episodes
        };
        apiCache.set(cacheKey, result);
        return result;
    }
}

export async function searchBooks(customFetch: any, query: string): Promise<UnifiedBook[]> {
    try {
        const [dbRes, nsRes, mlRes] = await Promise.all([
            customFetch(`${DB_BASE}/search?query=${query}`).then((r: Response) => r.ok ? r.json() : []),
            customFetch(`${NS_BASE}/search?query=${query}`).then((r: Response) => r.ok ? r.json() : { searchCodeSearchResult: [] }),
            customFetch(`${ML_BASE}/search?query=${query}`).then((r: Response) => r.ok ? r.json() : { data: { search_data: [] } })
        ]);

        const dbBooks = (Array.isArray(dbRes) ? dbRes : (dbRes.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);
        const nsBooks = (nsRes.searchCodeSearchResult || [])
            .filter((item: any) => item.shortPlayId)
            .map(normalizeNetshort);

        const mlBooks = (mlRes?.data?.search_data || [])
            .flatMap((group: any) => group.books || [])
            .filter((item: any) => item.book_id)
            .map(normalizeMelolo);

        return [...dbBooks, ...nsBooks, ...mlBooks];
    } catch (e) {
        console.error('Search failed:', e);
        return [];
    }
}

export async function fetchLatestBooks(customFetch: any): Promise<UnifiedBook[]> {
    const cacheKey = 'latest_books';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
        const res = await customFetch(`${DB_BASE}/latest`).then((r: Response) => r.json());
        const result = (Array.isArray(res) ? res : (res?.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);

        if (result.length > 0) apiCache.set(cacheKey, result);
        return result;
    } catch (e) {
        console.error('Fetch latest failed:', e);
        return [];
    }
}

export async function fetchTrendingBooks(customFetch: any): Promise<UnifiedBook[]> {
    const cacheKey = 'trending_books';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
        const res = await customFetch(`${DB_BASE}/trending`).then((r: Response) => r.json());
        const result = (Array.isArray(res) ? res : (res?.data || []))
            .filter((item: any) => item.bookId)
            .map(normalizeDramabox);

        if (result.length > 0) apiCache.set(cacheKey, result);
        return result;
    } catch (e) {
        console.error('Fetch trending failed:', e);
        return [];
    }
}

export async function fetchVipContent(customFetch: any): Promise<any> {
    const cacheKey = 'vip_content';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    try {
        const res = await customFetch(`${DB_BASE}/vip`).then((r: Response) => r.json());
        const data = res?.data || res;
        const result = (data.columnVoList || []).map((col: any) => ({
            ...col,
            bookList: (col.bookList || [])
                .filter((item: any) => item.bookId)
                .map(normalizeDramabox)
        }));

        if (result.length > 0) apiCache.set(cacheKey, result);
        return result;
    } catch (e) {
        console.error('Fetch VIP failed:', e);
        return [];
    }
}

export async function fetchMeloloStream(customFetch: any, videoId: string): Promise<string> {
    try {
        // Use local proxy in browser to avoid CORS issues
        const isBrowser = typeof window !== 'undefined';
        const url = isBrowser
            ? `/api/melolo/stream/${videoId}`
            : `${ML_STREAM_BASE}?videoId=${videoId}`;

        const res = await customFetch(url).then((r: Response) => r.json());
        let streamUrl = res?.data?.main_url || res?.data?.backup_url || '';

        // Force https to avoid mixed content issues
        if (streamUrl.startsWith('http://')) {
            streamUrl = streamUrl.replace('http://', 'https://');
        }

        return streamUrl;
    } catch (e) {
        console.error('Fetch Melolo stream failed:', e);
        return '';
    }
}
