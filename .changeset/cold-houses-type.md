---
'@backstage/cli': patch
---

Introduces two new parameters to the `backstage-cli versions:bump` command.
The first one is `--release-line <main|next>` bump packages to the latest `main` or `next` release.
`--backstage-release <version>` is used to bump packages to a specific backstage release.
