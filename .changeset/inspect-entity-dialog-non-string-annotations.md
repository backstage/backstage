---
'@backstage/plugin-catalog-react': patch
---

Fix the Inspect Entity dialog crashing when an entity carries non-string `metadata.annotations` or `metadata.labels` values (for example a `null` value set by a programmatic catalog provider). Such values now render as their JSON-stringified form instead of throwing `TypeError: Cannot read properties of null (reading 'match')`.
