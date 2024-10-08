---
'@backstage/cli': patch
---

Added a new `--successCache` option to the `backstage-cli repo test` and `backstage-cli repo lint` commands. The cache keeps track of successful runs and avoids re-running for individual packages if they haven't changed. This option is intended only to be used in CI.

In addition a `--successCacheDir <path>` option has also been added to be able to override the default cache directory.
