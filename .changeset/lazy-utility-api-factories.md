---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added support for lazy utility API implementations. API refs can opt in with
`loading: 'async'`, allowing their factories to return promises and depend on other
async-capable APIs. `useApi` suspends while these APIs initialize.

**BREAKING PRODUCERS**: Custom `ApiHolder` implementations must support async-capable
refs by returning a stable promise for a present API and `undefined` immediately
for a missing API. Synchronous refs continue returning instances directly.

`ApiRef<T>` remains synchronous by default. Its optional third type parameter
records the loading mode, while the second parameter remains the ref ID. Use
`AnyApiRef<T>` to accept either loading mode, including in generic helpers that
preserve the lookup result type.

Explicitly asynchronous ref types require the `loading: 'async'` marker. Older
refs without a loading marker remain compatible with synchronous consumers.
`ApiFactory<Api, Impl, Deps>` and `TypesToApiRefs<Deps>` also remain synchronous
by default, while `AnyApiFactory` accepts either loading mode.

Missing utility API dependencies fail promptly even when a sibling dependency
is still initializing.

`useApi` also supports older synchronous refs when their registered implementation
has migrated to async loading. Existing synchronous factories remain compatible
with async-capable refs. Direct synchronous lookups and synchronous factory
dependencies that require an async implementation report actionable migration
errors.
