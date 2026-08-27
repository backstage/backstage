---
'@backstage/plugin-techdocs-node': minor
---

Added source storage support to the TechDocs generator. When `preserveSources` is set in `GeneratorRunOptions`, the generator copies `mkdocs.yml` and the documentation source directory into a `_sources/` folder in the output alongside the generated HTML. Files matching built-in exclude patterns (`.git/`, `node_modules/`, etc.) are filtered out, and additional patterns can be provided via `sourceExcludes`.
