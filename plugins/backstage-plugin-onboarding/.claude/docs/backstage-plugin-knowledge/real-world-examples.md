# Real-World Plugin Examples

Annotated architectures of real community plugins — use as templates for your own.

---

## 1. OpsGenie Plugin (K-Phoen/backstage-plugin-opsgenie)

**What it does:** Shows OpsGenie alerts, on-call schedules, and alert analytics within Backstage.

**Architecture:**
```
plugin-opsgenie/
  src/
    plugin.ts                     # createPlugin + routes + components
    api/
      OpsgenieApi.ts              # API ref + interface
      OpsgenieApiClient.ts        # Calls backend /api/opsgenie/*
    components/
      AlertsPage/                 # Standalone page: /opsgenie
        AlertsPage.tsx            # Full page with search + table
      OnCallPage/                 # Who's on call dashboard
      AlertsTable/                # Reusable table component
      Entity/
        AlertsSummaryCard.tsx     # EntityCardBlueprint — shows on entity page
        OnCallCard.tsx            # EntityCardBlueprint — who's on call
    hooks/
      useAlerts.ts               # useAsync + apiRef wrapper
    routes.ts                    # rootRouteRef
```

**Key patterns:**
- **Config-driven domain switching**: `domain` config supports US vs EU OpsGenie
- **Entity annotation**: `opsgenie.com/component-selector` maps entity → OpsGenie tag
- **Multiple entity cards**: One for alerts summary, one for on-call
- **Standalone page + entity cards**: Both in one plugin
- **useAsync everywhere**: Consistent data loading pattern

**app-config.yaml:**
```yaml
opsgenie:
  apiKey: ${OPSGENIE_API_KEY}
  domain: app.opsgenie.com    # or app.eu.opsgenie.com
```

---

## 2. Linguist Plugin (community-plugins)

**What it does:** Shows programming language breakdown for repositories in the catalog.

**Architecture:**
```
workspaces/linguist/
  plugins/
    linguist/                    # Frontend
      src/
        plugin.ts
        api.ts                   # LinguistApi ref + client
        components/
          EntityLinguistCard/    # Language breakdown card
        hooks/
          useLanguages.ts
    linguist-backend/            # Backend
      src/
        plugin.ts
        router.ts                # Serves language data
        processor.ts             # Catalog processor that analyzes repos
    linguist-common/             # Shared
      src/
        types.ts                 # Languages interface
```

**Key patterns:**
- **Catalog processor**: Runs during entity processing to analyze repo languages
- **Background processing**: Uses scheduler to periodically re-analyze
- **Entity-scoped**: Language data is per-entity, stored in backend DB
- **Simple FE**: Just one card showing a bar chart of language percentages

---

## 3. GitHub Pull Requests Plugin (Roadie)

**What it does:** Shows PR metrics, open PRs, and review stats for a repository.

**Architecture:**
```
backstage-plugin-github-pull-requests/
  src/
    plugin.ts
    api/
      GithubPullRequestsApi.ts           # Uses Octokit via proxy
    components/
      PullRequestsStatsCard/             # Aggregate stats card
        PullRequestsStatsCard.tsx
      PullRequestsTable/                 # Table of PRs with filters
        PullRequestsTable.tsx
        PullRequestRow.tsx
      useGithubPullRequests.ts
    utils/
      githubUtils.ts                     # PR status helpers
```

**Key patterns:**
- **Proxy-based**: Uses Backstage proxy to GitHub API (no dedicated backend)
- **Annotation**: Reads `github.com/project-slug` from entity
- **Octokit integration**: Wraps GitHub API calls with Octokit for type safety
- **Multiple card variants**: Stats summary card vs full PR table
- **Column configs**: Flexible table columns users can customize

**app-config.yaml:**
```yaml
proxy:
  endpoints:
    '/github/api':
      target: https://api.github.com
      headers:
        Authorization: 'token ${GITHUB_TOKEN}'
```

---

## 4. GitHub Security Insights Plugin (Roadie)

**What it does:** Shows Dependabot alerts and code scanning results on entity pages.

**Architecture:**
```
backstage-plugin-security-insights/
  src/
    plugin.ts
    api/
      SecurityInsightsApi.ts
    components/
      SecurityInsightsWidget/     # Summary card: alert counts by severity
      DependabotAlertsTable/      # Full table of Dependabot alerts
      CodeScanningTable/          # Full table of code scanning results
```

**Key patterns:**
- **Severity-based display**: Color-coded by critical/high/medium/low
- **Multiple data sources**: Both Dependabot and code scanning in one plugin
- **Same annotation**: Reuses `github.com/project-slug` — no new annotation needed
- **Proxy-based**: Same GitHub proxy setup as PR plugin

