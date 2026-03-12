---
'@backstage/ui': minor
---

Removed redundant `selected` and `indeterminate` props from the `Checkbox` component. Use the `isSelected` and `isIndeterminate` props instead, which are the standard React Aria props and already handle both the checkbox behaviour and the corresponding CSS data attributes.

**Migration:**
Replace any usage of the `selected` and `indeterminate` props on `Checkbox` with the `isSelected` and `isIndeterminate` props. Note that the checked state and related CSS data attributes (such as `data-selected` and `data-indeterminate`) are now driven by React Aria, so any custom logic that previously inspected or set these via the old props should instead rely on the React Aria-managed state and attributes exposed through the new props.

**Affected components:** Checkbox
