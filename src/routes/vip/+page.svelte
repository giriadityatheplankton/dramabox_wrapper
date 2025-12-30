<script lang="ts">
    import BookCard from "$lib/components/BookCard.svelte";
    import type { UnifiedBook } from "$lib/types/book";

    interface Column {
        columnId: number;
        title: string;
        subTitle: string;
        style: string;
        bookList: UnifiedBook[];
    }

    let { data }: { data: { columns: Column[] } } = $props();
</script>

<svelte:head>
    <title>VIP - Dwitabox</title>
</svelte:head>

<div class="container page-header">
    <h1>VIP Originals</h1>
</div>

<div class="container">
    {#each data.columns as column}
        {#if column.bookList && column.bookList.length > 0}
            <section class="column-section">
                <h2>{column.title}</h2>
                <div class="grid">
                    {#each column.bookList as book}
                        <div class="card-wrapper">
                            <BookCard {book} />
                        </div>
                    {/each}
                </div>
            </section>
        {/if}
    {/each}
</div>

<style>
    .page-header {
        padding: 2rem 0;
        text-align: center;
    }

    h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        background: linear-gradient(to right, #f54e96, #ff8ba7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
    }

    .column-section {
        margin-bottom: 4rem;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        padding-left: 1rem;
        border-left: 4px solid var(--primary-color);
    }
</style>
