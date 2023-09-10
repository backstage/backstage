---
'@backstage/repo-tools': patch
---

The `generate-catalog-info` command now uses the first listed `CODEOWNER` as Component owner when initially
creating the `catalog-info.yaml` file. It continues to allow any one listed `CODEOWNER` when updating
entity metadata.
