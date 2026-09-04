---
'@backstage/ui': patch
---

Replaced `@remixicon/react` runtime dependency with tree-shakeable inline SVG icons for the icons used internally by BUI components. This removes the ~2.4MB `@remixicon/react` barrel from consumer bundles when using icon-bearing components like `Button`, `Dialog`, or `Alert`.

Fixes #35397
