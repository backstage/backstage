---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: Removed the deprecated `loadCatalogOwnerRefs` function. Usages of this function can be directly replaced with `ownershipEntityRefs` from `identityApi.getBackstageIdentity()`.

This also affects the `useEntityOwnership` hook in that it no longer uses `loadCatalogOwnerRefs`, meaning it will no longer load in additional relations and instead only rely on the `ownershipEntityRefs` from the `IdentityApi`.
