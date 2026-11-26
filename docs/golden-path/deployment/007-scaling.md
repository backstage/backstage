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
- NodeJS metrics like event loop lag or garbage collection time are significantly worsening.

Start with horizontal scaling (more replicas) before considering backend
splitting. It is simpler and handles most growth scenarios.

## Next steps

You have reached the end of the Deployment Golden Path. Your Backstage instance
is containerized, backed by a production database, protected by a real
authentication provider, deployed, monitored, and ready to grow with your
organization. Here is where to go from here.

### Continue the Golden Path

Running in production is where adoption work begins. The Adoption Golden Path
picks up from here:

- [Operate after launch](../adoption/007-operate-after-launch.md) sets up a
  rhythm for feedback, measurement, and prioritization.
- [Govern ownership](../adoption/008-govern-ownership.md) decides who maintains
  plugins, entities, and the instance itself.
- [Scale the catalog](../adoption/009-scale-catalog.md) grows catalog coverage
  without losing accuracy.

If you plan to build your own functionality on top of your deployment, the
[Plugins Golden Path](../plugins/index.md) walks through creating a full-stack
plugin.

### Go deeper on scaling

- [Scaling Backstage Deployments](../../deployment/scaling.md) is the reference
  documentation for the strategies covered on this page.
- [Split into multiple backends](../../backend-system/building-backends/01-index.md#split-into-multiple-backends)
  explains how to run different plugins in separate deployments.
- [Life of an entity](../../features/software-catalog/life-of-an-entity.md)
  describes the catalog processing pipeline, which is usually the heaviest
  workload in a Backstage backend.
- [Search engines](../../features/search/search-engines.md) covers moving off
  the default in-memory search engine, which does not share its index between
  replicas.
- The [cache](../../backend-system/core-services/cache.md) and
  [database](../../backend-system/core-services/database.md) core services
  describe how plugins share state across instances.

### Keep your deployment healthy

- [Keeping Backstage updated](../../getting-started/keeping-backstage-updated.md)
  explains how to stay current with releases.
- The [Backstage threat model](../../overview/threat-model.md) describes the
  security considerations for operators of a production instance.
