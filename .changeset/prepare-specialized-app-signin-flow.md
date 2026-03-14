---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/frontend-plugin-api': patch
---

Adds `prepareSpecializedApp` as a new two-phase app wiring API for rendering a bootstrap tree before full app finalization. The bootstrap phase is exposed as a partial app tree through `getBootstrapApp()`, while `onFinalized()` provides a one-way handoff to the finalized app once bootstrap completes. The opaque reusable `sessionState` is returned from the finalized app and can be passed into a future `prepareSpecializedApp` call to skip sign-in and reuse the prepared session. Conditional `app/root.elements` and predicate-gated APIs are now deferred until finalization, while unsupported bootstrap-visible predicates are downgraded to warnings and bootstrap extensions now surface warnings if they accessed APIs that only became available after finalization. The `if` option is also now supported on `createFrontendPlugin` and `createFrontendModule`, and is applied to each extension from that feature together with any extension-level predicate. Plugin and extension overrides can now also replace or remove existing `if` predicates. The existing `createSpecializedApp` API is now deprecated and backed by `prepareSpecializedApp().finalize()`, while `createApp` has been updated to use the same prepare/finalize flow.
