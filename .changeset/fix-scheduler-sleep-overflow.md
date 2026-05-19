---
'@backstage/backend-defaults': patch
---

Fixed scheduler `sleep` firing immediately for durations longer than ~24.8 days, caused by Node.js `setTimeout` overflowing its 32-bit millisecond limit.
