---
'@backstage/frontend-test-utils': patch
---

Add a new utility `renderTestApp` to `@backstage/frontend-test-utils` that simplifies rendering extensions within the Backstage application context for testing purposes. This utility replaces the use of `renderInTestApp` when the `extensions` option is needed.
