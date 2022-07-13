---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Microsoft Graph plugin can supports many more options for authenticating with the Microsoft Graph API.
Previously only ClientId/ClientSecret was supported, but now all the authentication options of `DefaultAzureCredential` from `@azure/identity` are supported.
Including Managed Identity, Client Certificate, Azure CLI and VS Code.

If `clientId` and `clientSecret` are specified in configuration, the plugin behaves the same way as before.
If these fields are omitted, the plugin uses `DefaultAzureCredential` to automatically determine the best authentication method.
This is particularly useful for local development environments - the default configuration will try to use existing credentials from Visual Studio Code, Azure CLI and Azure PowerShell, without the user needing to configure any credentials in app-config.yaml
