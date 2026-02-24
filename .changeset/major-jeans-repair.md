---
'@backstage/ui': patch
---

Migrated Avatar, Checkbox, Accordion, and other components from `useStyles` to `useDefinition` hook. Exported `AvatarOwnProps` and restructured `AvatarProps` to extend it, consistent with the pattern used by other migrated components.

**Affected components:** Avatar, Checkbox, Accordion
