---
'@backstage/ui': patch
---

Disabled `Card` scroll shadow in browsers that don't support `animation-timeline: scroll()`. Prevents the shadow from being always visible over the `CardBody` when there's nothing to scroll or the body is not scrolled.

**Affected components:** Card
