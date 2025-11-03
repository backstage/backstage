---
'@backstage/ui': minor
---

**BREAKING**: Changed className prop behavior to augment default styles instead of being ignored or overriding them.

Affected components:

- Menu, MenuListBox, MenuAutocomplete, MenuAutocompleteListbox, MenuItem, MenuListBoxItem, MenuSection, MenuSeparator
- Switch
- Skeleton
- FieldLabel
- Header, HeaderToolbar
- HeaderPage
- Tabs, TabList, Tab, TabPanel

If you were passing custom className values to any of these components that relied on the previous behavior, you may need to adjust your styles to account for the default classes now being applied alongside your custom classes.
