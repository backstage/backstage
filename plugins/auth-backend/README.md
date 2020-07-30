# Auth Backend

WORK IN PROGRESS

This is the backend part of the auth plugin.

It responds to auth requests from the frontend, and fulfills them by delegating
to the appropriate provider in the backend.

## Local development

Choose your OAuth Providers, replace `x` with actual value and then start backend:
Example for Google Oauth Provider at root directory:

```bash
export AUTH_GOOGLE_CLIENT_ID=x
export AUTH_GOOGLE_CLIENT_SECRET=x
yarn --cwd packages/backend start
```

### Google

```bash
export AUTH_GOOGLE_CLIENT_ID=x
export AUTH_GOOGLE_CLIENT_SECRET=x
```

### Github

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
```

for github enterprise:

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
export AUTH_GITHUB_AUTHORIZATION_URL=https://ENTERPRISE_INSTANCE_URL/login/oauth/authorize
export AUTH_GITHUB_TOKEN_URL=https://ENTERPRISE_INSTANCE_URL/login/oauth/access_token
export AUTH_GITHUB_USER_PROFILE_URL=https://ENTERPRISE_INSTANCE_URL/api/v3/user
```

### Gitlab

```bash
export GITLAB_BASE_URL=x # default is https://gitlab.com
export AUTH_GITLAB_CLIENT_ID=x
export AUTH_GITLAB_CLIENT_SECRET=x
```

### Okta

```bash
export AUTH_OKTA_AUDIENCE=x
export AUTH_OKTA_CLIENT_ID=x
export AUTH_OKTA_CLIENT_SECRET=x
```

### SAML

To try out SAML, you can use the mock identity provider:

```bash
./scripts/start-saml-idp.sh
```

## Authentication providers

[How to add an auth provider](https://github.com/spotify/backstage/blob/master/docs/auth/add-auth-provider.md)

## Links

- (The Backstage homepage)[https://backstage.io]
