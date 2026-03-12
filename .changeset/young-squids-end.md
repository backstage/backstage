---
'@backstage/ui': minor
---

Removed redundant `selected` and `indeterminate` props from the `Checkbox` component. Use the `isSelected` and `isIndeterminate` props instead, which are the standard React Aria props and already handle both the checkbox behaviour and the corresponding CSS data attributes.

**Affected components:** Checkbox
