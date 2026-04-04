# External API Integration Reference

Patterns extracted from **backstage-plugin-opsgenie**, **Roadie GitHub plugins**, and community PagerDuty/Datadog integrations.

## Architecture Overview

Most external-service plugins follow this 3-tier pattern:

```
┌─────────────────────────┐
│  Frontend Plugin         │  React components, entity cards, pages
│  - MyApiClient           │  Calls backend via discoveryApi + fetchApi
│  - Components            │  InfoCard, Table, useAsync patterns
│  - Extension blueprints  │  EntityCardBlueprint, PageBlueprint
└───────────┬─────────────┘
            │ HTTP (auto-authenticated via fetchApi)
┌───────────▼─────────────┐
│  Backend Plugin          │  Express router mounted at /api/<pluginId>
│  - ExternalApiClient     │  Holds API keys, makes outbound requests
│  - Router                │  Auth check, transforms, caching
│  - Config reading        │  Reads app-config.yaml for credentials
└───────────┬─────────────┘
            │ HTTPS (API key in header)
┌───────────▼─────────────┐
│  External API            │  OpsGenie, GitHub, PagerDuty, etc.
└─────────────────────────┘
```

---

## Complete Backend: External API Client

Pattern from **backstage-plugin-opsgenie**:

```ts
// src/service/OpsgenieClient.ts
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';

export interface OpsgenieAlert {
  id: string;
  tinyId: string;
  message: string;
  status: 'open' | 'closed' | 'acknowledged';
  acknowledged: boolean;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  createdAt: string;
  updatedAt: string;
  owner: string;
  teams: Array<{ id: string; name: string }>;
  tags: string[];
}

export interface OpsgenieSchedule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface OpsgenieOnCall {
  onCallParticipants: Array<{
    name: string;
    type: 'user' | 'team' | 'escalation';
  }>;
}

export class OpsgenieClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly opts: {
    config: Config;
    logger: LoggerService;
  }) {
    const cfg = opts.config.getConfig('opsgenie');
    this.apiKey = cfg.getString('apiKey');
    // Support different regions: US vs EU
    const domain = cfg.getOptionalString('domain') ?? 'app.opsgenie.com';
    this.apiUrl = `https://${domain}/v2`;
  }

  private async request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.apiUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    this.opts.logger.debug(`OpsGenie request: ${url.pathname}`);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `GenieKey ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `OpsGenie API error ${response.status}: ${body}`,
      );
    }

    return response.json() as Promise<T>;
  }

  async getAlerts(query?: string): Promise<OpsgenieAlert[]> {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    const data = await this.request<{ data: OpsgenieAlert[] }>('/alerts', params);
    return data.data;
  }

  async getSchedules(): Promise<OpsgenieSchedule[]> {
    const data = await this.request<{ data: OpsgenieSchedule[] }>('/schedules');
    return data.data;
  }

  async getOnCall(scheduleId: string): Promise<OpsgenieOnCall> {
    const data = await this.request<{ data: OpsgenieOnCall }>(
      `/schedules/${scheduleId}/on-calls`,
      { flat: 'true' },
    );
    return data.data;
  }

  async acknowledgeAlert(alertId: string, user: string): Promise<void> {
    const url = `${this.apiUrl}/alerts/${alertId}/acknowledge`;
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `GenieKey ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, note: 'Acknowledged via Backstage' }),
    });
  }
}
```

---

## Complete Backend: Router with Auth

```ts
// src/router.ts
import express, { Router } from 'express';
import { InputError, NotFoundError } from '@backstage/errors';
import {
  AuthService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { OpsgenieClient } from './service/OpsgenieClient';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  auth: AuthService;
  httpAuth: HttpAuthService;
}

