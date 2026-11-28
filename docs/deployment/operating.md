---
id: operating
title: Operating a Backstage instance
sidebar_label: Operating
description: How to start, stop, restart, and check the health of a production Backstage instance
---

This page covers the day-to-day tasks of running a production Backstage
instance: starting and stopping it, restarting it after a change, and checking
that it's healthy. It assumes you've already built your app as described in
[Building a Docker image](docker.md), and, if you use Kubernetes, deployed it
as described in [Deploying with Kubernetes](k8s.md).

In a production deployment, the backend serves both the API and the frontend,
on port `7007` by default.

## Running a production build directly

You can run the backend directly with Node.js, without Docker. First, build it
from the root of your repo:

```shell
yarn install --immutable
yarn tsc
yarn build:backend
```

The build writes two archives to `packages/backend/dist`: `skeleton.tar.gz`,
which contains the `package.json` files needed to install dependencies, and
`bundle.tar.gz`, which contains the built backend. To prepare a directory to
run from, copy the root `package.json` and `yarn.lock` to it along with both
archives, then extract them and install the production dependencies:

```shell
tar xzf skeleton.tar.gz
yarn workspaces focus --all --production
tar xzf bundle.tar.gz
```

For more details on these archives, see
[Backend Production](../tooling/cli/02-build-system.md#backend-production).

### Starting the backend

Start the backend with your production configuration:

```shell
NODE_ENV=production node packages/backend --config app-config.yaml --config app-config.production.yaml
```

Run the backend with the same Node.js version that you built it with.
Otherwise, native modules can fail at runtime.

### Stopping the backend

To stop the backend, send it a `SIGTERM` or `SIGINT` signal, for example by
pressing `Ctrl+C` in the terminal where it's running. The backend then shuts
down cleanly: it stops all plugins and exits.

If you run the backend under a process manager, such as `systemd`, use that
process manager's stop and restart commands. They send the same signals.

## Running with Docker

These commands use the `backstage` image built in
[Building a Docker image](docker.md).

Start a container in the background and give it a name, so that you can refer
to it later:

```shell
docker run -d --name backstage -p 7007:7007 backstage
```

Check that the container is running and view its logs:

```shell
docker ps --filter name=backstage
docker logs -f backstage
```

Stop, start, or restart the container:

```shell
docker stop backstage
docker start backstage
docker restart backstage
```

`docker stop` sends `SIGTERM` to the backend, so it shuts down cleanly. If the
backend hasn't exited after 10 seconds, Docker stops it forcefully.

## Running on Kubernetes

These commands use the `backstage` Deployment in the `backstage` namespace
created in [Deploying with Kubernetes](k8s.md).

### Restarting

To restart Backstage, for example after updating a secret that it reads, run:

```shell
kubectl rollout restart deployment/backstage --namespace=backstage
```

Kubernetes replaces the pods one at a time. If you've configured a readiness
probe, as described in [Checking health](#checking-health), each new pod gets
traffic only once it's ready.

### Checking the status

To wait for a rollout to finish and see whether it succeeded, run:

```shell
kubectl rollout status deployment/backstage --namespace=backstage
```

To see the pods and their logs, run:

```shell
kubectl get pods --namespace=backstage
kubectl logs deployment/backstage --namespace=backstage
```

### Stopping and starting

A Deployment doesn't have a stop command. To stop Backstage, scale the
Deployment to zero replicas:

```shell
kubectl scale deployment/backstage --replicas=0 --namespace=backstage
```

To start it again, scale it back up:

```shell
kubectl scale deployment/backstage --replicas=1 --namespace=backstage
```

To run more than one replica, see [Scaling](scaling.md).

## Checking health

The backend has two built-in health check endpoints:

- `/.backstage/health/v1/liveness` returns `200` while the backend process is
  running.
- `/.backstage/health/v1/readiness` returns `200` once the backend has started
  and is ready to serve traffic. It returns `503` while the backend is still
  starting up, and again once it begins shutting down.

To check them by hand, run:

```shell
curl http://localhost:7007/.backstage/health/v1/readiness
```

The output is similar to this:

```log
{"status":"ok"}
```

### Using the endpoints in Kubernetes

To let Kubernetes restart a stuck backend and send traffic only to ready pods,
add probes to the `backstage` container in your Deployment:

```yaml
readinessProbe:
  httpGet:
    port: 7007
    path: /.backstage/health/v1/readiness
livenessProbe:
  httpGet:
    port: 7007
    path: /.backstage/health/v1/liveness
```

Backstage can take a while to start. If pods restart before they finish
starting up, increase `initialDelaySeconds` on the liveness probe, or add a
`startupProbe`.

To change how the health checks behave or add headers to their responses, see
the [Root Health service](../backend-system/core-services/root-health.md).
