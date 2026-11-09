---
'@backstage/frontend-plugin-api': minor
---

**BREAKING PRODUCERS**: `TranslationSnapshot` now always includes `t`, including when `ready` is false. Custom `TranslationApi` implementations must provide a translator on loading snapshots, using available messages and language fallbacks. Existing consumers can continue checking `ready` before rendering, or use `t` immediately for synchronous fallback text.
