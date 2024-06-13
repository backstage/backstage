---
id: provider
title: AWS ALB Proxy Provider
sidebar_label: AWS ALB
description: Adding AWS ALB as an authentication provider in Backstage
---

Backstage can de deployed behind [AWS Application Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
and get the user seamlessly authenticated.

## Installation

### Backend

:::note
These instructions are written for the [new backend system](../../backend-system/index.md).
:::

Add the `@backstage/plugin-auth-backend-module-aws-alb-provider` to your backend installation.

```sh
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-auth-backend-module-aws-alb-provider
```

Then, add it to your backend's source,

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

backend.add(import('@backstage/plugin-auth-backend'));
// highlight-add-next-line
backend.add(import('@backstage/plugin-auth-backend-module-aws-alb-provider'));

await backend.start();
```

### Frontend

See [Sign-In with Proxy Providers](../index.md#sign-in-with-proxy-providers) for pointers on how to set up the sign-in page, and to also make it work smoothly for local development.

## Configuration

The provider configuration can be added to your `app-config.yaml` under the root
`auth` configuration:

```yaml title="app-config.yaml"
auth:
  providers:
    awsalb:
      issuer: 'https://example.okta.com/oauth2/default' # optional
      region: 'us-west-2' # required, use your actual region here
      signIn:
        resolvers:
          # typically you would pick one of these
          - resolver: emailMatchingUserEntityProfileEmail
          - resolver: emailLocalPartMatchingUserEntityName
```

If you [provide a custom sign in resolver](https://backstage.io/docs/auth/identity-resolver#building-custom-resolvers), you can skip the `signIn` block entirely.
