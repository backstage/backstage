---
'@backstage/ui': patch
---

The Table component now defaults to automatically determine the columns widths based on the content, and the prop `columnSizing` can be set to `manual` to disable this. If this prop is unset and any column has a width property set, it turns to `manual` column sizing mode.

Affected components: Table
