---
id: quickstart-app-plugin
title: Adding Custom Plugin to Existing Monorepo App
description: Tutorial for adding a custom plugin to an existing Backstage monorepo application
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./quickstart-app-plugin--old.md)
instead.
::::

> This document takes you through setting up a new plugin for your existing
> monorepo with a _GitHub provider already setup_.
>
> This document does not cover authoring a plugin for sharing with the Backstage
> community. That will have to be a later discussion.
>
> We start with a skeleton plugin install. And after verifying its
> functionality, we add custom code to display GitHub repository information.

## The Skeleton Plugin

1. Start by using the built-in creator. From the terminal and root of your
   project run: `yarn new` and select `frontend-plugin`.
1. Enter a plugin ID. We'll use `github-playground` for this tutorial.
1. When the process finishes, let's start the backend:
   `yarn --cwd packages/backend start`
1. If you see errors starting, refer to
   [Auth Configuration](https://backstage.io/docs/auth/) for more information on
   environment variables.
1. And now the frontend, from a new terminal window and the root of your
   project: `yarn start`
1. As usual, a browser window should popup loading the App.
1. Now manually navigate to the plugin page from your browser:
   `http://localhost:3000/github-playground`
1. You should see successful verbiage for this endpoint,
   `Welcome to github-playground!`

With the new frontend system, plugins are auto-discovered when installed as
dependencies of your `packages/app` package. The plugin was already added there
by `yarn new`, so the route and a sidebar item are available without any manual
wiring in `App.tsx` or `Root.tsx`.

## The Identity

Our first modification will be to extract information from the Identity API.

1. Start by opening
   `root: plugins > github-playground > src > components > ExampleComponent > ExampleComponent.tsx`
1. Add two new imports

```tsx
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
```

3. Adjust the ExampleComponent from inline to block

_from inline:_

```tsx
const ExampleComponent = () => ( ... )
```

_to block:_

```tsx
const ExampleComponent = () => {

    return (
        ...
    )
}
```

4. Now add our hook and const data before the return statement

```tsx
const identityApi = useApi(identityApiRef);

const userId = identityApi.getUserId();
const profile = identityApi.getProfile();
```

5. Finally, update the InfoCard's jsx to use our new data

```tsx
<InfoCard title={userId}>
  <Typography variant="body1">
    {`${profile.displayName} | ${profile.email}`}
  </Typography>
</InfoCard>
```

If everything is saved, you should see your name, id, and email on the
github-playground page. Our data accessed is synchronous. So we just grab and
go.

https://github.com/backstage/backstage/tree/master/contrib

6. Here is the entire file for reference
   [ExampleComponent.tsx](https://github.com/backstage/backstage/tree/master/contrib/docs/tutorials/quickstart-app-plugin/ExampleComponent.md)

## The Wipe

The last file we will touch is ExampleFetchComponent. Because of the number of
changes, let's start by wiping this component clean.

1. Start by opening
   `root: plugins > github-playground > src > components > ExampleFetchComponent > ExampleFetchComponent.tsx`
1. Replace everything in the file with the following:

```tsx
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { githubAuthApiRef, useApi } from '@backstage/core-plugin-api';
import { graphql } from '@octokit/graphql';

export const ExampleFetchComponent = () => {
  return <div>Nothing to see yet</div>;
};
```

3. Save that and ensure you see no errors. Comment out the unused imports if
   your linter gets in the way.

###### We will add a lot to this file for the sake of ease. Please don't do this in productional code!

## The Graph Model

GitHub has a GraphQL API available for interacting. Let's start by adding our
basic repository query

1. Add the query const statement outside ExampleFetchComponent

```tsx
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

2. Using this structure as a guide, we will break our query into type parts
3. Add the following outside of ExampleFetchComponent

```tsx
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
```

## The Table Model

Using Backstage's own component library, let's define a custom table. This
component will get used if we have data to display.

1. Add the following outside of ExampleFetchComponent

```tsx
type DenseTableProps = {
  viewer: Viewer;
};

export const DenseTable = ({ viewer }: DenseTableProps) => {
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
```

## The Fetch

We're ready to flush out our fetch component

1. Add our api hook inside ExampleFetchComponent

```tsx
const auth = useApi(githubAuthApiRef);
```

2. The access token we need to make our GitHub request and the request itself is
   obtained in an asynchronous manner.
3. Add the `useAsync` block inside the ExampleFetchComponent

```tsx
const { value, loading, error } = useAsync(async (): Promise<any> => {
  const token = await auth.getAccessToken();

  const gqlEndpoint = graphql.defaults({
    // Uncomment baseUrl if using enterprise
    // baseUrl: 'https://github.MY-BIZ.com/api',
    headers: {
      authorization: `token ${token}`,
    },
  });
  const { viewer } = await gqlEndpoint(query);
  return viewer;
}, []);
```

4. The resolved data is conveniently destructured with `value` containing our
   Viewer type. `loading` as a boolean, self explanatory. And `error` which is
   present only if necessary. So let's use those as the first 3 of 4 multi
   return statements.
5. Add the _if return_ blocks below our async block

```tsx
if (loading) return <Progress />;
if (error) return <Alert severity="error">{error.message}</Alert>;
if (value && value.repositories) return <DenseTable viewer={value} />;
```

6. The third line here utilizes our custom table accepting our Viewer type.
7. Finally, we add our _else return_ block to catch any other scenarios.

```tsx
return (
  <Table
    title="List Of User's Repositories"
    options={{ search: false, paging: false }}
    columns={[]}
    data={[]}
  />
);
```

8. After saving that, and given we don't have any errors, you should see a table
   with basic information on your repositories.
9. Here is the entire file for reference
   [ExampleFetchComponent.tsx](https://github.com/backstage/backstage/tree/master/contrib/docs/tutorials/quickstart-app-plugin/ExampleFetchComponent.md)
10. We finished! You should see your own GitHub repository's information
    displayed in a basic table. If you run into issues, you can compare the repo
    that backs this document,
    [simple-backstage-app-plugin](https://github.com/johnson-jesse/simple-backstage-app-plugin)

## Where to go from here

> Break apart ExampleFetchComponent into smaller logical parts contained in
> their own files. Rename your components to something other than ExampleXxx.
>
> You might be really proud of a plugin you develop. Consider sharing it with
> the Backstage community by contributing to the [community-plugins repository](https://github.com/backstage/community-plugins).
