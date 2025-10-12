---
'@backstage/backend-app-api': patch
---

Moved up registration of unhandled rejections and errors listeners to be done as early as possible, avoiding flakiness in backend startups and instead always logging these failures rather than sometimes crashing the process.
