---
'@backstage/ui': minor
---

**BREAKING**: The `SelectProps` interface now accepts a generic type parameter for selection mode.

Added searchable and multiple selection support to Select component. The component now accepts `searchable`, `selectionMode`, and `searchPlaceholder` props to enable filtering and multi-selection modes.

Migration: If you're using `SelectProps` type directly, update from `SelectProps` to `SelectProps<'single' | 'multiple'>`. Component usage remains backward compatible.
