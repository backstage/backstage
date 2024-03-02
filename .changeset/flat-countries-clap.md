---
'@backstage/repo-tools': minor
---

Adds 2 new commands `repo schema openapi check` and `package schema openapi check`. `repo schema openapi check` is intended to power a new breaking changes check on pull requests and the package level command allows plugin developers to quickly see new API breaking changes.They're intended to be used in complement with the existing `repo schema openapi verify` command to validate your OpenAPI spec against a variety of things.
