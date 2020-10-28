---
id: quickstart-app-auth
title: Monorepo App Setup With Authentication
---

###### September 15th 2020 - @backstage/create-app - v0.1.1-alpha.21

<br />

> This document takes you through setting up a Backstage app that runs in your
> own environment. It starts with a skeleton install and verifying of the
> monorepo's functionality. Next, GitHub authentication is added and tested.
>
> This document assumes you have Node.js 12 active along with Yarn and Python.
> Please note, that at the time of this writing, the current version is
> 0.1.1-alpha.21. This guide can still be used with future versions, just,
> verify as you go. If you run into issues, you can compare your setup with mine
> here >
> [simple-backstage-app](https://github.com/johnson-jesse/simple-backstage-app).

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

1. Open `app-config.yaml` and change it as follows

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
        clientId:
          $env: AUTH_GITHUB_CLIENT_ID
        clientSecret:
          $env: AUTH_GITHUB_CLIENT_SECRET
        ## uncomment the following three lines if using enterprise
        # enterpriseInstanceUrl:
        #  $env: AUTH_GITHUB_ENTERPRISE_INSTANCE_URL
```

2. Set environment variables in whatever fashion is easiest for you. I chose to
   add mine to my `.zshrc` profile.

```zsh
# For macOS Catalina & Z Shell
# ------ simple-backstage-app GitHub
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
# export AUTH_GITHUB_ENTERPRISE_INSTANCE_URL=https://github.{MY_BIZ}.com
```

3. And of course I need to source that file.

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

4. The values to replace `xxx` above come from your oauth app setup.

```
> Log into http://github.com
> Navigate to (Settings > Developer Settings > OAuth Apps > New OAuth App)[https://github.com/settings/applications/new]
> Set Homepage URL = http://localhost:3000
> Set Callback URL = http://localhost:7000/api/auth/github
> Click [Register application]
> On the next page, copy and paste your new Client ID and Client Secret to the environment variables above, `AUTH_GITHUB_CLIENT_ID` & `AUTH_GITHUB_CLIENT_SECRET`
> Don't forget to `source` that profile file again if necessary.
```

5. Open and change _root > packages > app > src >_`App.tsx` as follows

```tsx
// Add the following imports to the existing list from core
import { githubAuthApiRef, SignInPage } from '@backstage/core';
```

6. In the same file, change the createApp function as follows

```tsx
const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={[
            {
              id: 'github-auth-provider',
              title: 'GitHub',
              message: 'Simple Backstage Application Login',
              apiRef: githubAuthApiRef,
            },
          ]}
          align="center"
        />
      );
    },
  },
});
```

7. Start the backend and frontend as before

When the browser loads, you should be presented with a login page for GitHub.
Login as usual with your GitHub account. If this is your first time, you will be
asked to authorize and then are redirected to the catalog page if all is well.

# Where to go from here

> You're probably eager to write your first custom plugin. Follow this next
> tutorial for an in-depth look at a custom GitHub repository browser plugin.
> [Adding Custom Plugin to Existing Monorepo App](quickstart-app-plugin.md).
