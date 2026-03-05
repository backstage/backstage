---
'@backstage/ui': patch
---

Fixed `isRequired` prop not being passed to the underlying React Aria field components in TextField, SearchField, and PasswordField. Previously, `isRequired` was consumed locally for the secondary label text but never forwarded, which meant the input elements lacked `aria-required="true"` and React Aria's built-in required validation was not activated.

**Affected components:** TextField, SearchField, PasswordField
