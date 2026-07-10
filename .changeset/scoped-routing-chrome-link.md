---
'@backstage/core-components': patch
---

App chrome helpers and shared `Link` prefer the framework navigation controller when one is registered (pathname, path resolve, go-back, sidebar active-path matching, and absolute / cross-plugin targets). Without a navigation controller, behavior stays on React Router for old frontend apps. Protocol-relative `//` URLs are treated as external.
