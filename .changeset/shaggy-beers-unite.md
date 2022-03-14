---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: The following deprecated annotation reading helper functions were removed:

- `getEntityMetadataViewUrl`, use `entity.metadata.annotations?.[ANNOTATION_VIEW_URL]` instead.
- `getEntityMetadataEditUrl`, use `entity.metadata.annotations?.[ANNOTATION_EDIT_URL]` instead.
