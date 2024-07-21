---
id: root-health
title: Root Health Service
sidebar_label: Root Health
description: Documentation for the Health service
---

The Root Health service provides some health check endpoints for the backend. By default, the `rootHttpRouter` exposes a `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness` endpoints, which return a JSON object with the status of the backend services according the implementation of the Root Health Service.

## Configuring the service

The following example shows how you can override the root health service implementation.

```ts
import { RootHealthService, coreServices } from '@backstage/backend-plugin-api';

const backend = createBackend();

class MyRootHealthService implements RootHealthService {
  async getLiveness() {
    // provide your own implementation
    return { status: 200, payload: { status: 'ok' } };
  }

  async getReadiness() {
    // provide your own implementation
    return { status: 200, payload: { status: 'ok' } };
  }
}

backend.add(
  createServiceFactory({
    service: coreServices.rootHealth,
    deps: {},
    async factory({}) {
      return new MyRootHealthService();
    },
  }),
);
```
