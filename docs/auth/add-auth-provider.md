---
id: add-auth-provider
title: Contributing New Provider Modules
description: Documentation on adding new authentication providers
---

:::note Note

The primary audience for this documentation are contributors that want to add support for new authentication providers.
While you can follow it to implement your own custom providers it is much
more advanced than using our built-in providers.

:::

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
the request and re-directs the request to the `/handler/frame` endpoint, which
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

[1.](#create-new-auth-provider-module) Create a new auth provider module

[3.](#adding-an-oauth-based-provider) or [adding a proxy auth based provider](#creating-proxy-auth-based-provider) depending on your needs.

[4.](#add-the-provider-to-the-backend) Add the provider to the backend.

### Create new auth provider module

In this example we will create auth module for a made up service named foobar.

Create a new module using `yarn new`, pick `backend-module` and provide `auth-backend` as the plugin ID and `foobar-provider` as the module ID.

Make sure that the module has the appropriate passport provider as a dependency.

```bash
cd plugins/auth-backend-backend-module-foobar-provider
yarn add passport-provider-a
yarn add @types/passport-provider-a
```

### Adding an OAuth based provider

We're then creating a new module that can extend the Auth backend using the `authProvidersExtensionPoint`.

```ts title="plugins/auth-backend-foobar-provider/src/module.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { providerAuthenticator } from './authenticator';

/** @public */
export const authModuleFoobarProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'foobar',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
      },
      async init({ providers }) {
        providers.registerProvider({
          providerId: 'foobar',
          factory: createOAuthProviderFactory({
            authenticator: providerAuthenticator,
            signInResolverFactories: {
              ...commonSignInResolvers,
            },
          }),
        });
      },
    });
  },
});
```

Now let's implement the actual authenticator for our provider using `Strategy` from a passport package.
The authenticator is responsible for creating the passport strategy and handling the authentication flow using secrets from the config file.

```ts title="plugins/auth-backend-foobar-provider/src/authenticator.ts"
import { Strategy as ProviderStrategy } from 'passport-provider-a';
import {
  createOAuthAuthenticator,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';

/** @public */
export const providerAuthenticator = createOAuthAuthenticator({
  defaultProfileTransform:
    PassportOAuthAuthenticatorHelper.defaultProfileTransform,
  scopes: {
    // Scopes required by the provider
    required: ['openid', 'email', 'profile', 'offline_access'],
  },
  initialize({ callbackUrl, config }) {
    const clientId = config.getString('clientId');
    const clientSecret = config.getString('clientSecret');

    return PassportOAuthAuthenticatorHelper.from(
      new ProviderStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          // ... other options
        },
        (
          accessToken: string,
          refreshToken: string,
          params: any,
          fullProfile: PassportProfile,
          done: PassportOAuthDoneCallback,
        ) => {
          done(
            undefined,
            { fullProfile, params, accessToken },
            { refreshToken },
          );
        },
      ),
    );
  },

  async start(input, helper) {
    return helper.start(input);
  },

  async authenticate(input, helper) {
    return helper.authenticate(input);
  },

  async refresh(input, helper) {
    return helper.refresh(input);
  },
});
```

Here are some examples of authenticators that are already implemented in the codebase:

- [Google](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-google-provider/src/authenticator.ts)
- [GitHub](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-github-provider/src/authenticator.ts)
- [Okta](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-okta-provider/src/authenticator.ts)

### Creating proxy auth based provider

A proxy auth provider is a provider that uses another provider to authenticate for example Google IAP or AWS ALB, please note that those providers are already supported by Backstage.

The implementation is similar to the OAuth provider, but the `authenticator` function is different. There are already some examples on how to implement a proxy provider in the codebase, for example [auth-backend-module-gcp-iap-provider](https://github.com/backstage/backstage/tree/master/plugins/auth-backend-module-gcp-iap-provider) and [auth-backend-module-aws-alb-provider](https://github.com/backstage/backstage/tree/master/plugins/auth-backend-module-aws-alb-provider)

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

### Add the provider to the backend

The process for adding the new module is the same as for any other type of module or backend plugin.

If this provider is internal to your installation the import path that you add to `packages/backend/src/index.ts` would be something like:

```ts
backend.add(import('@internal/plugin-auth-backend-module-foobar-provider'));
```

But if this module is contributed directly to Backstage the module would be imported as

```ts
backend.add(import('@backstage/plugin-auth-backend-module-foobar-provider'));
```

By doing this `auth-backend` automatically adds these endpoints:

```ts
router.get('/auth/providerA/start');
router.get('/auth/providerA/handler/frame');
router.post('/auth/providerA/handler/frame');
router.post('/auth/providerA/logout');
router.get('/auth/providerA/refresh'); // if supported
router.post('/auth/providerA/refresh'); // if supported
```

As you can see each endpoint is prefixed with both `/auth` and its provider
name.

### Test the new provider

You can `curl -i localhost:7007/api/auth/providerA/start` and which should
provide a `302` redirect with a `Location` header. Paste the URL from that
header into a web browser and you should be able to trigger the authorization
flow.
