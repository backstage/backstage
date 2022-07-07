---
'@backstage/plugin-authentication-middleware-backend': patch
---

This adds the authentication middleware. It reads the request and adds the identity to
the express request for use by the downstream plugins.

```typescript
import { RequestHandler } from 'express';
import { PluginEnvironment } from '../types';
import {
  createMiddleware,
  jwtMiddlewareProvider,
} from '@backstage/plugin-authentication-middleware-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<RequestHandler> {
  return await createMiddleware({
    logger: env.logger,
    authenticationMiddlewareProvider: jwtMiddlewareProvider,
  });
}
```

In `packages/backend/index.ts`, somewhere close to the top of the stack.

```typescript
  ...
  const authenticationMiddlewareEnv = useHotMemoize(module, () =>
    createEnv('authentication-middleware'),
  );
  ...
  const apiRouter = Router();
  apiRouter.use(await authenticationMiddleware(authenticationMiddlewareEnv));
```

In the backend plugins you can access the identity as follows:

```typescript
router.get('/something', async (req: AuthenticatedBackstageRequest, res) => {
  const identity = req.backstage?.identity;
  res.send(identity);
});
```
