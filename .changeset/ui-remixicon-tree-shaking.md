---
'@backstage/ui': patch
'@backstage/ui-icons': minor
---

Added `@backstage/ui-icons`, a tree-shakeable icon package with per-icon ESM exports. SVG sources are vendored from [Remix Icon](https://remixicon.com/) (v4.8.x, Apache-2.0) with no runtime dependency on `@remixicon/react`. `@backstage/ui` now uses this package instead of `@remixicon/react`, removing the ~2.4MB barrel from consumer bundles.

Fixes #35397
