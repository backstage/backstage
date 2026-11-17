---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: `useApi` now unwraps promise-valued APIs, suspending while pending
and throwing rejection reasons to an error boundary. Its return type is
`Awaited<T>`. Existing consumers that intentionally used the promise returned by
`useApi` must use a direct holder lookup instead.

Declare lazy implementations with `ApiRef<Promise<MyApi>>`. API holders,
factories, and dependencies keep their existing contracts and pass the declared
value through unchanged.

See the [Utility API documentation](https://backstage.io/docs/frontend-system/utility-apis/creating/#lazy-api-implementations)
for lazy implementations, Suspense boundaries, and migration requirements.
