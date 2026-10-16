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
  Registered by id against `secretProviderServiceRef` (root scoped, multiton).
- **`SecretResolverService`** — plugin-scoped service that routes a reference to
  the matching provider and returns a `ResolvedSecret` handle
  (`value`, optional `expiresAt`, optional async `dispose()`).

The resolver never logs or persists the reference payload or the resolved value;
only non-sensitive metadata (provider id, consuming plugin id) is emitted.

## Registering a provider

A provider is a service factory bound to `secretProviderServiceRef`. Because the
ref is a root-scoped multiton, several providers can be registered side by side
and each is selected by its `id`:

```ts
import {
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import { secretProviderServiceRef } from '@internal/secrets-node';

export const myProviderFactory = createServiceFactory({
  service: secretProviderServiceRef,
  deps: { config: coreServices.rootConfig, logger: coreServices.rootLogger },
  async factory({ config, logger }) {
    return new MyProvider({ config, logger }); // implements SecretProvider
  },
});
```

## Resolving a secret

A consumer depends on `secretResolverServiceRef` and disposes the handle at its
own lifecycle boundary:

```ts
import { secretResolverServiceRef } from '@internal/secrets-node';

const handle = await secrets.resolve({
  reference: { provider: 'my-provider', reference: { key: 'ci-token' } },
});
try {
  await useToken(handle.value);
} finally {
  await handle.dispose?.();
}
```

`resolve` handles a single reference. A consumer that resolves several references
is responsible for disposing the handles it already holds if a later resolve
fails.
