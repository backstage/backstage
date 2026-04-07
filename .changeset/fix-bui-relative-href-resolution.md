---
'@backstage/ui': patch
---

Fixed relative `href` resolution for BUI link components. Relative paths like `../other` are now correctly turned into absolute paths before reaching the React Aria layer, ensuring client-side navigation goes to the right place.

**Affected components:** ButtonLink, Card, CellProfile, CellText, Link, ListRow, MenuItem, MenuListBoxItem, Row, SearchAutocompleteItem, Tab, Tag
