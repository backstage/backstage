---
'@backstage/frontend-test-utils': patch
---

`renderInTestApp` now handles suspended content with an empty fallback, so
promise-valued APIs do not require a Suspense wrapper in each test. Use asynchronous
queries such as `findByText` to await suspended content. Elements that do not
suspend still render immediately. When a descendant suspends, the entire element
waits unless an inner Suspense boundary
isolates it. An inner boundary also controls its own fallback. Tests that relied
on an ancestor boundary's loading UI may need updated assertions.

Test API tuples for promise-valued refs accept both synchronous partial
implementations and promises of partial implementations. Synchronous mocks render
immediately and pass through unchanged. Use promise mocks to test loading,
failures, or code that calls promise methods.

Fixed test rendering helpers losing their test extensions when a plugin named
`test` is included in `features`.
