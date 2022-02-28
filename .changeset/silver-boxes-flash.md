---
'@backstage/plugin-catalog-react': patch
---

**BREAKING**: Moved **DefaultStarredEntitiesApi** to `@backstage/plugin-catalog`. If you were using this in tests, you can use the new `MockStarredEntitiesApi` from `@backstage/plugin-catalog-react` instead.

Fixed a risky behavior where `DefaultStarredEntitiesApi` forwarded values to observers that were later mutated.

Removed the `isStarred` method from `DefaultStarredEntitiesApi`, as it is not part of the `StarredEntitiesApi`.
