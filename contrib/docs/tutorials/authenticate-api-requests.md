# Authenticate API requests

The Backstage backend APIs are by default available without authentication. To avoid evil-doers from accessing or modifying data, one might use a network protection mechanism such as a firewall or an authenticating reverse proxy. For Backstage instances that are available on the Internet one can instead use the experimental IdentityClient as outlined below.

API requests from frontend plugins include an authorization header with a Backstage identity token acquired when the user logs in. By adding a middleware that verifies said token to be valid and signed by Backstage, non-authenticated requests can be blocked with a 401 Unauthorized response.

**NOTE**: Enabling this means that Backstage will stop working for guests, as no token is issued for them. If you have not done so already, you will also need to implement [service-to-service auth](https://backstage.io/docs/auth/service-to-service-auth).

As techdocs HTML pages load assets without an Authorization header the code below also sets a token cookie when the user logs in (and when the token is about to expire).

## Old Backend System Setup

Create `packages/backend/src/authMiddleware.ts`:

```typescript
import type { Config } from '@backstage/config';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import { decodeJwt } from 'jose';
import { URL } from 'url';
import { PluginEnvironment } from './types';

function setTokenCookie(
  res: Response,
  options: { token: string; secure: boolean; cookieDomain: string },
) {
  try {
    const payload = decodeJwt(options.token);
    res.cookie('token', options.token, {
      expires: new Date(payload.exp ? payload.exp * 1000 : 0),
      secure: options.secure,
      sameSite: 'lax',
      domain: options.cookieDomain,
      path: '/',
      httpOnly: true,
    });
  } catch (_err) {
    // Ignore
  }
}

export const createAuthMiddleware = async (
  config: Config,
  appEnv: PluginEnvironment,
) => {
  const baseUrl = config.getString('backend.baseUrl');
  const secure = baseUrl.startsWith('https://');
  const cookieDomain = new URL(baseUrl).hostname;
  const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token =
        getBearerTokenFromAuthorizationHeader(req.headers.authorization) ||
        (req.cookies?.token as string | undefined);
      if (!token) {
        res.status(401).send('Unauthorized');
        return;
      }
      try {
        req.user = await appEnv.identity.getIdentity({ request: req });
      } catch {
        await appEnv.tokenManager.authenticate(token);
      }
      if (!req.headers.authorization) {
        // Authorization header may be forwarded by plugin requests
        req.headers.authorization = `Bearer ${token}`;
      }
      if (token && token !== req.cookies?.token) {
        setTokenCookie(res, {
          token,
          secure,
          cookieDomain,
        });
      }
      next();
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  };
  return authMiddleware;
};
```

Install cookie-parser:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add cookie-parser
```

Update routes in `packages/backend/src/index.ts`:

```typescript
// packages/backend/src/index.ts from a create-app deployment

import { createAuthMiddleware } from './authMiddleware';
import cookieParser from 'cookie-parser';

// ...

async function main() {
  // ...

  const authMiddleware = await createAuthMiddleware(config, appEnv);

  const apiRouter = Router();
  apiRouter.use(cookieParser());
  // The auth route must be publicly available as it is used during login
  apiRouter.use('/auth', await auth(authEnv));
  // Add a simple endpoint to be used when setting a token cookie
  apiRouter.use('/cookie', authMiddleware, (_req, res) => {
    res.status(200).send(`Coming right up`);
  });
  // Only authenticated requests are allowed to the routes below
  apiRouter.use('/catalog', authMiddleware, await catalog(catalogEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/proxy', authMiddleware, await proxy(proxyEnv));
  apiRouter.use(authMiddleware, notFoundHandler());

  // ...
}
```

## New Backend System Setup

Create `packages/backend/src/authMiddlewareFactory.ts`:

```typescript
import { HostDiscovery } from '@backstage/backend-app-api';
import { ServerTokenManager } from '@backstage/backend-common';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import {
  DefaultIdentityClient,
  getBearerTokenFromAuthorizationHeader,
} from '@backstage/plugin-auth-node';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { decodeJwt } from 'jose';
import lzstring from 'lz-string';
import { URL } from 'url';

type AuthMiddlewareFactoryOptions = {
  config: RootConfigService;
  logger: LoggerService;
};

export const authMiddlewareFactory = ({
  config,
  logger,
}: AuthMiddlewareFactoryOptions): RequestHandler => {
  const baseUrl = config.getString('backend.baseUrl');
  const discovery = HostDiscovery.fromConfig(config);
  const identity = DefaultIdentityClient.create({ discovery });
  const tokenManager = ServerTokenManager.fromConfig(config, { logger });

  return async (req: Request, res: Response, next: NextFunction) => {
    const fullPath = `${req.baseUrl}${req.path}`;

    // Only apply auth to /api routes & skip auth for the following endpoints
    // Add any additional plugin routes you want to whitelist eg. events
    const nonAuthWhitelist = ['app', 'auth'];
    const nonAuthRegex = new RegExp(
      `^\/api\/(${nonAuthWhitelist.join('|')})(?=\/|$)\S*`,
    );
    if (!fullPath.startsWith('/api/') || nonAuthRegex.test(fullPath)) {
      next();
      return;
    }

    try {
      // Token cookies are compressed to reduce size
      const cookieToken = lzstring.decompressFromEncodedURIComponent(
        req.cookies.token,
      );
      const token =
        getBearerTokenFromAuthorizationHeader(req.headers.authorization) ??
        cookieToken;

      try {
        // Attempt to authenticate as a frontend request token
        await identity.authenticate(token);
      } catch (err) {
        // Attempt to authenticate as a backend request token
        await tokenManager.authenticate(token);
      }

      if (!req.headers.authorization) {
        // Authorization header may be forwarded by plugin requests
        req.headers.authorization = `Bearer ${token}`;
      }

      if (token !== cookieToken) {
        try {
          const payload = decodeJwt(token);
          res.cookie('token', token, {
            // Compress token to reduce cookie size
            encode: lzstring.compressToEncodedURIComponent,
            expires: new Date((payload?.exp ?? 0) * 1000),
            secure: baseUrl.startsWith('https://'),
            sameSite: 'lax',
            domain: new URL(baseUrl).hostname,
            path: '/',
            httpOnly: true,
          });
        } catch {
          // Ignore
        }
      }
      next();
    } catch {
      res.status(401).send(`Unauthorized`);
    }
  };
};
```

Install cookie-parser:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add cookie-parser @types/cookie-parser
```

Create a custom configured `rootHttpRouterService` in `packages/backend/src/customRootHttpRouterService.ts`:

```typescript
import { rootHttpRouterServiceFactory } from '@backstage/backend-app-api';
import cookieParser from 'cookie-parser';
import { authMiddlewareFactory } from './authMiddlewareFactory';

export default rootHttpRouterServiceFactory({
  configure: ({ app, config, logger, middleware, routes }) => {
    app.use(middleware.helmet());
    app.use(middleware.cors());
    app.use(middleware.compression());
    app.use(cookieParser());
    app.use(middleware.logging());

    app.use(authMiddlewareFactory({ config, logger }));

    // Simple handler to set auth cookie for user
    app.use('/api/cookie', (_, res) => {
      res.status(200).send();
    });

    app.use(routes);

    app.use(middleware.notFound());
    app.use(middleware.error());
  },
});
```

Update `packages/backend/src/index.ts` to add the custom `rootHttpRouterService` and override the default:

```typescript
// ...
const backend = createBackend();

backend.add(import('./customRootHttpRouterService'));

// ...
```

## Frontend Setup

Create `packages/app/src/cookieAuth.ts`:

```typescript
import type { IdentityApi } from '@backstage/core-plugin-api';

// Parses supplied JWT token and returns the payload
function parseJwt(token: string): { exp: number } {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(
        c =>
          // eslint-disable-next-line prefer-template
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
      )
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// Returns milliseconds until the supplied JWT token expires
function msUntilExpiry(token: string): number {
  const payload = parseJwt(token);
  const remaining =
    new Date(payload.exp * 1000).getTime() - new Date().getTime();
  return remaining;
}

// Calls the specified url regularly using an auth token to set a token cookie
// to authorize regular HTTP requests when loading techdocs
export async function setTokenCookie(url: string, identityApi: IdentityApi) {
  const { token } = await identityApi.getCredentials();
  if (!token) {
    return;
  }

  await fetch(url, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Call this function again a few minutes before the token expires
  const ms = msUntilExpiry(token) - 4 * 60 * 1000;
  setTimeout(
    () => {
      setTokenCookie(url, identityApi);
    },
    ms > 0 ? ms : 10000,
  );
}
```

```typescript
// required types and packages for example below

import type { IdentityApi } from '@backstage/core-plugin-api';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';

// additional packages/app/src/App.tsx from a create-app deployment

import { setTokenCookie } from './cookieAuth';

// ...

const app = createApp({
  // ...

  components: {
    SignInPage: props => {
      const discoveryApi = useApi(discoveryApiRef);
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
          onSignInSuccess={async (identityApi: IdentityApi) => {
            setTokenCookie(
              await discoveryApi.getBaseUrl('cookie'),
              identityApi,
            );

            props.onSignInSuccess(identityApi);
          }}
        />
      );
    },
  },

  // ...
});

// ...
```

**NOTE**: Most Backstage frontend plugins come with the support for the `IdentityApi`.
In case you already have a dozen of internal ones, you may need to update those too.
Assuming you follow the common plugin structure, the changes to your front-end may look like:

```diff
// plugins/internal-plugin/src/api.ts
-  import { createApiRef } from '@backstage/core-plugin-api';
+  import { createApiRef, IdentityApi } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
// ...

type MyApiOptions = {
    configApi: Config;
+   identityApi: IdentityApi;
    // ...
}

interface MyInterface {
    getData(): Promise<MyData[]>;
}

export class MyApi implements MyInterface {
    private configApi: Config;
+   private identityApi: IdentityApi;
    // ...

    constructor(options: MyApiOptions) {
        this.configApi = options.configApi;
+       this.identityApi = options.identityApi;
    }

    async getMyData() {
        const backendUrl = this.configApi.getString('backend.baseUrl');

+       const { token } = await this.identityApi.getCredentials();
        const requestUrl = `${backendUrl}/api/data/`;
-       const response = await fetch(requestUrl);
+       const response = await fetch(
          requestUrl,
          { headers: { Authorization: `Bearer ${token}` } },
        );
    // ...
   }
```

and

```diff
// plugins/internal-plugin/src/plugin.ts

import {
    configApiRef,
    createApiFactory,
    createPlugin,
+   identityApiRef,
} from '@backstage/core-plugin-api';
import { myPluginPageRouteRef } from './routeRefs';
import { MyApi, myApiRef } from './api';

export const plugin = createPlugin({
    id: 'my-plugin',
    routes: {
        mainPage: myPluginPageRouteRef,
    },
    apis: [
        createApiFactory({
            api: myApiRef,
            deps: {
                configApi: configApiRef,
+               identityApi: identityApiRef,
            },
-           factory: ({ configApi }) =>
-               new MyApi({ configApi }),
+           factory: ({ configApi, identityApi }) =>
+               new MyApi({ configApi, identityApi }),
        }),
    ],
});
```
