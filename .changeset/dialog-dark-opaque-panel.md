---
'@backstage/ui': patch
---

Fixed the Dialog surface becoming semi-transparent in dark mode, which let content behind the dialog show through and made its own content hard to read. The dialog panel is now fully opaque in dark mode, matching light mode.
