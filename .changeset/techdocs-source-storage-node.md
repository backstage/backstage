---
'@backstage/plugin-techdocs-node': minor
---

Added `preserveTechDocsSources`, which copies the documentation sources of a generated TechDocs site into a `_sources/` folder alongside the generated HTML, together with a `manifest.json` index. It works with any documentation engine that reads `mkdocs.yml`. By default it stores the docs directory and `README.md`, and leaves out files the generated site excludes, such as hidden files and pages matched by `exclude_docs` or `draft_docs`.
