---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added lazy utility API factories. Refs opt in with `loading: 'async'`, and `useApi`
suspends while their implementations initialize. Plugins that support the old
frontend system must keep their APIs synchronous.

**BREAKING PRODUCERS**: Custom `ApiHolder` implementations must return a stable
promise for a present async-capable API and `undefined` immediately for a missing
API.

See the [Utility API documentation](https://backstage.io/docs/frontend-system/utility-apis/creating/#lazy-api-implementations)
for configuration, loading-mode contracts, and migration requirements.
