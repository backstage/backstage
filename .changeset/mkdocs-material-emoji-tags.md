---
'@backstage/plugin-techdocs-node': patch
---

Fixed TechDocs generation rejecting `mkdocs.yml` files that use the emoji indexes and generators or the `pymdownx.superfences` custom fence formats documented by mkdocs-material, pymdown-extensions and mkdocs-mermaid2.
