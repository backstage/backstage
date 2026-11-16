---
'@backstage/frontend-plugin-api': patch
---

Added defaults for the API type parameters of `ApiRef` and `ApiFactory`, allowing
them to be used without type arguments. These forms use synchronous loading.

Deprecated `AnyApiRef` and `AnyApiFactory`. Use
`ApiRef<unknown, string, 'sync' | 'async'>` or
`ApiFactory<unknown, unknown, Record<string, unknown>, 'sync' | 'async'>` to accept
both loading modes. The deprecated aliases remain available for compatibility
and continue to accept both modes.
