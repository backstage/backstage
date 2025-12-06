---
'@backstage/frontend-plugin-api': patch
---

Added a new `errorPresentation` prop to `ExtensionBoundary` to control how errors are presented to the user. The default is `'error-display'`, which is the current behavior of showing the error in the `ErrorDisplay` component. The new option is `'error-api'`, posts errors to the `ErrorApi` and does not allow retries.

The `AppRootElementBlueprint` now wraps its element in an `ErrorBoundary` using the new `'error-api'` presentation mode.
