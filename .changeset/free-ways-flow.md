---
'@backstage/plugin-techdocs': patch
---

Made the TechDocs sidebar positioning at tablet breakpoints configurable via CSS custom properties, allowing apps with custom sidebar widths to override the defaults. The available properties are `--techdocs-sidebar-closed-offset-pinned`, `--techdocs-sidebar-closed-offset-collapsed`, and `--techdocs-sidebar-open-translate`.
