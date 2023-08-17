---
'@backstage/repo-tools': patch
---

Fixed a bug with the `generate-catalog-info` command that could cause the `--dry-run` flag to indicate changes to files when no changes would actually be made if the command were run without the flag.
