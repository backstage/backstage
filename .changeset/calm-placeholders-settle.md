---
'@backstage/plugin-catalog-backend': patch
---

Fixed a `Item of type "refresh" was emitted after processing had completed` warning that could appear when one of several placeholders in an entity failed to resolve. Processing now waits for all placeholders to finish before reporting the first failure.
