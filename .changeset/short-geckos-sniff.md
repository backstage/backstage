---
'@backstage/cli': patch
---

Fixed an issue with the `repo lint` command where the cache key for the `--successCache` option would not properly ignore files that should be ignored according to `.eslintignore`s.
