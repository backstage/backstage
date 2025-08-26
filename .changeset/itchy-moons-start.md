---
'@backstage/plugin-scaffolder': patch
---

Render a TechDocs link on the Scaffolder Template List page when templates include either `backstage.io/techdocs-ref` or `backstage.io/techdocs-entity` annotations, using the shared `buildTechDocsURL` helper. Also adds tests to verify both annotations and optional `backstage.io/techdocs-entity-path` are respected.
