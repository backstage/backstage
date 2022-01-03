---
'@backstage/backend-common': patch
---

Reverted the default CSP configuration to include `'unsafe-eval'` again, which was mistakenly removed in the previous version.
