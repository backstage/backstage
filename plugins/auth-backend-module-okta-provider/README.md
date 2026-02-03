# Auth Module: Okta Provider

This module provides an Okta auth provider implementation for `@backstage/plugin-auth-backend`.

## Utilization

This module is used in `auth-backend/src/providers/okta`

```ts
import { oktaAuthenticator } from '@backstage/plugin-auth-backend-module-okta-provider';

export const okta = createAuthProviderIntegration({
  create({
    authHandler?: AuthHandler<OAuthResult>,

    signIn?: {
      resolver: SignInResolver<OAuthResult>,
    },
  }) {
    return createOAuthProviderFactory({
      authenticator: oktaAuthenticator,
    });
  },
});
```

## Links

- [Repository](https://github.com/backstage/backstage/tree/master/plugins/auth-backend-module-okta-provider)
- [Backstage Project Homepage](https://backstage.io)