---

## 5. PagerDuty Plugin (community-plugins)

**What it does:** Shows PagerDuty service status, incidents, and on-call in Backstage.

**Architecture:**
```
workspaces/pagerduty/
  plugins/
    pagerduty/                        # Frontend
      src/
        plugin.ts
        api/
          PagerDutyApi.ts             # API ref
          PagerDutyClient.ts          # Calls backend
        components/
          EntityPagerDutyCard/        # Main entity card
            PagerDutyCard.tsx
            StatusChip.tsx            # Service status indicator
            IncidentList.tsx          # Recent incidents
            OnCallList.tsx            # Current on-call
            ChangeEventsList.tsx      # Recent changes
          TriggerDialog/              # Dialog to create incident
    pagerduty-backend/                # Backend (not just proxy!)
      src/
        plugin.ts
        router.ts
        service/
          PagerDutyService.ts         # Full API client
          types.ts
    pagerduty-common/
      src/
        types.ts                      # PagerDutyService, Incident, OnCall
```

**Key patterns:**
- **Full backend**: Not just proxy — has logic for aggregating status + incidents + on-call
- **Write operations**: Can trigger incidents from Backstage via POST
- **Entity annotation**: `pagerduty.com/service-id` maps to PD service
- **Composite card**: One card with multiple sections (status + incidents + on-call)
- **Dialog pattern**: TriggerDialog for creating incidents inline

---

## Pattern Summary: What To Model After

| If your plugin... | Model after | Key takeaway |
|---|---|---|
| Reads from one external API | OpsGenie | 3-tier with dedicated backend client |
| Just needs GitHub data | Roadie PR/Security | Proxy-based, reuse `github.com/project-slug` |
| Needs write operations | PagerDuty | Full backend with POST routes |
| Processes entities | Linguist | Catalog processor + scheduler |
| Needs multiple card types | OpsGenie/PagerDuty | Multiple EntityCardBlueprint exports |
| Needs standalone page + entity cards | OpsGenie | PageBlueprint + EntityCardBlueprint in one plugin |

---

## Common Component Imports Quick Reference

```ts
// Layout & structure
import { Content, ContentHeader, Header, Page, SupportButton } from '@backstage/core-components';

// Data display
import { InfoCard, Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';

// Status indicators
import { StatusOK, StatusError, StatusWarning, StatusPending } from '@backstage/core-components';

// Entity integration
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';
import { EntityCardBlueprint, EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

// API
import { useApi, discoveryApiRef, fetchApiRef, configApiRef, createApiRef } from '@backstage/core-plugin-api';
import { ApiBlueprint, createApiFactory } from '@backstage/frontend-plugin-api';

// Data loading
import useAsync from 'react-use/lib/useAsync';

// Material UI (used in most plugins)
import {
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Typography, Chip, Grid, Box, Button, Dialog,
  IconButton, Tooltip, LinearProgress,
} from '@material-ui/core';
```

---

## package.json Templates

### Frontend plugin

```json
{
  "name": "@backstage-community/plugin-my-plugin",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "backstage": {
    "role": "frontend-plugin",
    "supported-versions": "^1.30.0"
  },
  "dependencies": {
    "@backstage/core-components": "^0.14.0",
    "@backstage/core-plugin-api": "^1.9.0",
    "@backstage/frontend-plugin-api": "^0.9.0",
    "@backstage/plugin-catalog-react": "^1.12.0",
    "@backstage/theme": "^0.5.0",
    "@material-ui/core": "^4.12.4",
    "@material-ui/icons": "^4.11.3",
    "react-use": "^17.4.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@backstage/cli": "^0.27.0",
    "@backstage/dev-utils": "^1.0.0",
    "@backstage/test-utils": "^1.6.0"
  },
  "scripts": {
    "start": "backstage-cli package start",
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    "test": "backstage-cli package test",
    "prepack": "backstage-cli package prepack",
    "postpack": "backstage-cli package postpack"
  }
}
```

### Backend plugin

```json
{
  "name": "@backstage-community/plugin-my-plugin-backend",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "backstage": {
    "role": "backend-plugin",
    "supported-versions": "^1.30.0"
  },
  "dependencies": {
    "@backstage/backend-plugin-api": "^1.0.0",
    "@backstage/config": "^1.2.0",
    "@backstage/errors": "^1.2.0",
    "express": "^4.18.2",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "@backstage/backend-test-utils": "^1.0.0",
    "@backstage/cli": "^0.27.0",
    "supertest": "^6.3.3"
  },
  "scripts": {
    "start": "backstage-cli package start",
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    "test": "backstage-cli package test",
    "prepack": "backstage-cli package prepack",
    "postpack": "backstage-cli package postpack"
  }
}
```
