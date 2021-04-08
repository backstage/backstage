---
id: provider
title: GitHub Authentication Provider
sidebar_label: GitHub
description: Adding GitHub OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a GitHub authentication provider
that can authenticate users using GitHub or GitHub Enterprise OAuth.

## Create an OAuth App on GitHub

To add GitHub authentication, you must create an OAuth App from the GitHub
[developer settings](https://github.com/settings/developers). The `Homepage URL`
should point to Backstage's frontend, while the `Authorization callback URL`
will point to the auth backend.

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
