---
'@backstage/plugin-techdocs-backend': minor
---

Added support for preserving source Markdown files alongside generated HTML in TechDocs storage, for every documentation engine. Set `techdocs.generator.preserveSources.mode` in `app-config.yaml` to `enabled` to store sources for all entities, or to `allowed` to let entities opt in with the `backstage.io/techdocs-source-storage` annotation. Source files are stored under `_sources/` and served through the existing static docs API. Changing these settings rebuilds affected sites on their next request, even when their docs are unchanged.
