---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
---

Adds `prepareSpecializedApp` as a new two-phase app wiring API for rendering a sign-in page before full app finalization. The sign-in step is now exposed as a bootstrap component whose `onReady` callback signals that the prepared app can now be finalized, while the opaque reusable `sessionState` is stored internally on the prepared app and returned from `tryFinalize()` and `finalize()`. That session state can also be passed into a future `prepareSpecializedApp` call to skip sign-in and reuse the prepared session. The existing `createSpecializedApp` API is now deprecated and backed by `prepareSpecializedApp().finalize()`, while `createApp` has been updated to use the same prepare/finalize flow.
