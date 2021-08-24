---
id: provider
title: GitHub Authentication Provider
sidebar_label: GitHub
description: Adding GitHub OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a GitHub authentication provider
that can authenticate users using GitHub or GitHub Enterprise OAuth.

## Create an OAuth App on GitHub

To add GitHub authentication, you must create either a GitHub App, or an OAuth
App from the GitHub
[developer settings](https://github.com/settings/developers). The `Homepage URL`
should point to Backstage's frontend, while the `Authorization callback URL`
will point to the auth backend.

Note that if you're using a GitHub App, the allowed scopes are configured as
part of that app. This means you need to verify what scopes the plugins you use
require, so be sure to check the plugin READMEs for that information.

Settings for local development:

- Application name: Backstage (or your custom app name)
- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:7000/api/auth/github`

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        ## uncomment if using GitHub Enterprise
        # enterpriseInstanceUrl: ${AUTH_GITHUB_ENTERPRISE_INSTANCE_URL}
```

The GitHub provider is a structure with three configuration keys:

- `clientId`: The client ID that you generated on GitHub, e.g.
  `b59241722e3c3b4816e2`
- `clientSecret`: The client secret tied to the generated client ID.
- `enterpriseInstanceUrl` (optional): The base URL for a GitHub Enterprise
  instance, e.g. `https://ghe.<company>.com`. Only needed for GitHub Enterprise.

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `githubAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).

## Difference between GitHub Apps and GitHub OAuth Apps

GitHub Apps handle OAuth scope at the app installation level, meaning that the
`scope` parameter for the call to `getAccessToken` in the frontend has no
effect. When calling `getAccessToken` in open source plugins, one should still
include the appropriate scope, but also document in the plugin README what
scopes are required for GitHub Apps.
