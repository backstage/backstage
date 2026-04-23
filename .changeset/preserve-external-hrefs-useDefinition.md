---
'@backstage/ui': patch
---

Fixed external URLs in BUI link components being rewritten as in-app paths when the app is served under a non-root base path. Absolute URLs (`http://`, `https://`, `//`, `mailto:`, `tel:`) are now passed through unchanged. Internal `href` values are resolved against the current `basename` exactly once, which also fixes a latent issue where internal link clicks under a non-root base path could navigate to a URL with the `basename` prefix doubled.

**Affected components:** ButtonLink, Card, Link, Menu, Tab, Table, Tag
