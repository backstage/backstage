# @backstage/plugin-auth

A Backstage frontend plugin that provides user interface components for authentication flows, specifically for OpenID Connect (OIDC) consent management.

## Installation

This plugin is designed to work with the `@backstage/plugin-auth-backend` package that provides OIDC provider functionality.

```bash
# From your Backstage app directory
yarn --cwd packages/app add @backstage/plugin-auth
```

## Usage

The plugin provides the route `/oauth2/authorize/:sessionId` for approving of oauth2 sessions for clients. You should see an approval flow for any sessions created through the `auth-backend`.
