---
'@backstage/plugin-techdocs-node': patch
---

Only rewrite `mkdocs.yml` when sanitization actually removed something, or when the source uses YAML anchors, aliases, merge keys or tags.
