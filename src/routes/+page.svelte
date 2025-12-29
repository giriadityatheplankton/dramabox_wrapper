<script lang="ts">
    import BookCard from '$lib/components/BookCard.svelte';
    let { data } = $props();
</script>

<svelte:head>
    <title>Dwitabox - For You</title>
</svelte:head>

<div class="container dashboard">
    <header class="header">
        <h1>For You</h1>
        <p class="subtitle">Trending dramas selected for you</p>
    </header>

    <div class="grid">
        {#each data.books as book (book.bookId)}
            <BookCard {book} />
        {/each}
    </div>
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
</style>
