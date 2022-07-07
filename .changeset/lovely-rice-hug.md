---
'@backstage/catalog-client': patch
---

Updated catalog-client getEntities and getEntityByRef functions to optionally use generic typings. This prevents the need for consumers to cast the result to the specific entity sub-type (Kind).
