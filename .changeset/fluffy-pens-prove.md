---
'@backstage/plugin-auth-backend': patch
---

Updated `frameHandler` to return `undefined` when using the redirect flow instead of returning `postMessageReponse` which was causing errors
