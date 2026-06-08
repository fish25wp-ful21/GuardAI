# GuardAI

An advanced, ultra-lightweight, on-device mobile security companion app designed to run cleanly inside mobile sandboxed web views (like the Pi Browser) as a frontend-only React application.

## Core Pillars
1. **Zero External Dependence:** 100% on-device operation. No external backend servers, cloud databases, or API tracking.
2. **Battery & CPU Conservation:** Fine-tuned React state management utilizing memoized structures to prevent idle CPU wake-locks.
3. **Robust Cryptographic Privacy:** Client-side local data encryption using heavily-salted AES-256 blocks before local commitment.
4. **Self-Healing Architecture:** Fault-isolated Error Boundaries guaranteeing graceful recovery back to secure states in anomalous conditions.

## Deployment Setup
1. Push this exact directory layout to a secure remote repository on GitHub.
2. Connect your repository to a static hosting architecture (GitHub Pages, Vercel, or standalone IPFS static gateways).
3. Whitelist the deployed domain endpoint inside your Pi Developer Portal to bind the integrated Pi SDK handshake.
