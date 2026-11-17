---
'@backstage/frontend-plugin-api': patch
'@backstage/core-plugin-api': patch
---

API reference IDs now use plugin ID validation for each dot-separated component.
This accepts numeric dash groups and mixed case, including IDs such as
`plugin.example-2.todos`.
