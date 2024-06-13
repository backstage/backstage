---
id: health
title: Heath Service
sidebar_label: Health
description: Documentation for the Health service
---

The Health service provides some health check endpoints for the plugins. By default, it attaches `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness` endpoints to the backend server, which return a JSON object with the status of the backend services.

## Configuring the service

The following example is how you can override the health service to add custom endpoints.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-app-api';

const backend = createBackend();

backend.add(
  createServiceFactory({
    service: coreServices.health,
    deps: {
      rootHttpRouter: coreServices.rootHttpRouter,
    },
    async factory({ rootHttpRouter }) {
      rootHttpRouter.get('.backstage/health/v1/readiness', async (req, res) => {
        res.json({ status: 'ok' });
      });

      rootHttpRouter.get('.backstage/health/v1/liveness', async (req, res) => {
        res.json({ status: 'ok' });
      });

      return {};
    },
  }),
);
```
