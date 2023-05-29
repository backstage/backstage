---
'@backstage/backend-common': minor
'@backstage/integration': minor
'@backstage/plugin-catalog-backend-module-azure': patch
---

Support authentication with a service principal or managed identity for Azure DevOps

Azure DevOps recently released support, in public preview, for authenticating with a service principal or managed identity instead of a personal access token (PAT): https://devblogs.microsoft.com/devops/introducing-service-principal-and-managed-identity-support-on-azure-devops/. With this change the Azure integration now supports service principals and managed identities for Azure AD backed Azure DevOps organizations. Service principal and managed identity authentication is not supported on Azure DevOps Server (on-premises) organizations.
