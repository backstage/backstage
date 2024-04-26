---
id: authentication
title: Authentication
description: How to set up authentication into your Backstage installation
---

Audience: Admins or Developers

### Setting up authentication

There are multiple authentication providers available for you to use with
Backstage, feel free to follow
[the instructions for adding authentication](../../auth/index.md).

For this tutorial we choose to use GitHub, a free service most of you might be
familiar with. For other options, see
[the auth provider documentation](../../auth/github/provider.md#create-an-oauth-app-on-github).

Go to
[https://github.com/settings/applications/new](https://github.com/settings/applications/new)
to create your OAuth App. The `Homepage URL` should point to Backstage's
frontend, in our tutorial it would be `http://localhost:3000`. The
`Authorization callback URL` will point to the auth backend, which will most
likely be `http://localhost:7007/api/auth/github/handler/frame`.

![Screenshot of the GitHub OAuth creation page](../../assets/getting-started/gh-oauth.png)

Take note of the `Client ID` and the `Client Secret`. Open `app-config.yaml`,
and add your `clientId` and `clientSecret` to this file. It should end up
looking like this:

```yaml title="app-config.yaml"
auth:
  # see https://backstage.io/docs/auth/ to learn about auth providers
  environment: development
  providers:
    github:
      development:
        clientId: YOUR CLIENT ID
        clientSecret: YOUR CLIENT SECRET
```

### Add sign-in option to the frontend

Backstage will re-read the configuration. If there's no errors, that's great! We
can continue with the last part of the configuration. The next step is needed to
change the sign-in page, this you actually need to add in the source code.

Open `packages/app/src/App.tsx` and below the last `import` line, add:

```typescript title="packages/app/src/App.tsx"
import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPage } from '@backstage/core-components';
```

Search for `const app = createApp({` in this file, and below `apis,` add:

```tsx title="packages/app/src/App.tsx"
components: {
  SignInPage: props => (
    <SignInPage
      {...props}
      auto
      provider={{
        id: 'github-auth-provider',
        title: 'GitHub',
        message: 'Sign in using GitHub',
        apiRef: githubAuthApiRef,
      }}
    />
  ),
},
```

> Note: The default Backstage app comes with a guest Sign In Resolver. This resolver makes all users share a single "guest" identity and is only intended as a minimum requirement to quickly get up and running. You can read more about how [Sign In Resolvers](../../auth/identity-resolver.md#sign-in-resolvers) play a role in creating a [Backstage User Identity](../../auth/identity-resolver.md#backstage-user-identity) for logged in users.

Restart Backstage from the terminal, by stopping it with `Control-C`, and starting it with `yarn dev` . You should be welcomed by a login prompt!

> Note: Sometimes the frontend starts before the backend resulting in errors on the sign in page. Wait for the backend to start and then reload Backstage to proceed.

To learn more about Authentication in Backstage, here are some docs you
could read:

- [Authentication in Backstage](../../auth/index.md)
- [Using organizational data from GitHub](../../integrations/github/org.md)

### Setting up a GitHub Integration

The GitHub integration supports loading catalog entities from GitHub or GitHub
Enterprise. Entities can be added to static catalog configuration, registered
with the catalog-import plugin, or discovered from a GitHub organization. Users
and Groups can also be loaded from an organization. While using [GitHub Apps](../../integrations/github/github-apps.md)
might be the best way to set up integrations, for this tutorial you'll use a
Personal Access Token.

Create your Personal Access Token by opening
[the GitHub token creation page](https://github.com/settings/tokens/new). Use a
name to identify this token and put it in the notes field. Choose a number of
days for expiration. If you have a hard time picking a number, we suggest to go
for 7 days, it's a lucky number.

![Screenshot of the GitHub Personal Access Token creation page](../../assets/getting-started/gh-pat.png)

Set the scope to your likings. For this tutorial, selecting `repo` and `workflow` is required as the scaffolding job in this guide configures a GitHub actions workflow for the newly created project.

For this tutorial, we will be writing the token to `app-config.local.yaml`. This file might not exist for you, so if it doesn't go ahead and create it alongside the `app-config.yaml` at the root of the project.
This file should also be excluded in `.gitignore`, to avoid accidental committing of this file.

In your `app-config.local.yaml` go ahead and add the following:

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ghp_urtokendeinfewinfiwebfweb # this should be the token from GitHub
```

That's settled. This information will be leveraged by other plugins.

If you're looking for a more production way to manage this secret, then you can do the following with the token being stored in an environment variable called `GITHUB_TOKEN`.

```yaml title="app-config.local.yaml"
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN} # this will use the environment variable GITHUB_TOKEN
```

> Note: If you've updated the configuration for your integration, it's likely that the backend will need a restart to apply these changes. To do this, stop the running instance in your terminal with `Control-C`, then start it again with `yarn dev`. Once the backend has restarted, retry the operation.

Some helpful links, for if you want to learn more about:

- [Other available integrations](../../integrations/index.md)
- [Using GitHub Apps instead of a Personal Access Token](../../integrations/github/github-apps.md#docsNav)
