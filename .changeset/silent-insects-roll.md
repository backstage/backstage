---
'@backstage/plugin-auth-node': patch
---

- Deprecate the `getBearerTokenFromAuthorizationHeader` function. It can be replaced with `(await identity.getIdentity({ request })).token`.
- Allow `DefaultIdentityClient` to accept tokens issued by a provided `TokenManager` to support authenticating backend tokens. To use this feature you will need to pass the `TokenManager` to the `DefaultIdentityClient` in `packages/backend/src/index.ts`

```typescript
const identity = DefaultIdentityClient.create({
  discovery,
  serverTokenManager: tokenManager,
});
```
