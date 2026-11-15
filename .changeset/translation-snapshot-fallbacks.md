---
'@backstage/frontend-plugin-api': minor
---

**BREAKING PRODUCERS**: `TranslationSnapshot` now requires `t` even when `ready` is false. Custom `TranslationApi` implementations must provide a translator using available messages and language fallbacks.
