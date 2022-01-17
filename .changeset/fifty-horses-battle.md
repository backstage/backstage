---
'@backstage/core-plugin-api': minor
---

Removed deprecated `IdentityApi` methods: `getUserId`, `getIdToken`, and `getProfile`.

Existing usage of `getUserId` can be replaced by `getBackstageIdentity`, more precisely the equivalent of the previous `userId` can be retrieved like this:

```ts
import { parseEntityRef } from '@backstage/catalog-model';

const identity = await identityApi.getBackstageIdentity();
const { name: userId } = parseEntityRef(identity.userEntityRef);
```

Note that it is recommended to consume the entire `userEntityRef` rather than parsing out just the name, in order to support namespaces.

Existing usage of `getIdToken` can be replaced by `getCredentials`, like this:

```ts
const { token } = await identityApi.getCredentials();
```

And existing usage of `getProfile` is replaced by `getProfileInfo`, which returns the same profile object, but is now async.
