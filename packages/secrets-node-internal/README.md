# @internal/secrets-node

This is an internal package used by other backend packages. It is not published
to NPM, but instead inlined into consuming packages through the
`backstage.inline` flag in `package.json`. The contract is experimental and may
change until it graduates to a published API.

It provides a provider-agnostic way for backend plugins to resolve an
administrator-configured secret reference to a live value at runtime, without
each consumer re-implementing provider wiring. The package ships the contract, a
default resolver service, and the service references used to register
providers — but no real provider.

## Concepts

- **`SecretReference`** — `{ provider, reference }`. `provider` selects a
  registered provider by id; `reference` is an opaque, provider-specific payload
  that only that provider interprets.
- **`SecretProvider`** — resolves a provider-specific reference to a value.
  Registered by id against `secretProviderServiceRef` (plugin scoped, multiton).
- **`SecretsService`** — plugin-scoped service that routes a reference to the
  matching provider and returns a `ResolvedSecret` handle
  (`value`, optional `expiresAt`, optional async `dispose()`).

The resolver never logs or persists the reference payload or the resolved value;
only non-sensitive metadata (provider id) is emitted. The plugin-scoped logger
provides the plugin context.

## Registering a provider

A provider is a service factory bound to `secretProviderServiceRef`. Because the
ref is a plugin-scoped multiton, several providers can be registered side by
side, and each plugin receives its own provider instances selected by `id`:

```ts
import {
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import { secretProviderServiceRef } from '@internal/secrets-node';

export const myProviderFactory = createServiceFactory({
  service: secretProviderServiceRef,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ config, logger, pluginMetadata }) {
    return new MyProvider({
      config,
      logger,
      pluginId: pluginMetadata.getId(),
    }); // implements SecretProvider
  },
});
```

Providers that need the consuming plugin's identity inject
`coreServices.pluginMetadata`; the resolver does not pass it on the request.

## Resolving a secret

A consumer injects `secretsServiceRef` as a dependency and disposes the
handle at its own lifecycle boundary. Always obtain the resolver through
dependency injection rather than constructing one by hand. The plugin-scoped
resolver routes through that plugin's own provider instances:

```ts
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { secretsServiceRef } from '@internal/secrets-node';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: { secrets: secretsServiceRef },
      async init({ secrets }) {
        const handle = await secrets.resolve({
          reference: {
            provider: 'my-provider',
            reference: { key: 'ci-token' },
          },
        });
        try {
          await useToken(handle.value);
        } finally {
          await handle.dispose?.();
        }
      },
    });
  },
});
```

`resolve` handles a single reference. A consumer that resolves several references
is responsible for disposing the handles it already holds if a later resolve
fails.
