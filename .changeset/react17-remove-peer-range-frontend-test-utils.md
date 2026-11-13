---
'@backstage/frontend-test-utils': patch
---

Removed explicit support for React 17: the peer dependency range for `react`, `react-dom` and `@types/react` is now `^18.0.0`. React 17 is no longer tested or guaranteed to work, although it may continue to work in some cases. See the [migration guide](https://backstage.io/docs/frontend-system/architecture/migrations#157).
