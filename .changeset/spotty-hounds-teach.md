---
'@backstage/ui': patch
---

Fixed form field descriptions not being connected to inputs via `aria-describedby`, making them accessible to screen readers. Added a `descriptionSlot` prop to `FieldLabel` that uses React Aria's slot mechanism to automatically wire up the connection.

**Affected components:** FieldLabel, TextField, PasswordField, SearchField, Select, RadioGroup, CheckboxGroup
