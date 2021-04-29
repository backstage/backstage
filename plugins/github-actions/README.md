# GitHub Actions Plugin

Website: [https://github.com/actions](https://github.com/actions)

## Screenshots

TBD

## Setup

### Generic Requirements

1. Provide OAuth credentials:
   1. [Create an OAuth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) with callback URL set to `http://localhost:7000/api/auth/github`.
   2. Take Client ID and Client Secret from the newly created app's settings page and put them into `AUTH_GITHUB_CLIENT_ID` and `AUTH_GITHUB_CLIENT_SECRET` env variables.
2. Annotate your component with a correct GitHub Actions repository and owner:

   The annotation key is `github.com/project-slug`.

   Example:

   ```
   apiVersion: backstage.io/v1alpha1
   kind: Component
   metadata:
     name: backstage
     description: backstage.io
     annotations:
       github.com/project-slug: 'backstage/backstage'
   spec:
     type: website
     lifecycle: production
     owner: user:guest
   ```

### Standalone app requirements

1. Install the plugin dependency in your Backstage app package:

```bash
cd packages/app
yarn add @backstage/plugin-github-actions
```

2. Add to the app `EntityPage` component:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityGithubActionsContent } from '@backstage/plugin-github-actions';

// ...
const serviceEntityPage = (
  <EntityPageLayout>
    ...
    <EntityLayout.Route path="/github-actions" title="GitHub Actions">
      <EntityGithubActionsContent />
    </EntityLayout.Route>
    ...
  </EntityPageLayout>
);
```

2. Run the app with `yarn start` and the backend with `yarn --cwd packages/backend start`, navigate to `/github-actions/`.

## Features

- List workflow runs for a project
- Dive into one run to see a job steps
- Retry runs
- Pagination for runs

## Limitations

- There is a limit of 100 apps for one OAuth client/token pair
