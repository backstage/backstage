---
'@backstage/core-components': patch
---

Fixed Table component layout when both `filters` and `title` props are used together. The filter controls now use a dedicated CSS class (`filterControls`) instead of incorrectly reusing the root container class.
