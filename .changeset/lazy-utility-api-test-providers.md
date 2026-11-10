---
'@backstage/frontend-test-utils': patch
---

Added support for async-capable utility API refs in test API tuples and nested
test API providers.

`renderInTestApp` now handles suspended content with an empty fallback, so lazy
APIs do not require a Suspense wrapper in each test. Use asynchronous queries
such as `findByText` to await the content. A Suspense boundary supplied inside
the test element still controls its own fallback. Tests that previously relied
on an ancestor boundary's loading UI may need updated assertions.

Fixed test rendering helpers losing their test extensions when a plugin named
`test` is included in `features`.
