# Authenticate API requests

The Backstage backend APIs are by default available without authentication. To avoid evil-doers from accessing or modifying data, one might use a network protection mechanism such as a firewall or an authenticating reverse proxy. For Backstage instances that are available on the Internet one can instead use the experimental IdentityClient as outlined below.

API requests from frontend plugins include an authorization header with a Backstage identity token acquired when the user logs in. By adding a middleware that verifies said token to be valid and signed by Backstage, non-authenticated requests can be blocked with a 401 Unauthorized response.

Note that this means Backstage will stop working for guests, as no token is issued for them.

Caveat: as of writing this, Backstage does not refresh the identity token so eventually users will get a 401 response on API calls (not on loading the web page as only the API calls are authenticated) and have to logout/login again to get a new token.

```typescript
// packages/backend/src/index.ts from a create-app deployment

import { Request, Response, NextFunction } from 'express';
import { IdentityClient } from '@backstage/plugin-auth-backend';

// ...

async function main() {
  // ...

  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = new IdentityClient({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });
  const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = IdentityClient.getBearerToken(req.headers.authorization);
      req.user = await identity.authenticate(token);
      next();
    } catch (error) {
      res.status(401).send(`Unauthorized`);
    }
  };

  const apiRouter = Router();
  // The auth route must be publically available as it is used during login
  apiRouter.use('/auth', await auth(authEnv));
  // Only authenticated requests are allowed to the routes below
  apiRouter.use('/catalog', authMiddleware, await catalog(catalogEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/proxy', authMiddleware, await proxy(proxyEnv));
  apiRouter.use(authMiddleware, notFoundHandler());

  // ...
}
```
