---
'@backstage/ui': patch
---

Fixed dark theme `--bui-fg-secondary` and `--bui-fg-disabled` tokens using black-based `oklch(0% ...)` instead of white-based `oklch(100% ...)`, making secondary and disabled text visible on dark backgrounds.
