---
'@backstage/plugin-catalog-backend-module-msgraph': patch
---

Fixed scheduler task remaining stuck in running state after pod termination by propagating AbortSignal into MicrosoftGraphOrgEntityProvider.read()
