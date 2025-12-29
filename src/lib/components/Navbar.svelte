<script lang="ts">
    import { page } from '$app/stores';
    
    let searchQuery = $state('');
    let isMenuOpen = $state(false);

    function handleSearch(e: Event) {
        e.preventDefault();
        if (searchQuery.trim()) {
            isMenuOpen = false;
            window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
        }
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }
</script>

<nav class="navbar">
    <div class="container nav-content">
        <a href="/" class="logo">Dwitabox</a>
        
        <button class="menu-btn" onclick={toggleMenu} aria-label="Toggle menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>

        <div class="nav-items" class:open={isMenuOpen}>
            <button class="close-menu-btn" onclick={closeMenu} aria-label="Close menu">&times;</button>
            <div class="links">
                <a href="/" class:active={$page.url.pathname === '/'} onclick={closeMenu}>For You</a>
                <a href="/latest" class:active={$page.url.pathname === '/latest'} onclick={closeMenu}>Latest</a>
                <a href="/trending" class:active={$page.url.pathname === '/trending'} onclick={closeMenu}>Trending</a>
                <a href="/vip" class:active={$page.url.pathname === '/vip'} onclick={closeMenu}>VIP</a>
            </div>

            <form onsubmit={handleSearch} class="search-form">
                <input 
                    type="text" 
                    placeholder="Search dramas..." 
                    bind:value={searchQuery}
                    class="search-input"
                />
            </form>
        </div>
    </div>
</nav>

<style>
    .navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 1rem 0;
    }

    .navbar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(5, 5, 5, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        z-index: -1;
    }

    .nav-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
    }

    .nav-items {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        letter-spacing: -0.5px;
        z-index: 101;
    }

    .links {
        display: flex;
        gap: 2rem;
    }

    .links a {
        font-size: 0.9375rem;
        color: var(--text-secondary);
        font-weight: 500;
        transition: color 0.2s;
    }

    .links a:hover, .links a.active {
        color: var(--text-primary);
    }

    .search-form {
        display: flex;
    }

    .search-input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 100px;
        padding: 0.5rem 1rem;
        color: var(--text-primary);
        font-family: var(--font-body);
        font-size: 0.875rem;
        width: 240px;
        transition: all 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
        background: rgba(255, 255, 255, 0.1);
    }

    .menu-btn {
        display: none;
        flex-direction: column;
        gap: 6px;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 101;
    }

    .close-menu-btn {
        display: none;
    }

    .bar {
        width: 25px;
        height: 2px;
        background-color: white;
        transition: 0.3s;
    }

    @media (max-width: 768px) {
        .menu-btn {
            display: flex;
        }

        .close-menu-btn {
            display: block;
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: none;
            border: none;
            color: white;
            font-size: 3rem;
            line-height: 1;
            cursor: pointer;
            padding: 0.5rem;
        }

        .nav-items {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000000;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .nav-items.open {
            transform: translateX(0);
        }

        .links {
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .links a {
            font-size: 1.5rem;
        }

        .search-input {
            width: 80vw;
            padding: 1rem;
            font-size: 1rem;
        }
    }
</style>
