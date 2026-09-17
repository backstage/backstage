---
id: scaling
sidebar_label: 007 - Scaling
title: Scaling your deployment
description: How to scale Backstage as usage grows
---

Audience: Admins

## Summary

A single Backstage instance handles many users well, but as your organization
grows and more plugins are added, you may need to scale. This page covers the
strategies available.

## Horizontal scaling

The most straightforward approach is to run multiple identical instances of
Backstage behind a load balancer. All instances share the same external
database (and optional cache or search services). The backend plugins
coordinate through the database to share state and distribute work.

In Kubernetes, this is as simple as increasing the replica count in your
deployment:

```yaml
spec:
  replicas: 3
```

No additional configuration is needed. The database handles coordination
between instances.

## Splitting the backend

For larger installations, you can break the backend into multiple services,
each running a different set of plugins. For example, you might run the
catalog and scaffolder as separate deployments so that heavy catalog
processing does not affect scaffolder performance.

This is a more advanced approach that requires:

- Separate backend packages, each importing only the plugins they need.
- A custom `DiscoveryService` implementation that routes requests to the
  correct backend based on the plugin ID.
- Routing both external (ingress) and internal (backend-to-backend) traffic
  appropriately.

See the
[backend system documentation](../../backend-system/building-backends/01-index.md#split-into-multiple-backends)
for details on how to set this up.

## Separating the frontend

By default, the frontend is served from your backend deployment using the
`@backstage/plugin-app-backend` plugin. If you need to reduce load on the
backend or serve the frontend from a CDN for better performance, you can
deploy the frontend separately.

This involves:

1. Removing the `@backstage/plugin-app-backend` plugin from the backend.
2. Building the frontend as a static bundle.
3. Serving it from a separate container (for example, NGINX) or a static
   hosting provider.

An example NGINX setup is available in the
[contrib/docker/frontend-with-nginx](https://github.com/backstage/backstage/blob/master/contrib/docker/frontend-with-nginx)
folder.

:::note

When serving the frontend separately, configuration is no longer injected by
the backend at runtime. You need to provide the correct configuration at
frontend build time.

:::

## When to scale

Here are some signals that indicate you should consider scaling:

- API response times are increasing.
- Catalog processing is falling behind (visible in the
  `catalog.processing.duration` metric).
- Scaffolder tasks are queuing for longer than expected.
- Users report slow page loads.

Start with horizontal scaling (more replicas) before considering backend
splitting. It is simpler and handles most growth scenarios.

## Further reading

For more details on scaling strategies, see the
[Scaling Backstage Deployments](../../deployment/scaling.md) reference
documentation.
