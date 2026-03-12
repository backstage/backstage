---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
---

Adds `prepareSpecializedApp` as a new two-phase app wiring API for rendering a bootstrap tree before full app finalization. The bootstrap phase is now exposed as a partial app tree that consumers can render while subscribing to phase transitions, while the opaque reusable `sessionState` is stored internally on the prepared app and returned from `getFinalizedApp()` and `finalize()`. That session state can also be passed into a future `prepareSpecializedApp` call to skip sign-in and reuse the prepared session. The existing `createSpecializedApp` API is now deprecated and backed by `prepareSpecializedApp().finalize()`, while `createApp` has been updated to use the same prepare/finalize flow.
