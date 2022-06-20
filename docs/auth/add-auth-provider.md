---
id: add-auth-provider
title: Contributing New Providers
description: Documentation on adding new authentication providers
---

> NOTE: The primary audience for this documentation are contributors to the main
> Backstage project that want to add support for new authentication providers.
> While you can follow it to implement your own custom providers it is much
> more advanced than using our built-in providers.

## How Does Authentication Work?

The Backstage application can use various external authentication providers for
authentication. An external provider is wrapped using an
`AuthProviderRouteHandlers` interface for handling authentication. This
interface consists of four methods. Each of these methods is hosted at an
endpoint (by default) `/api/auth/[provider]/method`, where `method` performs a
certain operation as follows:

```
  /auth/[provider]/start -> Initiate a login from the web page
  /auth/[provider]/handler/frame -> Handle a finished authentication operation
  /auth/[provider]/refresh -> Refresh the validity of a login
  /auth/[provider]/logout -> Log out a logged-in user
```

The flow is as follows:

1. A user attempts to sign in.
2. A popup window is opened, pointing to the `auth` endpoint. That endpoint does
   initial preparations and then re-directs the user to an external
   authenticator, still inside the popup.
3. The authenticator validates the user and returns the result of the validation
   (success OR failure), to the wrapper's endpoint (`handler/frame`).
4. The `handler/frame` rendered webpage will issue the appropriate response to
   the webpage that opened the popup window, and the popup is closed.
5. The user signs out by clicking on a UI interface and the webpage makes a
   request to logout the user.

## Implementing Your Own Auth Wrapper

The core interface of any auth wrapper is the `AuthProviderRouteHandlers`
interface. This interface has four methods corresponding to the API described in
the initial section. Any auth wrapper will have to implement this interface.

When initiating a login, a pop-up window is created by the frontend, to allow
the user to initiate a login. This login request is done to the `/start`
endpoint which is handled by the `start` method.

The `start` method re-directs to the external auth provider who authenticates
the request and re-directs the request to the `/frame/handler` endpoint, which
is handled by the `frameHandler` method.

The `frameHandler` returns an HTML response, containing a script that does a
`postMessage` to the frontend window, containing the result of the request.
The `WebMessageResponse` type is the message sent by the `postMessage` to the
frontend.

A `postMessageResponse` utility function wraps the logic of generating a
`postMessage` response that ensures that CORS is successfully handled. This
function takes an `express.Response`, a `WebMessageResponse` and the URL of the
frontend (`appOrigin`) as parameters and return an HTML page with the script and
the message.

There is a helper class for [OAuth2](https://oauth.net/2/) based authentication providers, [OAuthAdapter](../reference/plugin-auth-backend.oauthadapter.md). This class implements the `AuthProviderRouteHandlers` interface
for you, and instead requires you to implement [OAuthHandlers](../reference/plugin-auth-backend.oauthhandlers.md), which
is significantly easier.

### Auth Environment Separation

The concept of an `env` is core to the way the auth backend works. It uses an
`env` query parameter to identify the environment in which the application is
running (`development`, `staging`, `production`, etc). Each runtime can
simultaneously support multiple environments at the same time and the right
handler for each request is identified and dispatched to, based on the `env`
parameter.

`OAuthEnvironmentHandler` is a utility wrapper for an `OAuthHandlers` that
implements the `AuthProviderRouteHandlers` interface while supporting multiple
`env`s.

To instantiate OAuth providers (the same but for different environments), use
`OAuthEnvironmentHandler.mapConfig`. It's a helper to iterate over a
configuration object that is a map of environments to configurations. See one of
the existing OAuth providers for an example of how it is used.

Given the following configuration:

```yaml
development:
  clientId: abc
  clientSecret: secret
production:
  clientId: xyz
  clientSecret: supersecret
```

The `OAuthEnvironmentHandler.mapConfig(config, envConfig => ...)` call will
split the config by the top level `development` and `production` keys, and pass
on each block as `envConfig`.

For convenience, the `AuthProviderFactory` is a factory function that has to be
implemented which can then generate a `AuthProviderRouteHandlers` for a given
provider.

All of the supported providers provide an `AuthProviderFactory` that returns an
`OAuthEnvironmentHandler`, capable of handling authentication for multiple
environments.

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

### Adding an OAuth based provider

If we're adding an `OAuth` based provider we would implement the
`OAuthHandlers` interface. By implementing this
interface we can use the `OAuthProvider` class provided by `lib/oauth`, meaning
we don't need to implement the full
`AuthProviderRouteHandlers` interface that providers
otherwise need to implement.

The provider class takes the provider's options as a class parameter. It also
imports the `Strategy` from the passport package.

```ts
import { Strategy as ProviderAStrategy } from 'passport-provider-a';

export type ProviderAProviderOptions = OAuthProviderOptions & {
  // extra options here
}

export class ProviderAAuthProvider implements OAuthHandlers {
  private readonly _strategy: ProviderAStrategy;

  constructor(options: ProviderAProviderOptions) {
    this._strategy = new ProviderAStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false,
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

### Adding an non-OAuth based provider

An non-`OAuth` based provider could implement
`AuthProviderRouteHandlers` instead.

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

#### Integration Wrapper

Each provider exports an object that provides a way to create new instances
of the provider, along with related utilities like predefined sign-in resolvers.

The object is created using `createAuthProviderIntegration`, with the most
important part being the `create` method that acts as the factory function
for our provider.

The factory should return an implementation of `AuthProviderFactory`, which
passes in a object with utilities for configuration, logging, token issuing,
etc. The factory should return an implementation of
`AuthProviderRouteHandlers`.

The factory is what decides the mapping from
[static configuration](../conf/index.md) to the creation of auth providers. For
example, OAuth providers use `OAuthEnvironmentHandler` to allow for multiple
different configurations, one for each environment, which looks like this;

```ts
export const okta = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        // read options from config
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');

        // Use provided auth handler, or create a default one
        const authHandler: AuthHandler<OAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ fullProfile, params }) => ({
              profile: makeProfileInfo(fullProfile, params.id_token),
            });

        // instantiate our OAuthHandlers implementation
        const provider = new OktaAuthProvider({
          audience,
          clientId,
          clientSecret,
          callbackUrl,
          authHandler,
          signInResolver: options?.signIn?.resolver,
          resolverContext,
        });

        // Wrap the OAuthHandlers with OAuthProvider, which implements AuthProviderRouteHandlers
        return OAuthProvider.fromConfig(globalConfig, provider, {
          providerId,
          tokenIssuer,
        });
      });
  },
  resolvers: {
    /**
     * Looks up the user by matching their email local part to the entity name.
     */
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,

    // ... additional predefined resolvers
  },
});
```

The purpose of the different environments is to allow for a single auth-backend
to serve as the authentication service for multiple different frontend
environments, such as local development, staging, and production.

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
the factory function of each provider. You need to import the factory
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

You can `curl -i localhost:7007/api/auth/providerA/start` and which should
provide a `302` redirect with a `Location` header. Paste the URL from that
header into a web browser and you should be able to trigger the authorization
flow.
