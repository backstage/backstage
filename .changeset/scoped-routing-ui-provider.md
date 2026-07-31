---
'@backstage/ui': patch
---

`BUIProvider` accepts optional `navigate` and `useHref` props, so a host app can route the navigation of all descendant BUI components through its own navigation authority instead of React Router. When `navigate` is set, a React Router context is no longer required.

Links to the app root are also no longer dropped when React Router resolves the root to an empty path.

**Affected components:** Link, BUIProvider
