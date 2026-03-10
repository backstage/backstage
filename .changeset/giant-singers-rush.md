---
'@backstage/ui': patch
---

Fixed handling of the `style` prop on `Button`, `ButtonIcon`, and `ButtonLink` so that it is now correctly forwarded to the underlying element instead of being silently dropped.

**Affected components:** Button, ButtonIcon, ButtonLink
