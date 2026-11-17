---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added support for lazy utility API implementations. API refs can opt in with
`loading: 'async'`, allowing their factories to return promises and depend on other
async-capable APIs. `useApi` suspends while these APIs initialize.

**BREAKING PRODUCERS**: Custom `ApiHolder` implementations must return a stable
promise for a present async-capable API and `undefined` immediately for a missing
API. Synchronous refs continue returning instances directly.

`ApiRef<T>` remains synchronous by default. Its second type parameter is the ref
ID and its third records the loading mode. Use
`ApiRef<T, string, 'sync' | 'async'>` to accept either mode. Explicitly asynchronous
ref types require the `loading: 'async'` marker. Older refs without a loading marker
remain compatible with synchronous consumers. `ApiFactory<Api, Impl, Deps>` and
`TypesToApiRefs<Deps>` also remain synchronous by default.

Changing a ref from sync to async is a breaking contract change. If the ref is
not exported or exported only from its owning frontend plugin package, it is
plugin-internal and the change follows the breaking-producers policy: update the
plugin's consumers and default factory together and document the impact on custom
factories. A ref exported from a library package or any other public surface
outside the owning plugin package requires a breaking release when changed to
async.

Factories and consumers must use matching ref loading modes. Conflicts report
the API ID and, for dependencies, the dependency path. Older synchronous refs are
not automatically adapted by `useApi`. Missing dependencies fail promptly even
when another dependency is still initializing. See the utility API documentation
for the full contract and migration steps.
