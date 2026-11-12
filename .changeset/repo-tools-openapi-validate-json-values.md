---
'@backstage/repo-tools': patch
---

`backstage-repo-tools repo schema openapi validate` no longer reports a mismatch for YAML values that JSON can't represent, such as `.nan`.
