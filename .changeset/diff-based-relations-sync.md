---
'@backstage/plugin-catalog-backend': patch
---

Replaced the delete-all and reinsert pattern for the `relations` table with a diff-based sync that only touches rows that actually changed. In steady state (the common case), zero writes occur, eliminating write churn, dead tuples, and WAL traffic from the processing path. Stitching is now also skipped for relation neighbors that did not change.
