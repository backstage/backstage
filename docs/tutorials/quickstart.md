---
id: quickstart
title: Quickstart - Standalone App with Auth & Plugin
---

> This document takes you through my journey in standing up an isolated
> Backstage Application in three steps. It starts with a skeleton install and
> verifying of that functionality. Next, GitHub authentication is added. And
> finally, a custom plugin is created that utilizes a few canned API's. This
> document assumes you have NodeJS 12 active along with Yarn and Docker
> installed. Please note, that at the time of this writing, the current version
> is 0.1.1-alpha.20. This guide can still be used with future versions, just,
> verify as you go. If you run into issues, you can compare your setup with mine
> here >
> [simple-backstage-app](https://github.com/johnson-jesse/simple-backstage-app)
>
> _September 11th 2020 - @backstage/create-app - v0.1.1-alpha.20_

# The Skeleton Application

From the terminal:

1. Create a standalone app: `npx @backstage/create-app`
1. Enter an `id` for your new app like `simple-backstage-app`
1. Choose `PostgreSQL` as your database
1. Set environment variables in whatever fashion is easiest for you

```zsh
# For macOS Catalina & Z Shell
# ------ simple-backstage-app Postgres
export POSTGRES_PASSWORD=example
export POSTGRES_USER=postgres
# Don't forget to source this file
```

5. Create a new directory `simple-backstage-app/packages/database`
1. Add a new file named `db.yaml` in your new directory
1. Add the following config to your new yaml file

```yaml
version: '3'

services:
  bah-backstage-db:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - ./store:/var/lib/postgresql/data
```

8. Start the database. From your root directory:
   `docker-compose -f packages/database/db.yaml up`

```zsh
# You should see positive verbiage in your terminal output
simple-backstage-db_1  | 2020-09-11 20:50:39.330 UTC [1] LOG:  database system is ready to accept connections
```

9. When the database starts up, a new directory, `store` is added. Let's exclude
   that from tracking. Add `store/` somewhere in your .gitignore
1. We need to create two databases, `backstage_plugin_catalog` &
   `backstage_plugin_auth` before we can start the backend.

```psql
psql -h localhost -p 5432 -U postgres
CREATE DATABASE backstage_plugin_catalog;
CREATE DATABASE backstage_plugin_auth;
-- you can also use a db client to do this
```

Your file structure should now look something like this

```bash
- simple-backstage-app
 - packages
    + app
    + backend
    - database
       + store
       db.yaml
```

11. Start your backend. Open a new terminal window and from the root of your
    project, run: `yarn --cwd packages/backend start`

```zsh
# You should see positive verbiage in your terminal output
2020-09-11T22:20:26.712Z backstage info Listening on :7000
```

12. Finally, start the frontend. Open a new terminal window and from the root of
    your project, run: `yarn start`

```zsh
# You should see positive verbiage in your terminal output
ℹ ｢wdm｣: Compiled successfully.
```

At this point, you've finished step one. A browser window should have popped
your standalone application loaded at `localhost:3000`. Since there is no auth
currently, you are automatically entered as a guest. Let's add auth now.

# The Auth Configuration

1. Change `app-config.yaml` as follows

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
          $secret:
            env: AUTH_GITHUB_CLIENT_ID
        clientSecret:
          $secret:
            env: AUTH_GITHUB_CLIENT_SECRET
```

2. Set environment variables in whatever fashion is easiest for you

```zsh
# For macOS Catalina & Z Shell
# ------ simple-backstage-app GitHub
export AUTH_GITHUB_CLIENT_ID=xxx
export AUTH_GITHUB_CLIENT_SECRET=xxx
# Don't forget to source this file
```

3. The values to replace `xxx` above come from your oauth app setup.
   [Follow this guide for more information](https://docs.github.com/en/developers/apps/creating-an-oauth-app)
   or:

```
> Log into GitHub
> GOTO Settings > Developer Settings > OAuth Apps and click [New OAuth App]
> Homepage URL = http://localhost:3000
> Callback URL = http://localhost:7000/auth/github
> Copy and paste your ID and Secret to the env vars above.
```

4. Change `App.tsc` as follows

```tsx
// Add the following imports to the existing list from core
import { githubAuthApiRef, SignInPage } from '@backstage/core';
```

5. In the same file, change the createApp function as follows

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

6. Change `apis.ts` as follows

```ts
// Add the following imports to the existing list from core
import { githubAuthApiRef, GithubAuth } from '@backstage/core';
```

7. In the same file, change the builder block for oauthRequestApiRef as follows

_from:_

```ts
builder.add(oauthRequestApiRef, new OAuthRequestManager());
```

_to:_

```ts
const oauthRequestApi = builder.add(
  oauthRequestApiRef,
  new OAuthRequestManager(),
);

builder.add(
  githubAuthApiRef,
  GithubAuth.create({
    discoveryApi,
    oauthRequestApi,
  }),
);
```

8. Stop your back and front ends. From a terminal and the project root, run:
   `yarn build`. And once again, start the backend and frontend as before. When
   the browser loads, you should be presented with a login page for GitHub.
   Login as usual with your GitHub account. If this is your first time, you will
   be asked to authorize and then are redirected to the catalog page if all is
   well. This finishes step 2. Our last goal is to setup a custom plugin and
   explore interacting with GitHub using the API framework.

# The Custom Plugin

1. Start by using the built in creator. From the terminal and root of your
   project: `yarn create-plugin`
1. Enter a plugin ID. I used `github-playground`
1. When the process finishes, assuming your back & front ends are still running,
   manually navigate to `http://localhost:3000/github-playground`
1. You should see successful verbiage on the plugin endpoint,
   `Welcome to github-playground!`
1. Let's add a shortcut. Inside `root: packages > app > src > sidebar.tsx` add
   the following:

```tsx
import GitHubIcon from '@material-ui/icons/GitHub';
...
<SidebarItem icon={GitHubIcon} to="github-playground" text="GitHub Repository" />
```

6. You should now see a github icon displayed in the sidebar.
1. Now we can modify our plugin. Modify
   `root: plugins > github-playground > src > components > ExampleComponent > ExampleComponent.tsx`

```tsx
// Add identityApiRef to the list of imported from core
import { identityApiRef } from '@backstage/core';
import { useApi } from '@backstage/core-api';

// Adjust the functional component as
const ExampleComponent: FC<{}> = () => {
  const identityApi = useApi(identityApiRef);
  const userId = identityApi.getUserId();
  const profile = identityApi.getProfile();
  return (
    // ...
    // Change the InfoCard as follows
    <InfoCard title={userId}>
      <Typography variant="body1">
        {`${profile.displayName} | ${profile.email}`}
      </Typography>
    </InfoCard>
    // ...
  );
};
```

8. Verify you can see your name, id, and email on the github-playground page
9. Finally, modify
   `root: plugins > github-playground > src > components > ExampleFetchComponent > ExampleFetchComponent.tsx`.
   The full file is included here.

```tsx
import React, { FC } from 'react';
import { useAsync } from 'react-use';
import Alert from '@material-ui/lab/Alert';
import {
  Table,
  TableColumn,
  Progress,
  githubAuthApiRef,
} from '@backstage/core';
import { useApi } from '@backstage/core-api';
import { graphql } from '@octokit/graphql';

type Node = {
  name: string;
  createdAt: string;
  description: string;
  diskUsage: number;
  isFork: boolean;
};

type Viewer = {
  repositories: {
    totalCount: number;
    nodes: Node[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
};

type DenseTableProps = {
  viewer: Viewer;
};

export const DenseTable: FC<DenseTableProps> = ({ viewer }) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Created', field: 'createdAt' },
    { title: 'Description', field: 'description' },
    { title: 'Disk Usage', field: 'diskUsage' },
    { title: 'Fork', field: 'isFork' },
  ];

  return (
    <Table
      title="List Of User's Repositories"
      options={{ search: false, paging: false }}
      columns={columns}
      data={viewer.repositories.nodes}
    />
  );
};

const query = `{
  viewer {
    repositories(first: 100) {
      totalCount
      nodes {
        name
        createdAt
        description
        diskUsage
        isFork
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}`;

const ExampleFetchComponent: FC<{}> = () => {
  const auth = useApi(githubAuthApiRef);

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const token = await auth.getAccessToken();

    const gqlEndpoint = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
    const { viewer } = await gqlEndpoint(query);
    return viewer;
  }, []);

  if (loading) return <Progress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (value && value.repositories) return <DenseTable viewer={value} />;

  return (
    <Table
      title="List Of User's Repositories"
      options={{ search: false, paging: false }}
      columns={[]}
      data={[]}
    />
  );
};

export default ExampleFetchComponent;
```

10. After saving that, you should see a table with basic information on your
    repositories.

### Plugin Summary

`ExampleComponent.tsc` makes use of Backstage's Identity API. Using that we gain
access to free and easy data like about ourself. Name, email, etc. For more
detailed work in `ExampleFetchComponent.tsx`, we make use of Backstage's
GithubAuth API for getting the access token. Because graphql can be a pain and
we already have `@octokit/graphql` in the project, we leverage the ease that
brings in fetching our data. This same code can be used to work with Enterprise
GitHub by adding one line to `graphql.defaults`.

```tsx
const gqlEndpoint = graphql.defaults({
  baseUrl: 'https://github.SOME-ORG.com/api',
  headers: {
    authorization: `token ${token}`,
  },
});
```

The Node, Viewer types support our specific query structure we expect back

```javascript
const query = `{
  viewer {
    repositories(first: 100) {
      totalCount
      nodes {
        name
        createdAt
        description
        diskUsage
        isFork
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}`;
```

If you found this helpful and want to let me know, I can be found hanging out on
Backstage's public Discord channel as fizzog#3211. If you see an issue or
enhancement that would make our lives easier, please shoot me a message or visit
the
[GitHub Repo With All This Code](https://github.com/johnson-jesse/simple-backstage-app)
