---
id: quickstart-app-auth
title: Monorepo App Setup With Authentication
---

###### January 8th 2021 - @backstage/create-app - v0.4.5

<br />

> This document takes you through setting up a Backstage app that runs in your
> own environment. It starts with a skeleton install and verifying of the
> monorepo's functionality. Next, authentication is added and tested.
>
> This document assumes you have Node.js 12 or 14 active along with Yarn and
> Python. Please note, that at the time of this writing, the current version is
> v0.4.5. This guide can still be used with future versions, just, verify as you
> go.

# The Skeleton Application

From the terminal:

1. Create a (monorepo) application: `npx @backstage/create-app`
1. Enter an `id` for your new app like `mybiz-backstage` I went with
   `simple-backstage-app`
1. Choose `SQLite` as your database. This is the quickest way to get started as
   PostgreSQL requires additional setup not covered here.
1. Start your backend: `yarn --cwd packages/backend start`

```zsh
# You should see positive verbiage in your terminal output
2020-09-11T22:20:26.712Z backstage info Listening on :7000
```

5. Finally, start the frontend. Open a new terminal window and from the root of
   your project, run: `yarn start`

```zsh
# You should see positive verbiage in your terminal output
ℹ ｢wds｣: Project is running at http://localhost:3000/
```

Once the app compiles, a browser window should have popped with your stand-alone
application loaded at `localhost:3000`. This could take a couple minutes.

```zsh
# You should see positive verbiage in your terminal output
ℹℹ ｢wdm｣: Compiled successfully.
```

Since there is no auth currently configured, you are automatically entered as a
guest. Let's fix that now and add auth.

# The Auth Configuration

A default Backstage installation includes multiple authentication providers out
of the box. The steps to enable new authentication providers in Backstage are
very similar to each other, the biggest difference is usually configuring the
external authentication provider. Please see a subset of possible providers and
instructions to integrate them below. Steps 1 & 2 are described separately for
each provider and steps beyond that are common for all.

<details><summary>GitHub</summary>
<p>

### 1. Open `app-config.yaml` and change it as follows

_from:_

```yaml
auth:
  providers: {}
```

_to:_

```yaml
auth:
  providers:
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        ## uncomment the following line if using enterprise
        # enterpriseInstanceUrl: ${AUTH_GITHUB_ENTERPRISE_INSTANCE_URL}
```

### 2. Generate a GitHub client ID and secret

