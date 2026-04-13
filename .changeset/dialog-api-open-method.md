---
'@backstage/frontend-plugin-api': patch
---

Added `open` method to `DialogApi` that renders dialogs without any built-in dialog chrome, giving the caller full control over the dialog presentation. This avoids focus trap conflicts that occur when mixing components from different design libraries. The existing `show` and `showModal` methods are now deprecated in favor of `open`.
