---
'@backstage/core-compat-api': minor
---

**BREAKING**: `convertLegacyAppOptions` now rejects `components.Router`. In the new frontend system the app owns browser history, and it cannot safely keep an opaque router component that may own a second history.

Remove a plain `BrowserRouter`, move any global providers it wrapped to `AppRootWrapperBlueprint`, and select alternate routers per page or sub-page with `PageRouterBlueprint`. Apps that stay on the old frontend system are unaffected.
