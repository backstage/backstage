---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: Deleted the deprecated `loadIdentityOwnerRefs` function which is replaced by `ownershipEntityRefs` from `identityApi.getBackstageIdentity()`.

Deprecated the `loadCatalogOwnerRefs` hook as membership references should be added as `ent` inside `claims` sections of the `SignInResolver` when issuing tokens. See https://backstage.io/docs/auth/identity-resolver for more details on how to prepare your `SignInResolver` if not done already. Usage of the `loadCatalogOwnerRefs` hook should be replaced by `ownershipEntityRefs` from `identityApi.getBackstageIdentity()` instead.
