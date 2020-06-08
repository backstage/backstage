# Adding authentication providers

## Passport

We chose [Passport](http://www.passportjs.org/) as our authentication platform due to its comprehensive set of supported authentication [strategies](http://www.passportjs.org/packages/).

## How to add a new strategy provider

### Quick guide

[1.](#installing-the-dependencies) Install the passport-js based provider package.

[2.](#create-implementation) Create a new folder structure for the provider.

[3.](#adding-an-oauth-based-provider) Implement the provider, extending the suitable framework if needed.

[4.](#hook-it-up-to-the-backend) Add the provider to the backend.

### Installing the dependencies:

```bash
cd plugins/auth-backend
yarn add passport-provider-a
yarn add @types/passport-provider-a
```

### Create implementation

Make a new folder with the name of the provider following the below file structure:

```bash
plugins/auth-backend/src/providers/providerA
├── index.ts
└── provider.ts
```

**`plugins/auth-backend/src/providers/providerA/provider.ts`** defines the provider class which implements a handler for the chosen framework.

#### Adding an OAuth based provider

If we're adding an `OAuth` based provider we would implement the [OAuthProviderHandlers](#OAuthProviderHandlers) interface.

The provider class takes the provider's configuration as a class parameter. It also imports the `Strategy` from the passport package.

```ts
import { Strategy as ProviderAStrategy } from 'passport-provider-a';

export class ProviderAAuthProvider implements OAuthProviderHandlers {
  private readonly providerConfig: AuthProviderConfig;
  private readonly _strategy: ProviderAStrategy;

  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
    this._strategy = new ProviderAStrategy(
      { ...providerConfig.options },
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async handler() {}
}
```

#### Adding an non-OAuth based provider

_**Note**: We have prioritized OAuth-based providers and non-OAuth providers should be considered experimental._

An non-`OAuth` based provider could implement [AuthProviderRouteHandlers](#AuthProviderRouteHandlers) instead.

```ts
export class ProviderAAuthProvider implements AuthProviderRouteHandlers {
  private readonly providerConfig: AuthProviderConfig;
  private readonly _strategy: ProviderAStrategy;

  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
    this._strategy = new ProviderAStrategy(
      { ...providerConfig.options },
      verifyFunction, // See the "Verify Callback" section
    );
  }

  async start() {}
  async frameHandler() {}
  async logout() {}
  async refresh() {} // If supported
}
```

#### Create method

Each provider exports a create method that creates the provider instance, optionally extending a supported authorization framework. This method exists to allow for flexibility if additional frameworks are supported in the future.

Implementing OAuth by returning an instance of `OAuthProvider` based of the provider's class:

```ts
export function createProviderAProvider(config: AuthProviderConfig) {
  const provider = new ProviderAAuthProvider(config);
  const oauthProvider = new OAuthProvider(provider, config.provider, true);
  return oauthProvider;
}
```

Not extending with OAuth, the main difference here is that the create method is returning a instance of the class without adding the OAuth authorization framework to it.

```ts
export function createProviderAProvider(config: AuthProviderConfig) {
  return new ProviderAAuthProvider(config);
}
```

#### Verify Callback

> Strategies require what is known as a verify callback. The purpose of a verify callback is to find the user that possesses a set of credentials.
> When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments [...]. If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.
>
> If the credentials are not valid (for example, if the password is incorrect), done should be invoked with false instead of a user to indicate an authentication failure.
>
> http://www.passportjs.org/docs/configure/

**`plugins/auth-backend/src/providers/providerA/index.ts`** is simply re-exporting the create method to be used for hooking the provider up to the backend.

```ts
export { createProviderAProvider } from './provider';
```

### Hook it up to the backend

**`plugins/auth-backend/src/providers/config.ts`** The provider needs to be configured properly so you need to add it to the list of configured providers, all of which implement [AuthProviderConfig](#AuthProviderConfig):

```ts
export const providers = [
  {
    provider: 'providerA',  # used as an identifier
    options: { ... },       # consult the provider documentation for which options you should provide
    disableRefresh: true    # if the provider lacks refresh tokens
  },
```

**`plugins/auth-backend/src/providers/factories.ts`** When the `auth-backend` starts it sets up routing for all the available providers by calling `createAuthProviderRouter` on each provider. You need to import the create method from the provider and add it to the factory:

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

As you can see each endpoint is prefixed with both `/auth` and its provider name.

### Test the new provider

You can `curl -i localhost:7000/auth/providerA/start` and which should provide a `302` redirect with a `Location` header. Paste the url from that header into a web browser and you should be able to trigger the authorization flow.

---

##### OAuthProviderHandlers

```ts
export interface OAuthProviderHandlers {
  start(req: express.Request, options: any): Promise<any>;
  handler(req: express.Request): Promise<any>;
  refresh?(refreshToken: string, scope: string): Promise<any>;
  logout?(): Promise<any>;
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

##### AuthProviderConfig

```ts
export type AuthProviderConfig = {
  provider: string;
  options: any;
  disableRefresh?: boolean;
};
```
