---
id: provider
title: Bitbucket Authentication Provider
sidebar_label: Bitbucket
description: Adding Bitbucket OAuth as an authentication provider in Backstage
---

The Backstage `core-api` package comes with a Bitbucket authentication provider
that can authenticate users using Bitbucket Cloud. This does **NOT** work with
Bitbucket Server.

## Create an OAuth Consumer in Bitbucket

To add Bitbucket Cloud authentication, you must create an OAuth Consumer.

Go to `https://bitbucket.org/<your-project-name>/workspace/settings/api` .

Click Add Consumer.

Settings for local development:

- Application name: Backstage (or your custom app name)
- Callback URL: `http://localhost:7000/api/auth/bitbucket`
- Other are optional
- (IMPORTANT) **Permissions: Account - Read, Workspace membership - Read**

## Configuration

The provider configuration can then be added to your `app-config.yaml` under the
root `auth` configuration:

```yaml
auth:
  environment: development
  providers:
    bitbucket:
      development:
        clientId: ${AUTH_BITBUCKET_CLIENT_ID}
        clientSecret: ${AUTH_BITBUCKET_CLIENT_SECRET}
```

The Bitbucket provider is a structure with two configuration keys:

- `clientId`: The Key that you generated in Bitbucket, e.g.
  `b59241722e3c3b4816e2`
- `clientSecret`: The Secret tied to the generated Key.

## Adding the provider to the Backstage frontend

Ensure identityProviders contains Bitbucket at
`packages/app/src/identityProviders.ts`:

```yaml
import {
  ...
  bitbucketAuthApiRef,
  ...
} from '@backstage/core-plugin-api';

export const providers = [
...
  {
    id: 'bitbucket-auth-provider',
    title: 'Bitbucket',
    message: 'Sign In using Bitbucket Cloud',
    apiRef: bitbucketAuthApiRef,
  },
...
];
```
