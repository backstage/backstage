---
'@backstage/frontend-defaults': patch
---

Apps now release their browser history listener when the React root is removed or a hot refresh replaces the app within the existing root. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for background on app-owned history.
