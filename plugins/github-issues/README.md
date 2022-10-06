# GitHub Issues plugin

Welcome to the GitHub Issues plugin!

Based on the [well-known GitHub slug annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#githubcomproject-slug) associated with the Entity, it renders the list of Open issues in GitHub.

The plugin is designed to work with four Entity kinds, and it behaves a bit differently depending on that kind:

- Kind: Group/User: plugin renders issues from all repositories for which the Entity is the owner.
- Kind: API/Component: plugin renders issues from only one repository assigned to the Entity

**Issues are sorted from the recently updated DESC order (the plugin might not render all issues from a single repo next to each other).**

## Prerequisites

- [GitHub Authentication Provider](https://backstage.io/docs/auth/github/provider)

## Usage

Install the plugin by running the following command **from your Backstage root directory**

`yarn --cwd packages/app add @backstage/plugin-github-issues`

After installation, the plugin can be used as a Card or as a Page.

```typescript
import {
  GitHubIssuesCard,
  GitHubIssuesPage,
} from '@backstage/plugin-github-issues';

// To use as a page Plugin needs to be wrapped in EntityLayout.Route
const RenderGitHubIssuesPage = () => (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <EntityLayout.Route path="github-issues" title="GitHub Issues">
        <GitHubIssuesPage />
      </EntityLayout.Route>
    <EntityLayout.Route />
  </EntityLayoutWrapper>
);

// To use as a card and make it render correctly please place it inside appropriate Grid elements
const RenderGitHubIssuesCard = () => (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GitHubIssuesCard />
        </Grid>
      </Grid>
    <EntityLayout.Route />
  </EntityLayoutWrapper>
);
```

## Configuration

Both `GitHubIssuesPage` and `GitHubIssuesCard` provide default configuration. It is ready to use out of the box.
However, you can configure the plugin with props:

- `itemsPerPage: number = 10` - Issues in the list are paginated, number of issues on a single page is controlled with this prop
- `itemsPerRepo: number = 40` - the plugin doesn't download all Issues available on GitHub. By default, it will get at most 40 Issues - this prop controls this behaviour
- `filterBy: object` - the plugin can be configured to filter the query by `assignee`, `createdBy`, `labels`, `states`, `mentioned` or `milestone`.
- `orderBy: object = { field: 'UPDATED_AT', direction: 'DESC' }` - The ordering that the issues are returned can be configured by the `orderBy` field.

### `filterBy` and `orderBy` example

```ts
<GitHubIssuesCard
  filterBy={{
    labels: ['bug', 'enhancement'],
    states: ['OPEN'],
  }}
  orderBy={{
    field: 'COMMENTS',
    direction: 'ASC',
  }}
/>
```