- Log into http://github.com
- Navigate to (Settings > Developer Settings > OAuth Apps > New OAuth
  App)[https://github.com/settings/applications/new]
- Set Homepage URL = `http://localhost:3000`
- Set Callback URL = `http://localhost:7000/api/auth/github`
- Click [Register application]
- On the next page, copy and paste your new Client ID and Client Secret to
  environment variables defined in the `app-config.yaml` file,
  `AUTH_GITHUB_CLIENT_ID` & `AUTH_GITHUB_CLIENT_SECRET`

</p>
</details>

<details><summary>GitLab</summary>
<p>

### 1. Open `app-config.yaml` and change it as follows

_from:_

```yaml
auth:
  providers: {}
```

_to:_

```yaml
auth:
  providers:
    gitlab:
      development:
        clientId: ${AUTH_GITLAB_CLIENT_ID}
        clientSecret: ${AUTH_GITLAB_CLIENT_SECRET}
        audience: https://gitlab.com # Or your self-hosted GitLab instance URL
```

### 2. Generate a GitLab Application client ID and secret

- Log into GitLab
- Navigate to (Profile > Settings >
  Applications)[https://gitlab.com/-/profile/applications]
- Name your application
- Set Callback URL = `http://localhost:7000/api/auth/gitlab/handler/frame`
- Select the following values:
  - `read_user` (Read the authenticated user's personal information)
  - `read_repository` (Allows read-only access to the repository)
  - `write_repository` (Allows read-write access to the repository)
  - `openid` (Authenticate using OpenID Connect)
  - `profile` (Allows read-only access to the user's personal information using
    OpenID Connect)
  - `email` (Allows read-only access to the user's primary email address using
    OpenID Connect)
- Click [Save application]
- On the next page, copy and paste your new Application ID and Secret to
  environment variables defined in the `app-config.yaml` file,
  `AUTH_GITLAB_CLIENT_ID` & `AUTH_GITLAB_CLIENT_SECRET`

</p>
</details>

<details><summary>Google</summary>
<p>

### 1. Open `app-config.yaml` and change it as follows

_from:_

```yaml
auth:
  providers: {}
```

_to:_

```yaml
auth:
  providers:
    google:
      development:
        clientId: ${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
```

### 2. Generate Google Credentials in Google Cloud console

- Log into https://console.cloud.google.com
- Select or create a new project from the dropdown on the top bar
- Navigate to (APIs & Services >
  Credentials)[https://console.cloud.google.com/apis/credentials]
- Click Create Credentials and select [OAuth client ID]
- Select Web Application as the application type
- Add new Authorised JavaScript origin = `http://localhost:3000`
- Add new Authorised redirect URI =
  `http://localhost:7000/api/auth/google/handler/frame`
- Click [Save application]
- Google should display a modal with your Client ID and Secret. Copy and paste
  those to environment variables defined in the `app-config.yaml` file,
  `AUTH_GOOGLE_CLIENT_ID` & `AUTH_GOOGLE_CLIENT_SECRET`

</p>
</details>

<details><summary>Microsoft</summary>
<p>

### 1. Open `app-config.yaml` and change it as follows

_from:_

```yaml
auth:
  providers: {}
```

_to:_

```yaml
auth:
  providers:
    microsoft:
      development:
        clientId: ${AUTH_MICROSOFT_CLIENT_ID}
        clientSecret: ${AUTH_MICROSOFT_CLIENT_SECRET}
        tenantId: ${AUTH_MICROSOFT_TENANT_ID}
```

### 2. Create a Microsoft App Registration in Microsoft Portal

- Log into https://portal.azure.com
- Navigate to (Azure Active Directory > App
  Registrations)[https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps]
- Create a New Registration
- Add new Redirect URI = `http://localhost:3000`
- Add new Authorised redirect URI =
  `http://localhost:7000/api/auth/microsoft/handler/frame`
- Click [Save application]
- Set environment variable `AUTH_MICROSOFT_CLIENT_ID` from
  `Application (client) Id` displayed on the directory page
- Set environment variable `AUTH_MICROSOFT_TENANT_ID` from
  `Directory (tenant) ID` displayed on the directory page
- Navigate to Certificates & Secrets section and click [Create a new secret]
- Set environment variable `AUTH_MICROSOFT_CLIENT_SECRET` from the `value` field
  created.

</p>
</details>

<details><summary>Auth0</summary>
<p>

### 1. Open `app-config.yaml` and change it as follows

_from:_

```yaml
auth:
  providers: {}
```

_to:_

```yaml
auth:
  providers:
    auth0:
      development:
        clientId: ${AUTH_AUTH0_CLIENT_ID}
        clientSecret: ${AUTH_AUTH0_CLIENT_SECRET}
        domain: ${AUTH_AUTH0_DOMAIN_ID}
```

### 2. Create an Auth0 application in the Auth0 management console

- Log into https://manage.auth0.com/dashboard/
- Navigate to Applications
- Create a New Application
  - Select Single Page Web Application
- Go to Settings tab
- Add new line to Allowed Callback URLs =
  `http://localhost:7000/api/auth/auth0/handler/frame`
- Click [Save Changes]
- Set environment variables displayed on the Basic Information page
  - `AUTH_AUTH0_CLIENT_ID` from `Client ID` displayed on Auth0 application page
  - `AUTH_AUTH0_CLIENT_SECRET` from `Client Secret` displayed on Auth0
    application page
  - `AUTH_AUTH0_DOMAIN_ID` from `Domain` displayed on Auth0 application page

</p>
</details>

### 3. Set environment variables in whatever fashion is easiest for you. I chose to

add mine to my `.zshrc` profile.

```zsh
# For macOS Catalina & Z Shell
# ------ simple-backstage-app GitHub
#
# (Change the name of the environment variables based on your auth setup above)
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
# export AUTH_GITHUB_ENTERPRISE_INSTANCE_URL=https://github.{MY_BIZ}.com
```

### 4. And of course I need to source that file.

```zsh
# Loading the new variables
% source ~/.zshrc

# Any other currently opened terminals need to be restarted to pick up the new values
# verify your setup by running env
% env
# should output something like
> ...
> AUTH_GITHUB_CLIENT_ID=xxx
> AUTH_GITHUB_CLIENT_SECRET=xxx
> ...
```

### 5. Open and change _root > packages > app > src >_ `App.tsx` to use correct

authentication provider reference

```tsx
import { githubAuthApiRef, SignInPage } from '@backstage/core';
```

Modify the imported reference based on the authentication method you selected
above:

| Auth Provider | Import Name         |
| ------------- | ------------------- |
| GitHub        | githubAuthApiRef    |
| GitLab        | gitlabAuthApiRef    |
| Google        | googleAuthApiRef    |
| Microsoft     | microsoftAuthApiRef |
| Auth0         | auth0AuthApiRef     |

### 6. In the same file, modify createApp

Remember to modify the provider information based on the table above.

```tsx
const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => (
      <SignInPage
        {...props}
        auto
        provider={{
          id: 'github-auth-provider',
          title: 'GitHub',
          message: 'Simple Backstage Application Login',
          apiRef: githubAuthApiRef,
        }}
      />
    ),
  },
});
```

After finishing setting up one (or multiple) authentication providers defined
above you can start the backend and frontend as before

When the browser loads, you should be presented with a login page for GitHub.
Login as usual with your GitHub account. If this is your first time, you will be
asked to authorize and then are redirected to the catalog page if all is well.

For more information you can clone
[the backstage-auth-example repository](https://github.com/RoadieHQ/backstage-auth-example).
Each authentication setting is set up there on a branch named after the
authentication provider.

# Where to go from here

> You're probably eager to write your first custom plugin. Follow this next
> tutorial for an in-depth look at a custom GitHub repository browser plugin.
> [Adding Custom Plugin to Existing Monorepo App](quickstart-app-plugin.md).
