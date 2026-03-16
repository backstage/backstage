---
'@backstage/ui': patch
---

Fixed incorrect bottom spacing caused by `Container` using `padding-bottom` for its default bottom spacing. Changed to `margin-bottom` and prevented it from applying when `Container` is used as the `Header` root element.

**Affected components:** Container, Header
