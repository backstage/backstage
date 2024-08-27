---
'@backstage/backend-defaults': minor
---

**BREAKING**: The default backend instance no longer provides implementations for the identity and token manager services, which have been removed from `@backstage/backend-plugin-api`.

If you rely on plugins that still require these services, you can add them to your own backend by re-creating the service reference and factory.

The following can be used to implement the identity service:

```ts
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import {
  DefaultIdentityClient,
  IdentityApi,
} from '@backstage/plugin-auth-node';

backend.add(
  createServiceFactory({
    service: createServiceRef<IdentityApi>({ id: 'core.identity' }),
    deps: {
      discovery: coreServices.discovery,
    },
    async factory({ discovery }) {
      return DefaultIdentityClient.create({ discovery });
    },
  }),
);
```

The following can be used to implement the token manager service:

```ts
import { ServerTokenManager, TokenManager } from '@backstage/backend-common';
import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

backend.add(
  createServiceFactory({
    service: createServiceRef<TokenManager>({ id: 'core.tokenManager' }),
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
    },
    createRootContext({ config, logger }) {
      return ServerTokenManager.fromConfig(config, {
        logger,
        allowDisabledTokenManager: true,
      });
    },
    async factory(_deps, tokenManager) {
      return tokenManager;
    },
  }),
);
```
