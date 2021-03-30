# GitHub Deployments Plugin

The GitHub Deployments Plugin displays recent deployments from GitHub.

![github-deployments-card](./docs/github-deployments-card.png)

## Getting Started

1. Provide OAuth credentials:

- Create an [OAuth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) and set env variables for ID and Secret.

```bash
export AUTH_GITHUB_CLIENT_ID={{YOUR_CLIENT_ID}}
export AUTH_CLIENT_SECRET={{YOUR_CLIENT_SECRET}}
```

2. Install the GitHub Deployments Plugin.

```bash
# packages/app

yarn add @backstage/plugin-github-deployments
```

3. Add the plugin to the app

```typescript
// packages/app/src/plugins.ts

export { plugin as GithubDeployments } from '@backstage/plugin-github-deployments';
```

4. Add the `EntityGithubDeploymentsCard` to the EntityPage:

```typescript
// packages/app/src/components/catalog/EntityPage.tsx

import { EntityGithubDeploymentsCard } from '@backstage/plugin-github-deployments';

const OverviewContent = () => (
  <Grid container spacing={3} alignItems="stretch">
    // ...
    <Grid item xs={12} sm={6} md={4}>
      <EntityGithubDeploymentsCard />
    </Grid>
    // ...
  </Grid>
);
```

5. Add the `github.com/project-slug` annotation to your `catalog-info.yaml` file:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  description: |
    Backstage is an open-source developer portal that puts the developer experience first.
  annotations:
    github.com/project-slug: YOUR_PROJECT_SLUG
spec:
  type: library
  owner: CNCF
  lifecycle: experimental
```
