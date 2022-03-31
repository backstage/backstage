---
'@backstage/plugin-catalog-backend': patch
---

Fixes #10348

The set of things to stitch was too narrow - entities that _lose_ their ref to a
thing because that target was reprocessed, should also be stitched again.
