---
'@backstage/plugin-catalog-backend': patch
---

Remove `sqlite3` as a dependency. You may need to add `sqlite3` as a dependency of your backend if you were relying on this indirect dependency.
