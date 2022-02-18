---
'@backstage/plugin-catalog-react': patch
---

Fixed a risky behavior where `DefaultStarredEntitiesApi` forwarded values to observers that were later mutated.

Removed the `isStarred` method from `DefaultStarredEntitiesApi`, as it is not part of the `StarredEntitiesApi`.
