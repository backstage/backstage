---
'@backstage/plugin-catalog-react': patch
---

Navigation to absolute paths and to pages in other plugins now goes through the app's own navigation when one is available, and falls back to React Router when it is not, so the same plugin code works under scoped plugin routing as well as in the old frontend system.

In the new frontend system, `EntityRefLink` also resolves its target from the app's registered entity route, and its href now includes the app's deploy basename. Entity links rendered inside a page that uses a different routing library now work, and middle-clicking one or copying its address under a sub-path deployment lands on the right entity. In the old frontend system the component behaves exactly as before.
