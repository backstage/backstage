---
'@backstage/plugin-techdocs-backend-module-zensical': minor
---

New module that adds [Zensical](https://zensical.org) as a TechDocs documentation engine. Install it in your backend and opt entities in with the `backstage.io/techdocs-engine: zensical` annotation, or make it the default with `techdocs.generator.defaultEngine: zensical`. Builds reuse the same `mkdocs.yml` sanitization as the MkDocs engine, produce a search index in the format the TechDocs collator expects, and run in the `ghcr.io/backstage/techdocs-zensical` image by default (override with `techdocs.generator.zensical.dockerImage`).
