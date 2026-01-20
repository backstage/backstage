---
'@backstage/core-components': patch
---

Fixed Table component layout when both `filters` and `title` props are used together. The filter controls now use a dedicated CSS class instead of reusing the root container class, and the container uses `flex-wrap: wrap` for better responsiveness.
