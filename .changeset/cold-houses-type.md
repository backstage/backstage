---
'@backstage/cli': patch
---

Introduces a new `--release` parameters to the `backstage-cli versions:bump` command.
The release can be either a specific version for example `0.99.1`, or the latest `main` or `next` release.
The default behavior is to bump the latest `main` release.
