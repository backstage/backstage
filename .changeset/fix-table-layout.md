---
'@backstage/core-components': patch
---

Fixed bug in Table component where the toolbar layout would break when both a title and filters were present. Added flexWrap: 'wrap' to the root style to prevent layout overflow and improve responsive design.
