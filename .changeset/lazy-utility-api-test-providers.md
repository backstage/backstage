---
'@backstage/frontend-test-utils': patch
---

`renderInTestApp` now handles suspended content with an empty fallback, so
promise-valued APIs do not require a Suspense wrapper in each test. Supply their
mocks as promises and use asynchronous queries such as `findByText` to await the
content. Elements that do not suspend still render immediately. When a
descendant suspends, the entire element waits unless an inner Suspense boundary
isolates it. An inner boundary also controls its own fallback. Tests that relied
on an ancestor boundary's loading UI may need updated assertions.

Test API tuples accept promises that resolve to partial implementations for
promise-valued API refs.

Fixed test rendering helpers losing their test extensions when a plugin named
`test` is included in `features`.
