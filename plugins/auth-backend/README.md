# Auth Backend

WORK IN PROGRESS

This is the backend part of the auth plugin.

It responds to auth requests from the frontend, and fulfills them by delegating
to the appropriate provider in the backend.

## Local development

Choose your OAuth Providers, replace `x` with actual value and then start backend:
Example for Google OAuth Provider at root directory:

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

### GitHub

#### Creating a GitHub OAuth application

Follow this link, [Create new OAuth App](https://github.com/settings/applications/new).

1. Set Application Name to `backstage-dev` or something along those lines.
1. You can set the Homepage URL to whatever you want to.
1. The Authorization Callback URL should match the redirect URI set in Backstage.
   1. Set this to `http://localhost:7000/api/auth/github` for local development.
   1. Set this to `http://{APP_FQDN}:{APP_BACKEND_PORT}/api/auth/github` for non-local deployments.

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
```

For GitHub Enterprise:

```bash
export AUTH_GITHUB_CLIENT_ID=x
export AUTH_GITHUB_CLIENT_SECRET=x
export AUTH_GITHUB_ENTERPRISE_INSTANCE_URL=https://x
```

### GitLab

#### Creating a GitLab OAuth application

Follow this link, [Add new application](https://gitlab.com/-/profile/applications).

1. Set Application Name to `backstage-dev` or something along those lines.
1. The Authorization Callback URL should match the redirect URI set in Backstage.
   1. Set this to `http://localhost:7000/api/auth/gitlab/handler/frame` for local development.
   1. Set this to `http://{APP_FQDN}:{APP_BACKEND_PORT}/api/auth/gitlab/handler/frame` for non-local deployments.
   1. Select the following scopes from the list:
      - [x] `read_user` Grants read-only access to the authenticated user's profile through the /user API endpoint, which includes username, public email, and full name. Also grants access to read-only API endpoints under /users.
      - [x] `read_repository` Grants read-only access to repositories on private projects using Git-over-HTTP (not using the API).
      - [x] `write_repository` Grants read-write access to repositories on private projects using Git-over-HTTP (not using the API).
      - [x] `openid` Grants permission to authenticate with GitLab using OpenID Connect. Also gives read-only access to the user's profile and group memberships.
      - [x] `profile` Grants read-only access to the user's profile data using OpenID Connect.
      - [x] `email` Grants read-only access to the user's primary email address using OpenID Connect.

```bash
export GITLAB_BASE_URL=https://gitlab.com
export AUTH_GITLAB_CLIENT_ID=x  # GitLab calls this the Application ID
export AUTH_GITLAB_CLIENT_SECRET=x
```

#### Creating a GitLab Enterprise OAuth application

If you have GitLab Enterprise, perform the steps above, replacing `gitlab.example.com` in the following
with the domain of your GitLab Enterprise host:

Create new application at: `https://gitlab.example.com/profile/applications`.

```bash
export GITLAB_BASE_URL=https://gitlab.example.com
export AUTH_GITLAB_CLIENT_ID=x  # GitLab calls this the Application ID
export AUTH_GITLAB_CLIENT_SECRET=x
```

### Okta

Add a new Okta application using the following URI conventions:

Login redirect URI's: `http://localhost:7000/api/auth/okta/handler/frame`
Logout redirect URI's: `http://localhost:7000/api/auth/okta/logout`
Initiate login URI's: `http://localhost:7000/api/auth/okta/start`

Then configure the following environment variables to be used in the `app-config.yaml` file:

```bash
export AUTH_OKTA_AUDIENCE=https://example.okta.com
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
  - For local development, this is likely `http://localhost:7000/api/auth/microsoft/handler/frame`
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
export AUTH_MICROSOFT_CLIENT_ID=x
export AUTH_MICROSOFT_CLIENT_SECRET=x
export AUTH_MICROSOFT_TENANT_ID=x
yarn start
```

### SAML

To try out SAML, you can use the mock identity provider:

```bash
./scripts/start-saml-idp.sh
```

## Authentication providers

[How to add an auth provider](https://github.com/backstage/backstage/blob/master/docs/auth/add-auth-provider.md)

## Links

- [The Backstage homepage](https://backstage.io)
