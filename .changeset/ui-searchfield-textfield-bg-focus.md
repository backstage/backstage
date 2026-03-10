---
'@backstage/ui': patch
---

`SearchField` and `TextField` now automatically adapt their background color based on the parent bg context, stepping up one neutral level (e.g. neutral-1 → neutral-2) when placed on a neutral background. `TextField` also gains a focus ring using the `--bui-ring` token.

**Affected components:** SearchField, TextField
