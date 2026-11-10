---
'@backstage/frontend-defaults': patch
---

Apps now release their browser history listener when the React root is removed or a hot refresh replaces the app within the existing root. Replacement apps restart their bootstrap flow, while StrictMode effect replay keeps the current app's history listener active.
