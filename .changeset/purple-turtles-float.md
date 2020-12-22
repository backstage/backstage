---
'@backstage/core-api': patch
---

Delay auth loginPopup close to avoid race condition with callers of authFlowHelpers.
