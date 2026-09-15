---
'@backstage/frontend-plugin-api': patch
---

Added `useAppLocation` and `useAppSearchParams` for reading location and managing query parameters without a page router. Both use the app history in the new frontend system and retain React Router fallback in the old frontend system.
