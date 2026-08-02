---
'@backstage/plugin-techdocs-backend': minor
---

Added support for preserving source Markdown files alongside generated HTML in TechDocs storage. You can enable this globally via `techdocs.generator.preserveSources.enabled` in `app-config.yaml`, or per entity with the `backstage.io/techdocs-source-storage` annotation. Source files are stored under `_sources/` and served through the existing static docs API.
