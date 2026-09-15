---
'@backstage/frontend-app-api': patch
---

Supplying the `appHistoryApiRef` API from an `ApiBlueprint` extension that is gated behind an `if` predicate now fails with a clear error, rather than silently falling back to the built-in window history. Predicate-gated extensions are only resolved once predicate context exists, which is after the app history has already been decided, so such a factory could never take effect. Remove the `if` from that extension and from everything attached below it, or supply the history another way.
