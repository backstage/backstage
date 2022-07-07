# Authentication Middleware Backend

This allows you to populate the request object with a backstage Identity based on a provider.

It can be used as follows:

```typescript
import { createMiddleware } from '@backstage/plugin-authentication-middleware-backend';

createMiddleware({
  logger,
  authenticationMiddlewareProvider: (_req: express.Request) => {
    return {
      identity: {
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: [],
        type: 'user',
      },
      token: 'asdf',
    };
  },
});
```
