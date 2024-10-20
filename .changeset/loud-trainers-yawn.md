---
'@backstage/cli': patch
---

The `--successCache` option for the `repo test` and `repo lint` commands now use an additive store that keeps old entries around for a week before they are cleaned up automatically.
