---
id: provider
title: Atlassian Authentication Provider
sidebar_label: Atlassian
description: Adding Atlassian as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with an Atlassian authentication
provider that can authenticate users using Atlassian products. This auth
**only** provides scopes for the following APIs:

- Confluence API
- User REST API
- Jira platform REST API
- Jira Service Desk API
- Personal data reporting API
- User identity API

## Create an OAuth 2.0 (3LO) app in the Atlassian developer console

To add Atlassian authentication, you must create an OAuth 2.0 (3LO) app.

Go to `https://developer.atlassian.com/console/myapps/`.

Click on the drop down `Create`, and choose `OAuth 2.0 integration`.

Name your integration and click on the `Create` button.

Settings for local development:

- Callback URL: `http://localhost:7000/api/auth/atlassian`
- Use rotating refresh tokens
- For permissions, you **must** enable `View user profile` for the currently
  logged-in user, under `User identity API`

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    atlassian:
      development:
        clientId: ${AUTH_ATLASSIAN_CLIENT_ID}
        clientSecret: ${AUTH_ATLASSIAN_CLIENT_SECRET}
        scopes: ${AUTH_ATLASSIAN_SCOPES}
```

The Atlassian provider is a structure with three configuration keys:

- `clientId`: The Key you generated in the developer console.
- `clientSecret`: The Secret tied to the generated Key.
- `scopes`: List of scopes the app has permissions for, separated by spaces.

**NOTE:** the scopes `offline_access` and `read:me` are provided by default.

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `atlassianAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).
