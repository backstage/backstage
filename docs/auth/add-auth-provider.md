---
id: add-auth-provider
title: Adding authentication providers
description: Documentation on Adding authentication providers
---

## Passport

We chose [Passport](http://www.passportjs.org/) as our authentication platform
due to its comprehensive set of supported authentication
[strategies](http://www.passportjs.org/packages/).

## How to add a new strategy provider

### Quick guide

[1.](#installing-the-dependencies) Install the passport-js based provider
package.

[2.](#create-implementation) Create a new folder structure for the provider.

[3.](#adding-an-oauth-based-provider) Implement the provider, extending the
suitable framework if needed.

[4.](#hook-it-up-to-the-backend) Add the provider to the backend.

### Installing the dependencies:

```bash
cd plugins/auth-backend
yarn add passport-provider-a
yarn add @types/passport-provider-a
```

### Create implementation

Make a new folder with the name of the provider following the below file
structure:

```bash
plugins/auth-backend/src/providers/providerA
├── index.ts
└── provider.ts
```

**`plugins/auth-backend/src/providers/providerA/provider.ts`** defines the
provider class which implements a handler for the chosen framework.

#### Adding an OAuth based provider

If we're adding an `OAuth` based provider we would implement the
[OAuthProviderHandlers](#OAuthProviderHandlers) interface. By implementing this
interface we can use the `OAuthProvider` class provided by `lib/oauth`, meaning
we don't need to implement the full
[AuthProviderRouteHandlers](#AuthProviderRouteHandlers) interface that providers
otherwise need to implement.

The provider class takes the provider's options as a class parameter. It also
imports the `Strategy` from the passport package.

```ts
import { Strategy as ProviderAStrategy } from 'passport-provider-a';

export type ProviderAProviderOptions = OAuthProviderOptions & {
  // extra options here
}

export class ProviderAAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: ProviderAStrategy;

  constructor(options: ProviderAProviderOptions) {
    this._strategy = new ProviderAStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false as true,
        response_type: 'code',
        /// ... etc
      }
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async handler() {}
}
```

#### Adding an non-OAuth based provider

_**Note**: We have prioritized OAuth-based providers and non-OAuth providers
should be considered experimental._

An non-`OAuth` based provider could implement
[AuthProviderRouteHandlers](#AuthProviderRouteHandlers) instead.

```ts
type ProviderAOptions = {
  // ...
};

export class ProviderAAuthProvider implements AuthProviderRouteHandlers {
  private readonly _strategy: ProviderAStrategy;

  constructor(options: ProviderAOptions) {
    this._strategy = new ProviderAStrategy(
      {
        // ...
      },
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async frameHandler() {}
  async logout() {}
  async refresh() {} // If supported
}
```

#### Factory function

Each provider exports a factory function that instantiates the provider. The
factory should implement [AuthProviderFactory](#AuthProviderFactory), which
passes in a object with utilities for configuration, logging, token issuing,
etc. The factory should return an implementation of
[AuthProviderRouteHandlers](#AuthProviderRouteHandlers).

The factory is what decides the mapping from
[static configuration](../conf/index.md) to the creation of auth providers. For
example, OAuth providers use `OAuthEnvironmentHandler` to allow for multiple
different configurations, one for each environment, which looks like this;

```ts
export const createOktaProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    // read options from config
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');

    // instantiate our OAuthProviderHandlers implementation
    const provider = new OktaAuthProvider({
      audience,
      clientId,
      clientSecret,
      callbackUrl,
    });

    // Wrap the OAuthProviderHandlers with OAuthProvider, which implements AuthProviderRouteHandlers
    return OAuthProvider.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
```

The purpose of the different environments is to allow for a single auth-backend
to serve as the authentication service for multiple different frontend
environments, such as local development, staging, and production.

The factory function for other providers can be a lot simpler, as they might not
have configuration for each environment. Looking something like this:

```ts
export const createProviderAProvider: AuthProviderFactory = ({ config }) => {
  const a = config.getString('a');
  const b = config.getString('b');

  return new ProviderAAuthProvider({ a, b });
};
```

#### Verify Callback

> Strategies require what is known as a verify callback. The purpose of a verify
> callback is to find the user that possesses a set of credentials. When
> Passport authenticates a request, it parses the credentials contained in the
> request. It then invokes the verify callback with those credentials as
> arguments [...]. If the credentials are valid, the verify callback invokes
> done to supply Passport with the user that authenticated.
>
> If the credentials are not valid (for example, if the password is incorrect),
> done should be invoked with false instead of a user to indicate an
> authentication failure.
>
> http://www.passportjs.org/docs/configure/

**`plugins/auth-backend/src/providers/providerA/index.ts`** is simply
re-exporting the factory function to be used for hooking the provider up to the
backend.

```ts
export { createProviderAProvider } from './provider';
```

### Hook it up to the backend

**`plugins/auth-backend/src/providers/factories.ts`** When the `auth-backend`
starts it sets up routing for all the available providers by calling
`createAuthProviderRouter` on each provider. You need to import the factory
function from the provider and add it to the factory:

```ts
import { createProviderAProvider } from './providerA';

const factories: { [providerId: string]: AuthProviderFactory } = {
  providerA: createProviderAProvider,
};
```

By doing this `auth-backend` automatically adds these endpoints:

```ts
router.get('/auth/providerA/start');
router.get('/auth/providerA/handler/frame');
router.post('/auth/providerA/handler/frame');
router.post('/auth/providerA/logout');
router.get('/auth/providerA/refresh'); // if supported
```

As you can see each endpoint is prefixed with both `/auth` and its provider
name.

### Test the new provider

You can `curl -i localhost:7000/api/auth/providerA/start` and which should
provide a `302` redirect with a `Location` header. Paste the url from that
header into a web browser and you should be able to trigger the authorization
flow.

---

##### OAuthProviderHandlers

```ts
export interface OAuthProviderHandlers {
  start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo>;
  handler(req: express.Request): Promise<{
    response: AuthResponse<OAuthProviderInfo>;
    refreshToken?: string;
  }>;
  refresh?(
    refreshToken: string,
    scope: string,
  ): Promise<AuthResponse<OAuthProviderInfo>>;
  logout?(): Promise<void>;
}
```

##### AuthProviderRouteHandlers

```ts
export interface AuthProviderRouteHandlers {
  start(req: express.Request, res: express.Response): Promise<any>;
  frameHandler(req: express.Request, res: express.Response): Promise<any>;
  refresh?(req: express.Request, res: express.Response): Promise<any>;
  logout(req: express.Request, res: express.Response): Promise<any>;
}
```

##### AuthProviderFactory

```ts
export type AuthProviderFactoryOptions = {
  globalConfig: AuthProviderConfig;
  config: Config;
  logger: Logger;
  tokenIssuer: TokenIssuer;
};

export type AuthProviderFactory = (
  options: AuthProviderFactoryOptions,
) => AuthProviderRouteHandlers;
```
