---
'@backstage/create-app': patch
---

Adds `IdentityApi` configuration to `create-app` scaffolding templates.

To migrate to the new `IdentityApi`, edit the `packages/backend/src/index.ts` adding the following import:

```typescript
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
```

Use the factory function to create an `IdentityApi` in the `makeCreateEnv` function and return it from the
function as follows:

```typescript
function makeCreateEnv(config: Config) {
...
  const identity = DefaultIdentityClient.create({
    discovery,
  });
...

  return {
    ...,
    identity
  }
}
```

Backend plugins can be upgraded to work with this new `IdentityApi`.

Add `identity` to the `RouterOptions` type.

```typescript
export interface RouterOptions {
  ...
  identity: IdentityApi;
}
```

Then you can use the `IdentityApi` from the plugin.

```typescript
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { identity } = options;

  router.get('/user', async (req, res) => {
    const user = await identity.getIdentity({ request: req });
    ...
```
