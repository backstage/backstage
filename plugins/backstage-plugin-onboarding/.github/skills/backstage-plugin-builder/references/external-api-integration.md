# External API Integration Patterns

Patterns distilled from OpsGenie, Roadie GitHub/Datadog, and PagerDuty plugins.

## Architecture: 3-Tier Pattern

```
Frontend (React) ──→ Backend Plugin (Express) ──→ External API
 uses fetchApi          auth + caching              OpsGenie/GH/etc.
 + discoveryApi         rate limiting
                        secret management
```

**Why not call external APIs directly from the frontend?**
- Secrets (API keys) must stay server-side
- CORS policies block most external APIs
- Backend enables caching, rate limiting, and request transformation
- Backstage auth (service-to-service) handled automatically

## Decision: Proxy vs Full Backend Plugin

| Criteria | Proxy (`proxy.endpoints`) | Full Backend Plugin |
|---|---|---|
| # of endpoints | < 4 | Many |
| Logic | Pass-through | Business logic, transformations |
| Caching | None | Yes (via `coreServices.cache`) |
| Database | No | Yes (via `coreServices.database`) |
| Auth | Header injection only | Full credential handling |
| Rate limiting | None | Custom implementation |
| Background tasks | No | Yes (via `coreServices.scheduler`) |
| Best for | Prototyping, simple reads | Production integrations |

## Proxy Configuration

```yaml
# app-config.yaml
proxy:
  endpoints:
    '/opsgenie':
      target: 'https://api.opsgenie.com/v2'
      headers:
        Authorization: 'GenieKey ${OPSGENIE_API_KEY}'
    '/my-service':
      target: 'https://my-internal-service.example.com'
      changeOrigin: true
      allowedHeaders: ['Authorization']
```

```typescript
// Frontend usage — proxy endpoints are at /api/proxy/<endpoint>/
const proxyUrl = await discoveryApi.getBaseUrl('proxy');
const response = await fetchApi.fetch(`${proxyUrl}/opsgenie/alerts`);
```

## Full Backend Plugin: External API Client

### Backend Client (OpsGenie Pattern)

```typescript
// src/service/external-api-client.ts
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import fetch from 'node-fetch';

export class ExternalServiceClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly logger: LoggerService;

  constructor(opts: { config: Config; logger: LoggerService }) {
    const cfg = opts.config.getConfig('myPlugin');
    this.apiKey = cfg.getString('apiKey');
    this.baseUrl = cfg.getOptionalString('baseUrl') ?? 'https://api.external.com/v2';
    this.logger = opts.logger;
  }

  async getAlerts(query?: string): Promise<Alert[]> {
    const url = new URL(`${this.baseUrl}/alerts`);
    if (query) url.searchParams.set('query', query);

    this.logger.debug(`Fetching alerts from ${url.toString()}`);
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `GenieKey ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`External API error ${response.status}: ${response.statusText}`);
    }
    const body = await response.json();
    return body.data;
  }

  async getItemById(id: string): Promise<Item> {
    const response = await fetch(
      `${this.baseUrl}/items/${encodeURIComponent(id)}`,
      { headers: { Authorization: `GenieKey ${this.apiKey}` } },
    );
    if (!response.ok) {
      throw new Error(`External API error ${response.status}`);
    }
    return response.json();
  }
}
```

### Backend Router Using the Client

```typescript
// src/service/router.ts
import { Router } from 'express';
import { ExternalServiceClient } from './external-api-client';

export async function createRouter(opts: {
  config: Config;
  logger: LoggerService;
  httpAuth: HttpAuthService;
}): Promise<Router> {
  const { config, logger, httpAuth } = opts;
  const client = new ExternalServiceClient({ config, logger });
  const router = Router();

  router.get('/alerts', async (req, res) => {
    await httpAuth.credentials(req);  // Verify Backstage auth
    const query = req.query.query as string | undefined;
    const alerts = await client.getAlerts(query);
    res.json(alerts);
  });

  router.get('/alerts/:id', async (req, res) => {
    await httpAuth.credentials(req);
    const alert = await client.getItemById(req.params.id);
    res.json(alert);
  });

  router.get('/health', (_, res) => res.json({ status: 'ok' }));

  return router;
}
```

### Frontend API Client Calling Your Backend

```typescript
// src/api/MyPluginClient.ts
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

export class MyPluginClient implements MyPluginApi {
  constructor(private readonly opts: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {}

  async getAlerts(query?: string): Promise<Alert[]> {
    const baseUrl = await this.opts.discoveryApi.getBaseUrl('my-plugin');
    const url = new URL(`${baseUrl}/alerts`);
    if (query) url.searchParams.set('query', query);
    const response = await this.opts.fetchApi.fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }

  async getAlertById(id: string): Promise<Alert> {
    const baseUrl = await this.opts.discoveryApi.getBaseUrl('my-plugin');
    const response = await this.opts.fetchApi.fetch(
      `${baseUrl}/alerts/${encodeURIComponent(id)}`,
    );
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }
}
```

## Config Schema for External Integration

```typescript
// config.d.ts
export interface Config {
  myPlugin?: {
    /**
     * API key for the external service.
     * @visibility secret
     */
    apiKey: string;

    /**
     * Base URL override for the external API.
     * @visibility backend
     */
    baseUrl?: string;

    /**
     * Frontend-visible configuration.
     * @deepVisibility frontend
     */
    ui?: {
      /** Number of items per page */
      pageSize?: number;
      /** Custom dashboard title */
      title?: string;
    };
  };
}
```

## Entity Annotation Pattern

Many plugins are entity-scoped — they show data for a specific catalog entity. This requires an annotation.

### Define Annotation Constant (common package)

```typescript
// plugin-my-plugin-common/src/constants.ts
export const MY_PLUGIN_ANNOTATION = 'my-company.com/my-plugin-id';
```

### Use in Frontend Entity Card

```typescript
import { useEntity, MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';
import { MY_PLUGIN_ANNOTATION } from '@backstage/plugin-my-plugin-common';

export const MyEntityCard = () => {
  const { entity } = useEntity();
  const annotation = entity.metadata.annotations?.[MY_PLUGIN_ANNOTATION];

  if (!annotation) {
    return <MissingAnnotationEmptyState annotation={MY_PLUGIN_ANNOTATION} />;
  }

  return <MyCardContent serviceId={annotation} />;
};
```

### Entity catalog-info.yaml

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    my-company.com/my-plugin-id: 'service-123'
spec:
  type: service
  lifecycle: production
  owner: team-platform
```

## Caching Pattern (Backend)

```typescript
env.registerInit({
  deps: {
    cache: coreServices.cache,
    // ...
  },
  async init({ cache }) {
    const cacheClient = cache.getClient();

    async function getCachedAlerts(): Promise<Alert[]> {
      const cached = await cacheClient.get('alerts');
      if (cached) return JSON.parse(cached as string);

      const alerts = await externalClient.getAlerts();
      await cacheClient.set('alerts', JSON.stringify(alerts), { ttl: 300 });
      return alerts;
    }
  },
});
```
