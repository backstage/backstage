---
'@backstage/plugin-catalog-backend': patch
---

Reduced catalog database writes when emitted entity sets are unchanged, while preserving valid references from multiple parents. Strong sources that claim weak entities continue to replace the previous references atomically.
