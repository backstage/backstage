---
'@backstage/core-app-api': patch
---

Fixed the OAuth "Login Required" popup (`OAuthRequestDialog`) appearing after a transient network failure during a background token refresh — for example right after the machine wakes from sleep, when the session has not actually expired.
