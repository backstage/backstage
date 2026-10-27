---
'@backstage/plugin-techdocs-node': patch
---

Only rewrite `mkdocs.yml` when sanitization actually removed something. An
already-clean config is now left untouched instead of being round-tripped
through `yaml.dump`, which stripped comments and reordered keys on every
`techdocs-cli generate`.
