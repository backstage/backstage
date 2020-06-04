# Adding authentication providers

## Passport

We chose [Passport](http://www.passportjs.org/) as authentication platform due to its comprehensive set of supported authentication [strategies](http://www.passportjs.org/packages/).

## How to add a new strategy provider

### Installing the dependencies:

```bash
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

**`plugins/auth-backend/src/providers/providerA/provider.ts`** defines the provider class which implements an handler for the chosen framework. If we're adding an `OAuth` based provider we would implement the [OAuthProviderHandlers](#OAuthProviderHandlers) interface for instance. An non `OAuth` based provider would implement [AuthProviderRouteHandlers](#AuthProviderRouteHandlers).

The provider class takes the providers configuration as a class parameter. It also imports the `Strategy` from the passport package.

```ts
import { Strategy as ProviderAStrategy } from 'passport-provider-a';

export class ProviderAAuthProvider implements OAuthProviderHandlers {
  private readonly providerConfig: AuthProviderConfig;
  private readonly _strategy: ProviderAStrategy;

  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
    this._strategy = new ProviderAStrategy({...})
  }

  async start() {}
  async handler() {}
}

/*
* Method that creates the provider instance, optionally extending a supported authorization framework.
* This method exists to allow for flexibility if additional frameworks are supported in the future.
*/
export function createProviderAProvider(config: AuthProviderConfig) {
  const provider = new ProviderAAuthProvider(config);
  const oauthProvider = new OAuthProvider(provider, config.provider, true);
  return oauthProvider;
}
```

**`plugins/auth-backend/src/providers/providerA/index.ts`** is simply re-exporting the create method to be used for hooking the provider up to the backend.

```ts
export { createProviderAProvider } from './provider';
```

### Hook it up to the backend

**`plugins/auth-backend/src/providers/config.ts`** The provider needs to be configured properly so you need to add it to the list of configured providers, all of which implements [AuthProviderConfig](#AuthProviderConfig):

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

By doing this `auth-backend` automatically adds the these endpoints:

```ts
router.get('/auth/providerA/start');
router.get('/auth/providerA/handler/frame');
router.post('/auth/providerA/handler/frame');
router.post('/auth/providerA/logout');
router.get('/auth/providerA/refresh'); // if supported
```

As you can see each endpoint is prefixed with both `/auth` and its provider name.

### To summarize

1. Install the passport-js based provider package in `plugins/auth-backend`
2. Create a new folder structure in `plugins/auth-backend/src/providers/`
3. Implement the provider extending the suitable framework if needed
4. Add the configuration for the provider to the list of provider configurations
5. Add the create method to the factory object

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
