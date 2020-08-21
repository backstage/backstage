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

#### Creating a GitHub OAuth application

Follow this link, [Create new OAuth App](https://github.com/settings/applications/new).

1. Set Application Name to `backstage-dev` or something along those lines.
1. You can set the Homepage URL to whatever you want to.
1. The Authorization Callback URL should match the redirect URI set in Backstage.
   1. Set this to `http://localhost:7000/auth/github` for local development.
   1. Set this to `http://{APP_FQDN}:{APP_BACKEND_PORT}/auth/github` for non-local deployments.

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
```

for github enterprise:

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
export AUTH_GITHUB_ENTERPRISE_INSTANCE_URL=https://x
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

### Auth0

```bash
export AUTH_AUTH0_DOMAIN=x
export AUTH_AUTH0_CLIENT_ID=x
export AUTH_AUTH0_CLIENT_SECRET=x
```

### Microsoft

#### Creating an Azure AD App Registration

An Azure AD App Registration is required to be able to sign in using Azure AD and the Microsoft Graph API.  
Click [here](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to create a new one.

- Click on the `New Registration` button.
- Give the app a name. e.g. `backstage-dev`
- Select `Accounts in this organizational directory only` under supported account types.
- Enter the callback URL for your backstage backend instance:
   - For local development, this is likely `http://localhost:7000/auth/microsoft/handler/frame`
   - For non-local deployments, this will be `https://{APP_FQDN}:{APP_BACKEND_PORT}/auth/microsoft/handler/frame`
- Click `Register`.

We also need to generate a client secret so Backstage can authenticate as this app.

- Click on the `Certificates & secrets` menu item.
- Under `Client secrets`, click on `New client secret`.
- Add a description for the new secret. e.g. `auth-backend-plugin`
- Select an expiry time; `1 Year`, `2 Years` or `Never`.
- Click `Add`.

The secret value will then be displayed on the screen. **You will not be able to retrieve it again after leaving the page**.

#### Starting the Auth Backend

```bash
cd packages/backend
export AUTH_AZURE_CLIENT_ID=x
export AUTH_AZURE_CLIENT_SECRET=x
export AUTH_AZURE_TENANT_ID=x
yarn start
```

### SAML

To try out SAML, you can use the mock identity provider:

```bash
./scripts/start-saml-idp.sh
```

## Authentication providers

[How to add an auth provider](https://github.com/spotify/backstage/blob/master/docs/auth/add-auth-provider.md)

## Links

- [The Backstage homepage](https://backstage.io)
