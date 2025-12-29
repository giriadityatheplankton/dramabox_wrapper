<script lang="ts">
    import BookCard from '$lib/components/BookCard.svelte';
    let { data } = $props();
</script>

<svelte:head>
    <title>Search: {data.query} - Dramabox</title>
</svelte:head>

<div class="container dashboard">
    <header class="header">
        <h1>Search Results</h1>
        <p class="subtitle">
            {#if data.query}
                Found {data.books.length} results for "{data.query}"
            {:else}
                Enter a search term to find dramas
            {/if}
        </p>
    </header>

    {#if data.books.length > 0}
        <div class="grid">
            {#each data.books as book (book.bookId)}
                <BookCard {book} />
            {/each}
        </div>
    {:else if data.query}
        <div class="empty-state">
            <p>No results found for "{data.query}"</p>
        </div>
    {/if}
</div>

<style>
    .dashboard {
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
