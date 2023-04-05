---
'@backstage/plugin-vault': patch
---

Use `fetchApi` instead of raw `fetch` in order to pass auth header if necessary.
