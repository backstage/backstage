---
'@backstage/frontend-plugin-api': patch
---

Added defaults for the API type parameters of `ApiRef` and `ApiFactory`, allowing
them to be used without type arguments. `ApiRef` defaults to synchronous loading,
while `ApiFactory` accepts both synchronous and asynchronous factories.

Factory creation still infers the loading mode from the ref. Code that consumes
an explicitly annotated `ApiFactory` may need to await its result, or specify
`'sync'` as the fourth type parameter when synchronous behavior is required.

Deprecated `AnyApiRef` and `AnyApiFactory`. Use
`ApiRef<unknown, string, 'sync' | 'async'>` to accept either ref loading mode, and
`ApiFactory` without type arguments to accept either factory loading mode. The
deprecated aliases remain available for compatibility.
