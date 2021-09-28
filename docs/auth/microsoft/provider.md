---
id: provider
title: Microsoft Azure Authentication Provider
sidebar_label: Azure
description: Adding Microsoft Azure as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Microsoft authentication
provider that can authenticate users using Azure OAuth.

## Create an App Registration on Azure

To support Azure authentication, you must create an App Registration:

1. Log in to the [Azure Portal](https://portal.azure.com/)
2. Create an
   [Active Directory Tenant](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview),
   if one does not yet exist
3. Navigate to
   [Azure Active Directory > App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
4. Register an application
   - Name: Backstage (or your custom app name)
   - Redirect URI: Web >
     `http://localhost:7000/api/auth/microsoft/handler/frame`
5. Navigate to **Certificates & secrets > New client secret** to create a secret

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
```

The Microsoft provider is a structure with three configuration keys:

- `clientId`: Application (client) ID, found on App Registration > Overview
- `clientSecret`: Secret, found on App Registration > Certificates & secrets
- `tenantId`: Directory (tenant) ID, found on App Registration > Overview

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `microsoftAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
