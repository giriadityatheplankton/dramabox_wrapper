export type SourceType = 'db' | 'ns' | 'ml';

export interface UnifiedBook {
    id: string; // Prefixed ID (e.g. 'ns-123')
    originalId: string;
    source: SourceType;
    name: string;
    cover: string;
    introduction: string;
    tags: string[];
    playCount?: string;
    chapterCount?: number;
    status?: string;
}

export interface UnifiedEpisode {
    id: string;
    no: number;
    name?: string;
    cover?: string;
    videoUrl: string;
}

export interface HomeSection {
    title: string;
    books: UnifiedBook[];
}
