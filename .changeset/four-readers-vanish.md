---
'@backstage/plugin-auth-node': patch
---

Added `AuthResolverContext.resolveOwnershipEntityRefs` as a way of accessing the default ownership resolution logic in sign-in resolvers, replacing `getDefaultOwnershipEntityRefs` from `@backstage/plugin-auth-backend`.
