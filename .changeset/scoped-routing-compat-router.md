---
'@backstage/core-compat-api': minor
---

**BREAKING**: `convertLegacyAppOptions` now rejects `components.Router`. In the new frontend system the app owns browser history, and it cannot safely keep an opaque router component that may own a second history.

Remove a plain `BrowserRouter`, move any global providers it wrapped to `AppRootWrapperBlueprint`, and give a page its own routing context by rendering a page router such as `ReactRouterV6PageRouter` from `@backstage/plugin-app-react-router-v6` inside its `PageBlueprint` loader. Apps that stay on the old frontend system are unaffected.
