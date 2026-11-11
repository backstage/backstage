---
'@backstage/core-plugin-api': minor
---

Exported the alpha `TranslationRefTuple` type for messages selected by calling a translation ref. Refs are now callable functions; treat them as opaque values.

**BREAKING PRODUCERS**: Translation snapshots require `t` even when `ready` is false. Custom translation APIs must provide a translator using available messages and language fallbacks.
