---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Fixed `MicrosoftGraphClient` accumulating one abort listener per request on the caller's `AbortSignal`. undici registers a listener on whatever signal it is handed to `fetch` and only releases it once that request's internal controller is garbage collected, so reusing a single signal across a paged walk — as `requestCollection` does, once per group for `getGroupMembers` — retained one listener per request. On large directories that crossed undici's listener cap and produced a `MaxListenersExceededWarning` storm; below the cap it was still retained memory for the length of the walk. Each request now gets a dependent signal via `AbortSignal.any`, which aborts identically and forwards the same reason.
