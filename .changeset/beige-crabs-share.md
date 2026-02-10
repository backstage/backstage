---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: Removed the `TestApiRegistry` class, use `TestApiProvider` directly instead, storing reused APIs in a variable, e.g. `const apis = [...] as const`.
