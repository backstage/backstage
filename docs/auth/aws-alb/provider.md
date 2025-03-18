---
id: provider
title: AWS ALB Proxy Provider
sidebar_label: AWS ALB
description: Adding AWS ALB as an authentication provider in Backstage
---

Backstage can be deployed behind [AWS Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
and get the user seamlessly authenticated.

## Configuration

The provider configuration can be added to your `app-config.yaml` under the root
`auth` configuration, similar to the following example:

```yaml title="app-config.yaml"
auth:
  providers:
    awsalb:
      # this is the URL of the IdP you configured
      issuer: 'https://example.okta.com/oauth2/default'
      # this is the ARN of your ALB instance
      signer: 'arn:aws:elasticloadbalancing:us-east-2:123456789012:loadbalancer/app/my-load-balancer/1234567890123456'
      # this is the region where your ALB instance resides
      region: 'us-west-2'
      ## uncomment to set lifespan of user session
      # sessionDuration: { hours: 24 } # supports `ms` library format (e.g. '24h', '2 days'), ISO duration, "human duration" as used in code
      signIn:
        resolvers:
          # See https://backstage.io/docs/auth/aws-alb/provider#resolvers for more resolvers
          - resolver: emailMatchingUserEntityProfileEmail
```

Ensure that you have set the signer correctly. It is also recommended that you restrict your target groups' security policy to only accept connections from that ALB.

### Optional

- `sessionDuration`: Lifespan of the user session.

### Resolvers

This provider includes several resolvers out of the box that you can use:

- `emailMatchingUserEntityProfileEmail`: Matches the email address from the auth provider with the User entity that has a matching `spec.profile.email`. If no match is found, it will throw a `NotFoundError`.
- `emailLocalPartMatchingUserEntityName`: Matches the [local part](https://en.wikipedia.org/wiki/Email_address#Local-part) of the email address from the auth provider with the User entity that has a matching `name`. If no match is found, it will throw a `NotFoundError`.

:::note Note

The resolvers will be tried in order but will only be skipped if they throw a `NotFoundError`.

:::

If these resolvers do not fit your needs, you can build a custom resolver, this is covered in the [Building Custom Resolvers](../identity-resolver.md#building-custom-resolvers) section of the Sign-in Identities and Resolvers documentation.

## Backend Installation

To add the provider to the backend, we will first need to install the package by running this command:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-aws-alb-provider
```

Then we will need to add this line:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-auth-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));
/* highlight-add-end */
```

## Adding the provider to the Backstage frontend

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page and also make it work smoothly for local development. You'll use `awsalb` as the provider name.

If you [provide a custom sign in resolver](https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers), you can skip the `signIn` block entirely.
