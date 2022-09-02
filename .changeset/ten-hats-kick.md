---
'@backstage/plugin-badges-backend': patch
---

The badges plugin can now make use of the new `IdentityApi` to retrieve the user token.

To uptake this change you will need to edit `packages/backend/src/plugins/badges.ts` and add the identity option.

```typescript
import {
  createRouter,
  createDefaultBadgeFactories,
} from '@backstage/plugin-badges-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    discovery: env.discovery,
    badgeFactories: createDefaultBadgeFactories(),
    identity: env.identity,
  });
}
```
