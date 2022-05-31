---
'@backstage/plugin-search-backend-node': patch
---

Fixed a bug that prevented `TestPipeline.withSubject` from identifying valid `Readable` subjects that were technically transform streams.
