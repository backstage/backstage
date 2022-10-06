---
'@backstage/plugin-bazaar-backend': minor
---

**BREAKING** The bazaar-backend `createRouter` now requires that the `identityApi` is passed to the router.

These changes are **required** to `packages/backend/src/plugins/bazaar.ts`

The user entity ref is now added to the members table and is taken from the requesting user using the `identityApi`.

```diff
import { PluginEnvironment } from '../types';
import { createRouter } from '@backstage/plugin-bazaar-backend';
import { Router } from 'express';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
+   identity: env.identity,
  });
}
```
