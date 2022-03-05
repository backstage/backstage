---
'@backstage/plugin-catalog-react': minor
---

**BREAKING**: Removed the deprecated `useOwnUser` hook. Existing usage can be replaced with `identityApi.getBackstageIdentity()`, followed by a call to `catalogClient.getEntityByRef(identity.userEntityRef)`.
