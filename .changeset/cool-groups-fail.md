---
'@backstage/backend-defaults': patch
---

`GithubUrlReader`'s search detects glob-patterns supported by `minimatch`, instead of just detecting
`*` and `?` characters.

For example, this allows to search for patterns like `{C,c}atalog-info.yaml`.
