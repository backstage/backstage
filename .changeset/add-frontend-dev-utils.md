---
'@backstage/frontend-dev-utils': minor
---

Added `@backstage/frontend-dev-utils`, a new package that provides a minimal helper for wiring up a development app for frontend plugins using the new frontend system. It exports a `createDevApp` function that handles creating and rendering a development app from a `dev/` entry point. The dev app automatically bypasses the sign-in page and loads the `@backstage/ui` CSS. The options interface accepts `features` together with route bindings through `bindRoutes`.
