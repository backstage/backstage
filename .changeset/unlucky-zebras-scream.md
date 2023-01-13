---
'@backstage/plugin-tech-insights-backend': patch
---

Modifies database cleanup to remove all facts for entities instead of hand-picked ones only. Improves query execution a lot in large datasets.
Changes semantics of the lifecycle deletion logic slightly for cases were historical entities/facts, that are , not present in the application anymore, were kept forever instead of being cleaned up. The new implementation is more along the expected lines.
