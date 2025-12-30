<script lang="ts">
    import BookCard from "$lib/components/BookCard.svelte";
    import type { UnifiedBook } from "$lib/types/book";
    let { data }: { data: { books: UnifiedBook[]; query: string } } = $props();
</script>

<svelte:head>
    <title>Search: {data.query} - Dwitabox</title>
</svelte:head>

<div class="container search-page">
    <header class="header">
        <h1>Search Results</h1>
        <p class="subtitle">Results for "{data.query}"</p>
    </header>

    {#if data.books.length > 0}
        <div class="grid">
            {#each data.books as book (book.id)}
                <BookCard {book} />
            {/each}
        </div>
    {:else}
        <div class="no-results">
            <p>No dramas found matching your search.</p>
        </div>
    {/if}
</div>

<style>
    .search-page {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }

    .header {
        margin-bottom: 3rem;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(to right, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1.125rem;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 0;
        color: var(--text-secondary);
        font-size: 1.125rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: var(--card-radius);
    }
</style>
