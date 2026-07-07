---
'@backstage/plugin-catalog-react': patch
---

Fixed a regression where `EntityTypePicker`'s `initialFilter` prop was being cleared when used alongside `EntityKindPicker` inside `EntityListProvider`. The type filter is now correctly preserved after the available types load for the selected kind.