export async function createRouter(opts: RouterOptions): Promise<Router> {
  const { logger, config, httpAuth } = opts;
  const client = new OpsgenieClient({ config, logger });

  const router = Router();
  router.use(express.json());

  // Health check (unauthenticated)
  router.get('/health', (_, res) => res.json({ status: 'ok' }));

  // List alerts (user-authenticated)
  router.get('/alerts', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    const query = req.query.query as string | undefined;
    const alerts = await client.getAlerts(query);
    res.json(alerts);
  });

  // Get schedules
  router.get('/schedules', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    const schedules = await client.getSchedules();
    res.json(schedules);
  });

  // Get on-call for a schedule
  router.get('/schedules/:id/on-calls', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    const onCall = await client.getOnCall(req.params.id);
    res.json(onCall);
  });

  // POST: Acknowledge alert (write operation)
  router.post('/alerts/:id/acknowledge', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    // Get user info if needed for audit trail
    const alertId = req.params.id;
    if (!alertId) throw new InputError('Alert ID is required');
    await client.acknowledgeAlert(alertId, 'backstage-user');
    res.status(200).json({ acknowledged: true });
  });

  return router;
}
```

---

## Complete Backend: Plugin Registration

```ts
// src/plugin.ts
import { createBackendPlugin, coreServices } from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const opsgeniePlugin = createBackendPlugin({
  pluginId: 'opsgenie',
  register(env) {
    env.registerInit({
      deps: {
        logger:     coreServices.logger,
        config:     coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
        auth:       coreServices.auth,
        httpAuth:   coreServices.httpAuth,
      },
      async init({ logger, config, httpRouter, auth, httpAuth }) {
        const router = await createRouter({ logger, config, auth, httpAuth });
        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

export default opsgeniePlugin;
```

---

## Complete Frontend: API Client

```ts
// src/api.ts
import { createApiRef } from '@backstage/frontend-plugin-api';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export interface OpsgenieApi {
  getAlerts(query?: string): Promise<OpsgenieAlert[]>;
  getSchedules(): Promise<OpsgenieSchedule[]>;
  getOnCall(scheduleId: string): Promise<OpsgenieOnCall>;
  acknowledgeAlert(alertId: string): Promise<void>;
}

export const opsgenieApiRef = createApiRef<OpsgenieApi>({
  id: 'plugin.opsgenie.api',
});

export class OpsgenieApiClient implements OpsgenieApi {
  constructor(
    private readonly opts: {
      discoveryApi: DiscoveryApi;
      fetchApi: FetchApi;
    },
  ) {}

  private async getBaseUrl(): Promise<string> {
    return this.opts.discoveryApi.getBaseUrl('opsgenie');
  }

  private async fetch<T>(path: string): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const response = await this.opts.fetchApi.fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`OpsGenie API: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getAlerts(query?: string): Promise<OpsgenieAlert[]> {
    const params = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.fetch(`/alerts${params}`);
  }

  async getSchedules(): Promise<OpsgenieSchedule[]> {
    return this.fetch('/schedules');
  }

  async getOnCall(scheduleId: string): Promise<OpsgenieOnCall> {
    return this.fetch(`/schedules/${scheduleId}/on-calls`);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    await this.opts.fetchApi.fetch(`${baseUrl}/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  }
}
```

---

## Frontend: Entity Cards (Roadie pattern)

This pattern is used across Roadie's GitHub PR card, Security Insights card, etc.:

```tsx
// src/components/AlertsEntityCard.tsx
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { InfoCard, Progress, ResponseErrorPanel, Table, TableColumn } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';
import { opsgenieApiRef } from '../api';

const MY_ANNOTATION = 'opsgenie.com/component-selector';

export const AlertsEntityCard = () => {
  const { entity } = useEntity();
  const api = useApi(opsgenieApiRef);

  const selector = entity.metadata.annotations?.[MY_ANNOTATION];

  // If annotation is missing, show helpful empty state
  if (!selector) {
    return <MissingAnnotationEmptyState annotation={MY_ANNOTATION} />;
  }

  const { value: alerts, loading, error } = useAsync(
    () => api.getAlerts(`tag:${selector}`),
    [selector],
  );

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;

  const columns: TableColumn[] = [
    { title: 'Priority', field: 'priority', width: '10%' },
    { title: 'Message', field: 'message' },
    { title: 'Status', field: 'status', width: '15%' },
    { title: 'Created', field: 'createdAt', width: '20%',
      render: (row: any) => new Date(row.createdAt).toLocaleString() },
  ];

  return (
    <InfoCard title="OpsGenie Alerts" subheader={`Filtered by: ${selector}`}>
      <Table
        options={{ paging: true, pageSize: 5, search: false }}
        columns={columns}
        data={alerts || []}
      />
    </InfoCard>
  );
};
```

---

## Frontend: On-Call Widget (OpsGenie pattern)

```tsx
// src/components/OnCallCard.tsx
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { InfoCard, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { List, ListItem, ListItemText, Avatar, ListItemAvatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { opsgenieApiRef } from '../api';

export const OnCallCard = ({ scheduleId }: { scheduleId: string }) => {
  const api = useApi(opsgenieApiRef);

  const { value, loading, error } = useAsync(
    () => api.getOnCall(scheduleId),
    [scheduleId],
  );

  if (loading) return <Progress />;
  if (error) return <ResponseErrorPanel error={error} />;

  return (
    <InfoCard title="Who's On Call?">
      <List>
        {value?.onCallParticipants.map((participant, i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Avatar><PersonIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={participant.name}
              secondary={participant.type}
            />
          </ListItem>
        ))}
      </List>
    </InfoCard>
  );
};
```

---

## Frontend: Standalone Page (OpsGenie alerts dashboard)

```tsx
// src/components/AlertsPage.tsx
import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import {
  Content, ContentHeader, Header, Page, SupportButton,
  Table, TableColumn,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { opsgenieApiRef } from '../api';

export const AlertsPage = () => {
  const api = useApi(opsgenieApiRef);
  const config = useApi(configApiRef);
  const title = config.getOptionalString('opsgenie.ui.title') ?? 'OpsGenie Alerts';

  const [query, setQuery] = useState<string>('');
  const { value: alerts, loading, error } = useAsync(
    () => api.getAlerts(query || undefined),
    [query],
  );

  const columns: TableColumn[] = [
    { title: 'Priority', field: 'priority' },
    { title: 'Message', field: 'message' },
    { title: 'Status', field: 'status' },
    { title: 'Owner', field: 'owner' },
    { title: 'Created', field: 'createdAt' },
  ];

  return (
    <Page themeId="tool">
      <Header title={title} subtitle="Monitor and manage alerts" />
      <Content>
        <ContentHeader title="Active Alerts">
          <SupportButton>View and manage OpsGenie alerts</SupportButton>
        </ContentHeader>
        <Table
          title="Alerts"
          columns={columns}
          data={alerts || []}
          isLoading={loading}
          options={{ paging: true, pageSize: 25, search: true }}
        />
      </Content>
    </Page>
  );
};
```

---

## Config Schema (config.d.ts)

```ts
// config.d.ts
export interface Config {
  /** @visibility backend */
  opsgenie?: {
    /**
     * API key for OpsGenie API access.
     * Generate at OpsGenie → Settings → API key management
     */
    apiKey: string;
    /**
     * OpsGenie domain. Use 'app.eu.opsgenie.com' for EU region.
     * @default 'app.opsgenie.com'
     */
    domain?: string;
  };
}
```

---

## Caching Pattern (for expensive external calls)

```ts
// In your backend client or router
import { CacheService } from '@backstage/backend-plugin-api';

export class CachedExternalClient {
  constructor(
    private readonly client: ExternalServiceClient,
    private readonly cache: CacheService,
  ) {}

  async getAlerts(): Promise<Alert[]> {
    const cached = await this.cache.get('alerts');
    if (cached) return JSON.parse(cached as string);

    const alerts = await this.client.getAlerts();
    await this.cache.set('alerts', JSON.stringify(alerts), { ttl: 60_000 }); // 60s
    return alerts;
  }
}
```

---

## Roadie GitHub Plugin Patterns

Roadie plugins use annotations heavily to connect entities to external data:

```yaml
# catalog-info.yaml for a component
metadata:
  annotations:
    github.com/project-slug: 'my-org/my-repo'              # GitHub PR plugin
    backstage.io/techdocs-ref: dir:.                         # TechDocs
    opsgenie.com/component-selector: 'tag:my-service'       # OpsGenie
    pagerduty.com/service-id: 'PXXXXXX'                     # PagerDuty
    sonarqube.org/project-key: 'my-org:my-project'          # SonarQube
    jira/project-key: 'PROJ'                                 # Jira
```

Roadie's GitHub PR plugin reads `github.com/project-slug` and fetches:
- Open/closed/merged PR counts
- Average time to merge
- PR review stats per contributor
- Recent PR list with status indicators

This pattern of "annotation → external data lookup → entity card" is the most common integration pattern across all Backstage plugins.
