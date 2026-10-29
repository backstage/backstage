---
'@backstage/catalog-model': minor
---

Added the `backstage.io/former-names` well-known annotation, which lets an entity list the entity refs it was previously known by. `ANNOTATION_FORMER_NAMES` and `getEntityFormerRefs` were added to read it as normalized entity refs, where short refs default to the entity's own kind and namespace.
