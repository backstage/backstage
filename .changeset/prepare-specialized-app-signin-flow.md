---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
---

Adds `prepareSpecializedApp` as a new two-phase app wiring API for rendering a sign-in page before full app finalization. Session preparation now resolves to an opaque reusable `sessionState`, which is returned from `getSignIn().ready` and from `finalize()`, and can be passed into a future `prepareSpecializedApp` call to skip sign-in and reuse the prepared session. The existing `createSpecializedApp` API is now deprecated and backed by `prepareSpecializedApp().finalize()`, while `createApp` has been updated to use the same prepare/finalize flow.
