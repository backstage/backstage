---
'@backstage/cli': patch
---

Fixed an issue with the `--successCache` flag for `repo test` where the tree hash for the wrong package directory would sometimes be used to generate the cache key.
