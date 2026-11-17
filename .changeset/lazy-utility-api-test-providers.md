---
'@backstage/frontend-test-utils': patch
---

`renderInTestApp` now handles suspended content with an empty fallback, so
promise-valued APIs do not require a Suspense wrapper in each test. Supply their
mocks as promises and use asynchronous queries such as `findByText` to await the
content. Existing synchronous APIs and mocks still render immediately. A
Suspense boundary supplied inside the test element still controls its own
fallback. Tests that relied on an ancestor boundary's loading UI may need
updated assertions.

Fixed test rendering helpers losing their test extensions when a plugin named
`test` is included in `features`.
