---
'@backstage/core-plugin-api': minor
---

Exported the alpha `TranslationRefTuple` type for messages selected by calling a translation ref.

**BREAKING PRODUCERS**: Translation snapshots always include `t`, even when `ready` is false. Custom translation API implementations must provide a translator on loading snapshots using the available messages and language fallbacks.
