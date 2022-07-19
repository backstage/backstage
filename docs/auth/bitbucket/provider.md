---
id: provider
title: Bitbucket Authentication Provider
sidebar_label: Bitbucket
description: Adding Bitbucket OAuth as an authentication provider in Backstage
---

The Backstage `core-plugin-api` package comes with a Bitbucket authentication
provider that can authenticate users using Bitbucket Cloud. This does **NOT**
work with Bitbucket Server.

## Create an OAuth Consumer in Bitbucket

To add Bitbucket Cloud authentication, you must create an OAuth Consumer.

Go to `https://bitbucket.org/<your-project-name>/workspace/settings/api` .

Click Add Consumer.

Settings for local development:

- Application name: Backstage (or your custom app name)
- Callback URL: `http://localhost:7007/api/auth/bitbucket`
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

To add the provider to the frontend, add the `bitbucketAuthApi` reference and
`SignInPage` component as shown in
[Adding the provider to the sign-in page](../index.md#adding-the-provider-to-the-sign-in-page).

## Using Bitbucket for sign-in

In order to use the Bitbucket provider for sign-in, you must configure it with a
`signIn.resolver`. See the
[Sign-In Resolver documentation](../identity-resolver.md) for more details on
how this is done. Note that for the Bitbucket provider, you'll want to use
`bitbucket` as the provider ID, and `providers.bitbucket.create` for the provider
factory.

The `@backstage/plugin-auth-backend` plugin also comes with two built-in
resolves that can be used if desired. The first one is the
`bitbucketUsernameSignInResolver`, which identifies users by matching their
Bitbucket username to `bitbucket.org/username` annotations of `User` entities in
the catalog. Note that you must populate your catalog with matching entities or
users will not be able to sign in.

The second resolver is the `bitbucketUserIdSignInResolver`, which works the
same way, but uses the Bitbucket user ID instead, and matches on the
`bitbucket.org/user-id` annotation.

The following is an example of how to use one of the built-in resolvers:

```ts
import { providers } from '@backstage/plugin-auth-backend';

// ...
  providerFactories: {
    bitbucket: providers.bitbucket.create({
      signIn: {
        resolver:
          providers.bitbucket.resolvers.usernameMatchingUserEntityAnnotation(),
      },
    }),
  },
```
