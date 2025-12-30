<script lang="ts">
    import BookCard from "$lib/components/BookCard.svelte";
    import type { HomeSection } from "$lib/types/book";
    let { data }: { data: { sections: HomeSection[] } } = $props();
</script>

<svelte:head>
    <title>Dwitabox - For You</title>
</svelte:head>

<div class="container dashboard">
    <header class="header">
        <h1>Dashboard</h1>
        <p class="subtitle">Drama Universe</p>
    </header>

    {#each data.sections as section}
        <section class="home-section">
            <h2 class="section-title">{section.title}</h2>
            <div class="grid">
                {#each section.books as book (book.id)}
                    <BookCard {book} />
                {/each}
            </div>
        </section>
    {/each}
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

    .section-title {
        margin-bottom: 1rem;
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 1.125rem;
    }
</style>
