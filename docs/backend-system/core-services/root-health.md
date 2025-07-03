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

### Custom headers in health check responses

While not implemented directly in the root health service, the default implementation of the [RootHttpRouter](./root-http-router.md) service includes a configuration option to set additional headers to include in health check responses. For example, you can add a `service-name` header using the following configuration:

```yaml
backend:
  health:
    headers:
      service-name: my-service
```

It can be a good idea to set a header for your health check responses that
uniquely identifies your service in a multi-service environment. This ensures
that the health check that is configured for your service is actually hitting
your service and not another.

For example, if using Envoy you can use the [`service_name_matcher`](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/health_checking#health-check-identity) configuration and
set the `x-envoy-upstream-healthchecked-cluster` header to a matching value. For example:

```yaml
backend:
  health:
    headers:
      x-envoy-upstream-healthchecked-cluster: my-service
```
