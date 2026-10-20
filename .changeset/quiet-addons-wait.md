---
'@backstage/plugin-techdocs-react': patch
---

Isolated TechDocs addons in individual Suspense boundaries so that a lazy addon no longer hides the surrounding reader while it loads.
