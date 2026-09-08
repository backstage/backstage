---
'@backstage/catalog-model': patch
---

Fixed compiled catalog model schemas so that each kind, `apiVersion`, and spec type combination always gets a unique JSON Schema `$id`, even when the underlying schema document is reused across versions. Previously, two different schemas could end up sharing the same `$id`, which could cause validators that cache compiled schemas by `$id` (such as a shared Ajv instance) to fail when compiling the second schema.
