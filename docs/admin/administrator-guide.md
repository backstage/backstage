***
id: admin-guide
title: Backstage Administrator Guide
sidebar_label: Admin Guide
description: Practical guidance for operating Backstage in production (Docker/Kubernetes), enabling plugins, upgrading safely, and managing databases.
***

:::info
This guide focuses on running Backstage in production with containers (Docker and Kubernetes). It also notes what’s different in local development. Topics include day‑to‑day operations, plugin enablement and configuration, upgrades, and databases.
:::

# Introduction

Backstage is typically deployed as a container image and run on a cluster or a VM host with a container runtime. This guide walks through how to operate it reliably, how to enable and configure plugins, how to upgrade using the official CLI flow, and what to consider for databases in production.

***

# Environments and workflow

## Local development (non‑production)
- Install dependencies:
  - yarn install
- Start the dev servers:
  - From the repo root: yarn start (frontend)
  - From packages/backend: yarn start (backend)
- Use this mode for development and testing only.

## Production (containerized)
- Build a Backstage Docker image and deploy it to your runtime (Docker or Kubernetes).
- Provide configuration via app-config.production.yaml (mounted or baked) and environment variables.
- Manage logs, health checks, and secrets with your platform’s standard tooling.

***

# Operations

## Running with Docker

Build:
```bash
docker build -t <registry>/<repo>/backstage:<tag> .
```

Run:
```bash
docker run --rm \
  -p 7007:7007 \
  -v $(pwd)/app-config.production.yaml:/app/app-config.production.yaml \
  <registry>/<repo>/backstage:<tag>
```

Check status and troubleshoot:
- docker ps
- docker logs <container-id>
- docker exec -it <container-id> sh

Notes:
- Expose port 7007 unless customized.
- Keep production config out of the image if possible; mount it or inject via environment variables.

## Running on Kubernetes

Apply or update:
```bash
kubectl apply -f backstage-deployment.yaml
```

Rollouts and status:
```bash
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace>
kubectl logs <pod> -n <namespace>
kubectl describe pod <pod> -n <namespace>
```

Recommendations:
- Configure readiness and liveness probes for the backend.
- Use ConfigMaps/Secrets (or an external secret store).
- Front the service with an Ingress/LoadBalancer.
- Version images clearly and use rolling updates.

***

# Plugins: installation and configuration

Important: there’s no “single server plugin.” Plugins are added to the frontend (app) and/or the backend. Some new apps include certain plugins scaffolded by default, but they won’t work until configured.

## Frontend plugins (app)
1) Add the dependency in packages/app:
```bash
yarn add @backstage/plugin-<name>
```
2) Register routes/components in the app (for example in App.tsx or EntityPage.tsx), following the plugin’s README.
3) Add any required catalog annotations to entities.
4) Local dev: yarn start.
5) Production: rebuild and redeploy the Docker image.

## Backend plugins (services/modules)
1) Add the backend package in packages/backend:
```bash
yarn add @backstage/plugin-<name>-backend
```
2) Register the router during backend initialization (for example in packages/backend/src/plugins/<name>.ts or equivalent).
3) Add required configuration to app-config*.yaml.
4) Local dev: (from packages/backend) yarn start.
5) Production: rebuild and redeploy the Docker image.

## Kubernetes plugin notes
- Many new apps include Kubernetes plugin pieces by default, but configuration and cluster access are required.
- Typical steps:
  - Define clusters and authentication in app-config.yaml.
  - Ensure entities have the required annotations.
  - Set up RBAC if the backend talks to the cluster from inside Kubernetes.
  - Verify the backend router is registered if the plugin version requires it.
- After changes, rebuild the image and roll out the update.

***

# Upgrading Backstage

The recommended way to upgrade is to bump Backstage packages in lockstep using the CLI.

## Use the versions bump command
From the repo root:
```bash
yarn backstage-cli versions:bump
```

Common follow‑ups:
```bash
yarn install
# address any breaking changes per release notes
yarn build
```

Then rebuild and publish your Docker image:
```bash
docker build -t <registry>/<repo>/backstage:<new-tag> .
docker push <registry>/<repo>/backstage:<new-tag>
```

Deploy the new image:
- Kubernetes: update the Deployment image and apply; wait for rollout to finish.
- Docker: stop the old container and start the new image with the same mounted config/secrets.

***

# Database guide

## Supported databases
- SQLite: development/demo only.
- PostgreSQL: recommended for production.
- MySQL: supported alternative (verify plugin compatibility).

## PostgreSQL (recommended)
Example app-config:
```yaml
backend:
  database:
    client: pg
    connection:
      host: <host>
      user: <user>
      password: <password>
      database: <dbname>
```

Tips:
- Use managed services where possible (automated backups, HA, monitoring).
- Schedule regular backups (pg_dump or provider snapshots).
- Ensure network access, TLS, and credentials are properly secured.

## MySQL (alternative)
Example app-config:
```yaml
backend:
  database:
    client: mysql
    connection:
      host: <host>
      user: <user>
      password: <password>
      database: <dbname>
```

Confirm that required plugins support MySQL and that migrations work as expected.

## Plugin schemas and migrations
- Some plugins create their own tables or run migrations on startup.
- Check each plugin’s README for database requirements and migration instructions.

***

# Troubleshooting

- Container logs:
  - Docker: docker logs <container-id>
  - Kubernetes: kubectl logs <pod> -n <namespace>
- Readiness:
  - Check probes, pod events, and rollout status in Kubernetes.
- Plugin not visible:
  - Confirm frontend registration, backend router registration, required annotations, and config.
- Database errors:
  - Validate credentials, network paths, and TLS.
  - Check that migrations have run and the target database is supported by the plugin.

***
