---
'@backstage/frontend-test-utils': patch
---

Removed `getIcon` from the public icon mock types to match `IconsApi`, while retaining the runtime method for older consumers. Use `icon` to look up registered icon elements.
