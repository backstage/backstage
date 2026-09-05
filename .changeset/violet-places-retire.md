---
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-scaffolder': patch
---

Added `AccordionField` as a built-in layout field for the Scaffolder template form. Use `ui:field: AccordionField` on any `object`-type property to render its children inside a collapsible accordion section. Supports `accordionTitle` and `defaultExpanded` via `ui:options`, `ui:order` for controlling field rendering order within the accordion, and can be nested.
