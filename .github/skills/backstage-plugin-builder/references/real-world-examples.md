# Real-World Plugin Examples

Annotated architecture of proven open-source Backstage plugins. Model your plugin after the one closest to your use case.

---

## OpsGenie Plugin (K-Phoen/backstage-plugin-opsgenie)

**Use case**: Display alerts, incidents, and on-call schedules from OpsGenie in Backstage.

### Architecture

```
plugin-opsgenie (frontend)
├── OpsGeniePage           — Full standalone page with tabs:
│   ├── Alerts tab         — Filterable alert list with ack/close actions
│   ├── Incidents tab      — Incident list with status
│   ├── On-call tab        — Who's on call per schedule
│   └── Analytics tab      — Incident analytics over time
├── EntityOpsgenieAlertsCard — Entity card showing recent alerts
└── config.d.ts            — OpsGenie domain, API key visibility
```

**Key patterns used**:
- `createRoutableExtension` for the standalone page
- `createComponentExtension` for the entity card
- Entity annotation: `opsgenie.com/component-selector` to filter alerts
- Uses Backstage proxy (`proxy.endpoints./opsgenie`) for API calls — no separate backend plugin
- `useAsync` hook for data fetching
- Material-UI `Table` with pagination
- `InfoCard` wrapper for consistent layout

**Why proxy instead of backend plugin?** OpsGenie plugin only does read operations with simple header auth — proxy is sufficient.

### Config

```yaml
proxy:
  endpoints:
    '/opsgenie':
      target: 'https://api.opsgenie.com/v2'
      headers:
        Authorization: 'GenieKey ${OPSGENIE_API_KEY}'

opsgenie:
  domain: 'https://mycompany.app.opsgenie.com'
```

---

## Roadie GitHub Pull Requests Plugin

**Use case**: Show open PRs for a component's GitHub repo on the entity page.

### Architecture

```
@roadiehq/backstage-plugin-github-pull-requests (frontend)
├── EntityGithubPullRequestsCard     — Card showing PR list
├── EntityGithubPullRequestsContent  — Full tab with PR details
├── EntityGithubPullRequestsOverviewCard — Summary with counts
└── API client                       — Calls GitHub API via Backstage's GitHub integration
```

**Key patterns used**:
- Entity annotation: `github.com/project-slug` (e.g., `my-org/my-repo`)
- Uses Backstage's built-in GitHub integration (no custom proxy needed)
- `useEntity()` to get the current entity's annotations
- `MissingAnnotationEmptyState` when annotation is missing
- `catalogApiRef` for cross-entity lookups
- Multiple export shapes: Card, Content (tab), Overview card

### Entity Annotation

```yaml
metadata:
  annotations:
    github.com/project-slug: 'my-org/my-repo'
```

---

## Roadie Jira Plugin

**Use case**: Show Jira issues for a component on the entity page.

### Architecture

```
@roadiehq/backstage-plugin-jira (frontend)
├── EntityJiraOverviewCard — Card with activity stream + issue counts
└── Jira API client        — Calls Jira via Backstage proxy

proxy config:
  '/jira/api' → Jira Cloud REST API with basic auth
```

**Key patterns**:
- Uses proxy pattern with Basic auth header
- Entity annotation: `jira/project-key`
- Caches API responses client-side with `useAsync` + SWR-like pattern
- Activity stream component with timeline UI

---

## Catalog Backend Module: GitHub Discovery

**Use case**: Automatically discover and register all repos from a GitHub org.

### Architecture

```
plugin-catalog-backend-module-github
├── GithubEntityProvider      — Discovers repos, emits Component entities
├── GithubLocationAnalyzer    — Analyzes URLs to detect GitHub repos
├── GithubDiscoveryProcessor  — Processes GitHub catalog locations
└── module.ts                 — Registers via catalogProcessingExtensionPoint
```

**Key patterns**:
- `createBackendModule` targeting `pluginId: 'catalog'`
- Full/delta mutations via `EntityProviderConnection.applyMutation()`
- Scheduled refresh using `coreServices.scheduler`
- `fromConfig` static factory pattern for configuration
- Exports both the module default and individual classes for testing

### Registration

```typescript
// packages/backend/src/index.ts
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
```

### Config

```yaml
catalog:
  providers:
    github:
      myOrg:
        organization: 'my-org'
        catalogPath: '/catalog-info.yaml'
        schedule:
          frequency: { minutes: 30 }
          timeout: { minutes: 3 }
```

---

## Pattern Summary: Which to Model After

| Your plugin type | Model after | Key pattern |
|---|---|---|
| Dashboard showing external data | OpsGenie | Standalone page + proxy |
| Entity card from external API | Roadie GitHub PRs | Annotation + `useEntity()` + entity card |
| Entity card via REST proxy | Roadie Jira | Proxy + entity annotation |
| Auto-discover entities | GitHub Discovery Module | BackendModule + EntityProvider + scheduler |
| Full CRUD with backend logic | PagerDuty (community-plugins) | Backend plugin + frontend + common types |
| Template action | Community scaffolder modules | `createTemplateAction` + scaffolder module |

---

## Common Component Patterns (Frontend)

### Data Fetching with useAsync

```typescript
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';

export const AlertsList = () => {
  const api = useApi(myPluginApiRef);
  const { value, loading, error } = useAsync(() => api.getAlerts(), []);

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;

  return (
    <Table
      title="Alerts"
      columns={columns}
      data={value ?? []}
      options={{ paging: true, pageSize: 10 }}
    />
  );
};
```

### InfoCard Wrapper

```typescript
import { InfoCard } from '@backstage/core-components';

export const MyCard = () => (
  <InfoCard title="My Plugin" subheader="Recent activity">
    <AlertsList />
  </InfoCard>
);
```

### Conditional Rendering by Entity Kind

```typescript
import { isKind } from '@backstage/plugin-catalog-react';

// In EntityPage.tsx
<EntitySwitch>
  <EntitySwitch.Case if={isKind('component')}>
    <EntityMyPluginCard />
  </EntitySwitch.Case>
</EntitySwitch>
```
