#---
'@backstage/plugin-catalog-react': major
'@backstage/plugin-catalog': major

---

**BREAKING**: The `StarredEntitiesApi` interface method `starredEntitie$` has been renamed to `starredEntities$` to fix a longstanding typo. Implementers of `StarredEntitiesApi` and any code calling this method directly must be updated.
