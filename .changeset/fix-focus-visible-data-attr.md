---
'@backstage/ui': patch
---

Fixed focus ring styles to use React Aria's `[data-focus-visible]` data attribute instead of the native CSS `:focus-visible` pseudo-class. This ensures keyboard focus rings render reliably when focus is managed programmatically by React Aria (e.g. inside a GridList, Menu, or Select).

**Affected components:** Accordion, Button, ButtonIcon, ButtonLink, Card, List, Menu, Select, ToggleButtonGroup
