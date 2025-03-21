# Auth Module: Guest Provider

This module provides a guest auth provider implementation for `@backstage/plugin-auth-backend`. This is meant to supersede the existing `'guest'` option for authentication that does not emit tokens and is completely stored as frontend state.

## Installation

First add the package itself to your backend dependencies:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-guest-provider
```

Then import it into your backend

```ts
// In packages/backend/src/index.ts
const backend = createBackend();
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
```

> [!TIP]
> If you happen to have enabled automatic feature discovery (which is
> very uncommon at the time of writing), you do not need to perform this step.

And finally make sure to enable it in your config:

```yaml
# In app-config.yaml - NOT app-config.production.yaml
auth:
  providers:
    guest: {}
```

Notice the double curly braces, which correspond to an empty object. This sets everything up using the default settings, which are:

- The user is signed in as a user with the ref `user:development/guest`
- The user only claims ownership through that ref
- The sign in will only work in development mode; if you try to enable it in production it will refuse to sign you in for security reasons.

See [the config schema](https://github.com/backstage/backstage/blob/master/plugins/auth-backend-module-guest-provider/config.d.ts) for details about the available options. If you add options to your app-config file under the `guest` key, remember to remove the double curly braces as well.

## Links

- [Backstage](https://backstage.io)
- [Repository](https://github.com/backstage/backstage/tree/master/plugins/auth-backend-module-guest-provider)
