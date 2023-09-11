---
'@backstage/plugin-kubernetes': patch
---

Added ID property to the table displaying kubernetes pods to avoid it beeing rerendered too often, which caused open sidebars to close.
