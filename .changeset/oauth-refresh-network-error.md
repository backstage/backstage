---
'@backstage/core-app-api': patch
---

Fixed the OAuth "Login Required" popup (`OAuthRequestDialog`) appearing after a transient network failure during a background token refresh — for example right after the machine wakes from sleep, when the session has not actually expired.

`DefaultAuthConnector` now throws an `AuthConnectionError` when a refresh request fails to reach the backend (a rejected `fetch`, as opposed to the backend rejecting the session). `RefreshingAuthSessionManager` treats that as a retryable transient failure: it no longer wipes the session or opens an interactive login popup for it, and instead surfaces the error so a later call can refresh silently once connectivity returns. Optional session requests continue to resolve with `undefined`.
