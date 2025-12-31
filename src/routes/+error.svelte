<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="error-container">
    <div class="mesh-bg"></div>

    <div class="error-content">
        <div class="status-box">
            <h1 class="status-code">{$page.status}</h1>
            <div class="status-glow"></div>
        </div>

        <h2 class="error-title">
            {$page.status === 404
                ? "Oops! Page Not Found"
                : "Our server is taking a break"}
        </h2>

        <p class="error-message">
            {$page.error?.message ||
                "Something went wrong on our end. We are working to fix it!"}
        </p>

        <a href="/" class="home-btn">
            <span>&larr;</span> Back to Home
        </a>
    </div>
</div>

<style>
    .error-container {
        background: #050505;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
        z-index: 9999;
    }

    .mesh-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
                at 0% 0%,
                rgba(245, 78, 150, 0.15) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 100% 0%,
                rgba(135, 115, 223, 0.15) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 100% 100%,
                rgba(245, 78, 150, 0.1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 0% 100%,
                rgba(135, 115, 223, 0.1) 0px,
                transparent 50%
            );
        filter: blur(100px);
        z-index: -1;
    }

    .error-content {
        text-align: center;
        padding: 2rem;
        max-width: 500px;
        animation: fadeIn 1s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .status-box {
        position: relative;
        display: inline-block;
        margin-bottom: 2rem;
    }

    .status-code {
        font-size: clamp(8rem, 20vw, 12rem);
        font-weight: 900;
        line-height: 1;
        margin: 0;
        background: linear-gradient(
            135deg,
            #fff 0%,
            rgba(255, 255, 255, 0.4) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.05em;
        position: relative;
        z-index: 1;
    }

    .status-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150%;
        height: 150%;
        background: radial-gradient(
            circle,
            rgba(245, 78, 150, 0.2) 0%,
            transparent 70%
        );
        z-index: 0;
        animation: pulse 4s infinite ease-in-out;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
    }

    .error-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #fff;
    }

    .error-message {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 3rem;
        line-height: 1.6;
    }

    .home-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        background: #f54e96;
        color: white;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 100px;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        box-shadow: 0 10px 20px rgba(245, 78, 150, 0.3);
    }

    .home-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px rgba(245, 78, 150, 0.4);
        background: #f76ba7;
    }

    .home-btn:active {
        transform: translateY(0);
    }

    @media (max-width: 640px) {
        .error-title {
            font-size: 1.5rem;
        }
    }
</style>
