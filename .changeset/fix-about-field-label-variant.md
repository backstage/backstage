---
'@backstage/plugin-catalog': patch
---

Fixed the `AboutField` label in the About card using `variant="inherit"` instead of `variant="h2"` to prevent theme typography overrides from changing the intended 10px label size.
