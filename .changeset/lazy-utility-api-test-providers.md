---
'@backstage/frontend-test-utils': patch
---

Added support for async-capable utility API refs in test API tuples and nested
test API providers.

`renderInTestApp` now handles suspended content with an empty fallback, so lazy
APIs do not require a Suspense wrapper in each test. Only content that actually
suspends needs asynchronous queries such as `findByText`. Existing synchronous
APIs and mocks still render immediately and work with synchronous queries such
as `getByText`. A Suspense boundary supplied inside the test element still
controls its own fallback. Tests that previously relied on an ancestor
boundary's loading UI may need updated assertions.

Fixed test rendering helpers losing their test extensions when a plugin named
`test` is included in `features`.
