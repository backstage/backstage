"@backstage/frontend-app-api": patch
"@backstage/frontend-defaults": patch

---

Adds `prepareSpecializedApp` as a new two-phase app wiring API for rendering a sign-in page before full app finalization. The existing `createSpecializedApp` API is now deprecated and backed by `prepareSpecializedApp().finalize()`, while `createApp` has been updated to use the same prepare/finalize flow.
