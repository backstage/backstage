---
'@backstage/core-compat-api': minor
---

**BREAKING**: `convertLegacyAppOptions` now rejects `components.Router`. Browser history in the new frontend system has one app-owned authority and cannot safely preserve an opaque router component that may own a second history.

Remove a plain `BrowserRouter`, move any global providers it wrapped to `AppRootWrapperBlueprint`, and select alternate routers per page or sub-page with `PageRouterBlueprint`. Apps that continue using the old frontend system are unaffected.
