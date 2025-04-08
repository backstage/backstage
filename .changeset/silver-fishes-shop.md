---
'@backstage/plugin-auth-backend': patch
---

Deprecated `getDefaultOwnershipEntityRefs` in favor of the new `.resolveOwnershipEntityRefs(...)` method in the `AuthResolverContext`.

The following code in a custom sign-in resolver:

```ts
import { getDefaultOwnershipEntityRefs } from '@backstage/plugin-auth-backend';

// ...

const ent = getDefaultOwnershipEntityRefs(entity);
```

Can be replaced with the following:

```ts
const { ownershipEntityRefs: ent } = await ctx.resolveOwnershipEntityRefs(
  entity,
);
```
