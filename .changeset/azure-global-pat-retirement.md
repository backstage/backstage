---
'@backstage/backend-defaults': patch
---

The Azure DevOps URL reader now warns at startup when a personal access token is configured for Azure DevOps Services. Global personal access tokens stop working on December 1, 2026, and organization-scoped tokens are now deprecated in favor of Microsoft Entra ID credentials. Errors from rejected credentials are also clearer.
