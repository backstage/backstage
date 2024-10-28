---
'@backstage/cli': patch
---

Fixed an issue where the `--successCache` option for the `repo test` and `repo lint` commands would be include the workspace path in generated cache keys. This previously broke caching in environments where the workspace path varies across builds.
