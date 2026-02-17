---
'@backstage/ui': patch
---

Fixed nested Accordion icon state issue where the inner accordion's arrow icon would incorrectly show as expanded when only the outer accordion was expanded. The CSS selector now uses a direct parent selector to ensure the icon only responds to its own accordion's expanded state.

Affected components: Accordion
