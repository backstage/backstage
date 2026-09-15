---
'@backstage/core-components': patch
---

`Sidebar` and `ErrorPage` now use the app's own navigation where one is available. In apps built with the old frontend system there is no app navigation and behavior is unchanged.

The shared navigation hooks remain compatible with React 17.

In the new frontend system:

- Sidebar items and nested menu items resolve their targets and decide whether they are active from the app's own location, so they stay highlighted correctly while a page rendered by another routing library is open.
- The error page "go back" link keeps working from inside a page that has its own router.
