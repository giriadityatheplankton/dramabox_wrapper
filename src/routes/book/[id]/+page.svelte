<script lang="ts">
    import { page } from "$app/stores";
    import type { UnifiedBook, UnifiedEpisode } from "$lib/types/book";

    let { data }: { data: { book: UnifiedBook; episodes: UnifiedEpisode[] } } =
        $props();
    let book = $derived(data.book);

    let activeEpisode = $state<UnifiedEpisode | null>(null);

    function playEpisode(episode: UnifiedEpisode) {
        if (episode.videoUrl) {
            activeEpisode = episode;
        } else {
            alert("Video not available for this episode");
        }
    }

    function closePlayer() {
        activeEpisode = null;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") closePlayer();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
    <title>{book.name} - Dwitabox</title>
</svelte:head>

<div class="back-nav container">
    <a href="/" class="back-btn">← Back to Home</a>
</div>

<div class="hero">
    <div class="hero-bg" style="background-image: url({book.cover})"></div>
    <div class="container hero-content">
        <div class="poster">
            <img src={book.cover} alt={book.name} />
        </div>
        <div class="info">
            <h1>{book.name}</h1>
            <div class="meta">
                {#if book.playCount}
                    <span class="stat">▶ {book.playCount} Plays</span>
                {/if}
                <span class="stat">{book.chapterCount} Chapters</span>
            </div>

            <div class="tags">
                {#if book.tags}
                    {#each book.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                {/if}
            </div>

            <p class="description">{book.introduction}</p>
        </div>
    </div>
</div>

<div class="container container-episodes">
    <h2>Episodes</h2>

    {#if data.episodes.length > 0}
        <div class="episodes-grid">
            {#each data.episodes as episode}
                <button
                    onclick={() => playEpisode(episode)}
                    class="episode-card"
                    aria-label="Play Episode {episode.no}"
                >
                    <div class="episode-thumb">
                        <img src={episode.cover || book.cover} alt="" />
                        <span class="play-icon">▶</span>
                    </div>
                    <div class="episode-info">
                        <h3>
                            Episode {episode.no}
                        </h3>
                    </div>
                </button>
            {/each}
        </div>
    {:else}
        <p class="no-episodes">No episodes available.</p>
    {/if}
</div>

{#if activeEpisode}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={closePlayer}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
            <button class="close-btn" onclick={closePlayer}>&times;</button>
            <div class="video-wrapper">
                <video controls autoplay src={activeEpisode.videoUrl}>
                    <track kind="captions" />
                </video>
            </div>
            <div class="modal-info">
                <h3>
                    Episode {activeEpisode.no}
                </h3>
            </div>
        </div>
    </div>
{/if}

<style>
    .hero {
        position: relative;
        padding: 4rem 0;
        background: #000;
        overflow: hidden;
    }

    .hero-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.3;
        filter: blur(20px);
        transform: scale(1.1);
    }

    .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        gap: 3rem;
        align-items: flex-start;
    }

    .poster {
        flex-shrink: 0;
        width: 300px;
        border-radius: var(--card-radius);
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .poster img {
        width: 100%;
        display: block;
    }

    .info {
        flex: 1;
        padding-top: 1rem;
    }

    h1 {
        font-size: 3.5rem;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        background: linear-gradient(to right, #fff, #ccc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .meta {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        font-size: 1.125rem;
        color: var(--text-secondary);
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 2rem;
    }

    .tag {
        background: rgba(255, 255, 255, 0.1);
        padding: 6px 16px;
        border-radius: 100px;
        font-size: 0.875rem;
    }

    .description {
        font-size: 1.125rem;
        line-height: 1.6;
        color: #ddd;
        max-width: 800px;
    }

    .container-episodes {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .episodes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .episode-card {
        background: var(--surface-color);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.2s;
    }

    .episode-card:hover {
        transform: translateY(-4px);
        background: var(--surface-color-hover);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .episode-thumb {
        position: relative;
        aspect-ratio: 16/9;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .episode-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.7;
    }

    .play-icon {
        position: absolute;
        font-size: 2rem;
        color: white;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .episode-info {
        padding: 1rem;
    }

    .episode-info h3 {
        font-size: 1rem;
        font-weight: 500;
    }

    .no-episodes {
        color: var(--text-secondary);
        font-style: italic;
    }

    @media (max-width: 768px) {
        .hero-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 2rem;
        }

        .poster {
            width: 200px;
        }

        .meta {
            justify-content: center;
        }

        .tags {
            justify-content: center;
        }

        h1 {
            font-size: 2.5rem;
        }
    }

    .back-nav {
        padding: 1rem 0;
    }

    .back-btn {
        display: inline-flex;
        align-items: center;
        color: var(--text-secondary);
        font-weight: 500;
        transition: color 0.2s;
    }

    .back-btn:hover {
        color: var(--text-primary);
    }

    /* Override link default for button */
    button.episode-card {
        text-align: left;
        width: 100%;
        padding: 0;
        cursor: pointer;
        display: block;
        color: var(--text-primary);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Modal Styles */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .modal-content {
        position: relative;
        width: 100%;
        max-width: 1000px;
        background: var(--surface-color);
        border-radius: var(--card-radius);
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        font-size: 2rem;
        line-height: 1;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .video-wrapper {
        aspect-ratio: 16/9;
        background: black;
    }

    video {
        width: 100%;
        height: 100%;
        display: block;
    }

    .modal-info {
        padding: 1.5rem;
    }

    .modal-info h3 {
        margin: 0;
        font-size: 1.25rem;
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 100%;
        }
        .modal-backdrop {
            padding: 1rem;
        }
    }
</style>
