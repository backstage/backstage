---
id: authentication
sidebar_label: 003 - Authentication
title: Configuring authentication
description: How to set up a production authentication provider for Backstage
---

Audience: Developers and Admins

## Summary

By default, Backstage uses a guest authentication provider that lets anyone
log in without credentials. This is convenient for local development but
creates a security risk when deployed to production. Before deploying, you
should configure a real authentication provider.

By the end of this page, you will understand what needs to change and where
to find the setup instructions for your chosen provider.

## Why replace guest authentication?

The guest provider is explicitly not intended for containerized or production
environments. With guest auth enabled, any user who can reach your Backstage
instance shares the same identity and has the same level of access. Replacing
it is one of the most important steps before going to production.

:::danger

Deploying Backstage with the guest authentication provider exposes your
instance to unauthorized access. Configure a real provider before deploying.

:::

## Choosing an authentication provider

Backstage supports a wide range of authentication providers. GitHub is a
common choice since most developers already have accounts, but you should
pick whatever your organization already uses for single sign-on.

Some popular options:

| Provider             | Good fit when...                                  |
| :------------------- | :------------------------------------------------ |
| GitHub               | Your team uses GitHub and you want a quick setup. |
| Microsoft / Azure AD | Your company uses Microsoft Entra ID (Azure AD).  |
| Google               | Your company uses Google Workspace.               |
| Okta                 | You use Okta as your identity provider.           |
| OIDC                 | You have a generic OpenID Connect provider.       |
| OAuth2 Proxy         | You already use an authenticating reverse proxy.  |

The full list of providers and their configuration is available in the
[Authentication documentation](../../auth/index.md).

## What the setup involves

Regardless of which provider you choose, the setup follows the same pattern:

1. **Create an OAuth application** (or equivalent) with your identity
   provider. You will get a client ID and client secret.
2. **Add the provider configuration** to `app-config.yaml` with the
   credentials, typically using environment variables for secrets.
3. **Install the backend auth module** for your chosen provider in
   `packages/backend`.
4. **Configure a sign-in resolver** that maps the authenticated user identity
   to a Backstage catalog user entity.
5. **Update the frontend** to show the correct sign-in page.

The [Authentication getting started guide](../../getting-started/config/authentication.md)
walks through this process step by step using GitHub as the example provider.

## Production configuration

Once authentication is configured, make sure that the guest provider is
disabled in your production config:

```yaml title="app-config.production.yaml"
auth:
  providers:
    guest: null
```

This ensures that even if the guest provider is configured in your base
`app-config.yaml` for local development, it is explicitly disabled in
production.

## Next steps

With both a database and authentication configured, you are ready to deploy.

- [Deploying to production](./004-deploying.md)
