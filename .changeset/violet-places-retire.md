---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder': patch
---

Added `AccordionField` as a built-in layout field. Use `ui:field: AccordionField` to group template parameters inside a collapsible accordion section. Supports `accordionTitle` and `defaultExpanded` via `ui:options`, and can be nested.
