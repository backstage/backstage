---
'@backstage/plugin-techdocs': patch
---

Refactor the implicit logic from `<Reader />` into an explicit state machine. This resolves some state synchronization issues when content is refreshed or rebuilt in the backend.
