---
'@backstage/frontend-app-api': minor
---

The `createSpecializedApp` no longer throws when encountering many common errors when starting up the app. It will instead return them through the `errors` property so that they can be handled more gracefully in the app.
