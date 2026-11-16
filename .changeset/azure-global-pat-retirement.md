---
'@backstage/backend-defaults': patch
---

The Azure DevOps URL reader now warns at startup when a personal access token is configured for Azure DevOps Services. Global personal access tokens [stop working on January 27, 2027](https://devblogs.microsoft.com/devops/retirement-of-global-personal-access-tokens-in-azure-devops/), and organization-scoped tokens are now deprecated in favor of Microsoft Entra ID credentials. Errors from rejected credentials are also clearer.
