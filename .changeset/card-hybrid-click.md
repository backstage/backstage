---
'@backstage/ui': patch
---

Fixed interactive cards so that CardBody can scroll when the card has a constrained height. Previously, the overlay element blocked scroll events.

**Affected components:** Card
