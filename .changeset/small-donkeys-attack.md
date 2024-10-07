---
'@backstage/cli': patch
---

Added a new `--successCache` option to the `backstage-cli repo lint` command. The cache keeps track of successful lint runs and avoids re-running linting of individual packages if they haven't changed. This option is primarily intended to be used in CI.

In addition a `--successCacheDir` option has also been added to be able to override the default cache directory.
