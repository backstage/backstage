---
'@backstage/ui': patch
---

`BUIProvider` accepts optional `navigate` and `useHref` so host apps can back BUI navigable components with the framework navigation controller.

Internal `href` resolution keeps a usable `/` when React Router resolves the app root to an empty path, so root links stay navigable.

**Affected components:** Link, BUIProvider
