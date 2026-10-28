---
'@backstage/frontend-app-api': minor
---

**BREAKING**: Removed the deprecated `createSpecializedApp` and `CreateSpecializedAppOptions` exports. Use `prepareSpecializedApp(options).finalize()` and `PrepareSpecializedAppOptions` instead. For sign-in or asynchronous session preparation, render the bootstrap app and subscribe with `onFinalized()` instead of calling `finalize()`.

Replace `advanced.apis` with `advanced.sessionState` from a previously finalized app to reuse its APIs, identity, and predicate context. Register custom APIs through `ApiBlueprint` extensions rather than passing an arbitrary API holder.
