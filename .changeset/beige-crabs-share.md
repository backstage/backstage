---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: Removed the `TestApiRegistry` class, use `TestApiProvider` directory instead, storing resused APIs in an a variable instead, e.g. `const apis = [...] as const`.
