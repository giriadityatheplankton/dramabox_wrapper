<script lang="ts">
    import type { UnifiedBook } from "$lib/types/book";

    let { book }: { book: UnifiedBook } = $props();
</script>

<div class="card-container" class:coming-soon={book.status === "coming_soon"}>
    {#if book.status === "coming_soon"}
        <div class="card disabled">
            <div class="card-image">
                <img src={book.cover} alt={book.name} loading="lazy" />
                <div class="coming-soon-overlay">
                    <span class="coming-soon-text">Coming Soon</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="title">{book.name}</h3>
                <div class="tags">
                    {#each (book.tags || []).slice(0, 3) as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
                <p class="intro">
                    {(book.introduction || "").slice(0, 80)}...
                </p>
            </div>
        </div>
    {:else}
        <a href="/book/{book.id}" class="card">
            <div class="card-image">
                <img src={book.cover} alt={book.name} loading="lazy" />
                <div class="overlay">
                    <span class="play-count">▶ {book.playCount}</span>
                </div>
            </div>
            <div class="card-content">
                <h3 class="title">{book.name}</h3>
                <div class="tags">
                    {#each (book.tags || []).slice(0, 3) as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
                <p class="intro">
                    {(book.introduction || "").slice(0, 80)}...
                </p>
            </div>
        </a>
    {/if}
</div>

<style>
    .card {
        background: var(--surface-color);
        border-radius: var(--card-radius);
        overflow: hidden;
        transition:
            transform var(--transition-speed) ease,
            box-shadow var(--transition-speed) ease;
        border: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 255, 255, 0.1);
        background: var(--surface-color-hover);
    }

    .card-image {
        position: relative;
        aspect-ratio: 2/3;
        overflow: hidden;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .card:hover .card-image img {
        transform: scale(1.05);
    }

    .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        display: flex;
        align-items: flex-end;
    }

    .play-count {
        font-size: 0.875rem;
        color: white;
        font-weight: 500;
        background: rgba(0, 0, 0, 0.6);
        padding: 4px 8px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
    }

    .card-content {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex: 1;
    }

    .title {
        font-size: 1.125rem;
        line-height: 1.4;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tag {
        font-size: 0.75rem;
        color: var(--text-secondary);
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 8px;
        border-radius: 100px;
        white-space: nowrap;
    }

    .intro {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-container.coming-soon {
        cursor: not-allowed;
    }

    .card.disabled {
        opacity: 0.7;
        filter: grayscale(0.5);
    }

    .coming-soon-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
    }

    .coming-soon-text {
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        padding: 0.5rem 1rem;
        border: 2px solid white;
        border-radius: 4px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.05);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.8;
        }
    }
</style>
