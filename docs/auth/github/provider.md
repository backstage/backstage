---
id: provider
title: GitHub Authentication Provider
sidebar_label: GitHub
description: Adding GitHub OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a GitHub authentication
provider that can authenticate users using GitHub or GitHub Enterprise OAuth.

## Create an OAuth App on GitHub

To add GitHub authentication, you must create either a GitHub App or an OAuth
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
- Authorization callback URL: `http://localhost:7007/api/auth/github/handler/frame`

### Difference between GitHub Apps and GitHub OAuth Apps

GitHub Apps handle OAuth scope at the app installation level, meaning that the
`scope` parameter for the call to `getAccessToken` in the frontend has no
effect. When calling `getAccessToken` in open source plugins, one should still
include the appropriate scope, but also document in the plugin README what
scopes are required for GitHub Apps.

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
        ## uncomment to set lifespan of user session
        # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
        signIn:
          resolvers:
            # See https://backstage.io/docs/auth/github/provider#resolvers for more resolvers
            - resolver: usernameMatchingUserEntityName
```

The GitHub provider is a structure with these configuration keys:

- `clientId`: The client ID that you generated on GitHub, e.g.,
  `b59241722e3c3b4816e2`
- `clientSecret`: The client secret tied to the generated client ID.
- `enterpriseInstanceUrl` (optional): The base URL for a GitHub Enterprise
  instance, e.g., `https://ghe.<company>.com`. Only needed for GitHub Enterprise.
- `callbackUrl` (optional): The callback URL that GitHub will use when
  initiating an OAuth flow, e.g.,
  `https://your-intermediate-service.com/handler`. Only needed if Backstage is
  not the immediate receiver (e.g., one OAuth app for many backstage instances).
- `sessionDuration` (optional): Lifespan of the user session.
- `signIn`: The configuration for the sign-in process, including the **resolvers**
  that should be used to match the user from the auth provider with the user
  entity in the Backstage catalog (typically a single resolver is sufficient).

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.
- `usernameMatchingUserEntityName`: Matches the username from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver; this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-github-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

To add the provider to the frontend, add the `githubAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#sign-in-configuration).
