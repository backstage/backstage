---
id: deploying
sidebar_label: 004 - Deploying
title: Deploying to production
description: How to deploy your Backstage instance to production
---

Audience: Admins

## Summary

You have a Docker image, a database, and authentication configured. Now it
is time to deploy. The _best_ way to deploy Backstage is _the same way_ you
deploy other software at your organization. Backstage is designed to run as
a stateless Node.js application backed by an external PostgreSQL database,
so it fits into most existing deployment pipelines without special tooling.

This page describes what every Backstage deployment needs, regardless of
platform, and points to the reference guides for specific targets.

## What every deployment needs

Whichever platform you choose, the deployment will need to take care of the
following concerns:

- **A container image** built from your repository and pushed to a registry
  your runtime can pull from. The image you built in
  [Building the Docker image](./001-docker.md) is the artifact that gets
  deployed.
- **Configuration and secrets** delivered to the running container as
  environment variables or mounted files. This includes database
  credentials, auth provider client secrets, and any integration tokens.
- **A reachable PostgreSQL database** that the running instance can connect
  to using the credentials from the previous step. See
  [Configuring the database](./002-database.md) for details.
- **A network entry point** — typically an ingress, load balancer, or
  reverse proxy — that exposes the backend on port `7007` to your users
  over HTTPS.
- **A health-checked runtime** that can restart the container if it stops
  responding and roll out new versions when you publish a new image.
- **`app.baseUrl` and `backend.baseUrl`** in your
  `app-config.production.yaml` set to the public URL where users will
  access Backstage. Auth providers and the frontend rely on these matching
  the actual entry point:

  ```yaml title="app-config.production.yaml"
  app:
    baseUrl: https://backstage.example.com
  backend:
    baseUrl: https://backstage.example.com
    listen:
      port: 7007
  ```

## Choosing a deployment target

Backstage runs anywhere a Node.js container can run. Pick the option that
matches what your organization already operates — you do not need to adopt
new infrastructure to run Backstage.

| Target                   | Good fit when...                                                        |
| :----------------------- | :---------------------------------------------------------------------- |
| Kubernetes               | Your organization already runs services on Kubernetes.                  |
| Amazon ECS / Fargate     | You are on AWS and prefer managed container scheduling.                 |
| Google Cloud Run         | You want a fully managed, request-driven container runtime on GCP.      |
| Azure Container Apps     | You are on Azure and want a managed container platform.                 |
| A traditional VM or PaaS | You prefer running the Node.js process directly behind a reverse proxy. |
| Docker Compose           | You are running a small installation or proof of concept.               |

Backstage maintains a reference guide for the Kubernetes path in
[Deploying with Kubernetes](../../deployment/k8s.md), which walks through
namespaces, secrets, the deployment, the service, and connecting to
PostgreSQL inside the cluster.

For other platforms, the
[community-contributed deployment guides](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/)
in the Backstage repository cover targets such as ECS, Cloud Run, and
Docker Compose, and the [deployment overview](../../deployment/index.md)
explains the underlying model that all of these guides share.

## Operational concerns

A few operational details apply to every deployment and are worth getting
right before opening Backstage up to your users:

- **Run multiple replicas** behind your load balancer. Backstage is
  stateless, so multiple instances can serve traffic against the same
  PostgreSQL database. We cover this further in
  [Scaling Backstage](./007-scaling.md).
- **Store secrets securely.** Container platforms typically offer a
  secrets primitive — Kubernetes Secrets, AWS Secrets Manager, GCP Secret
  Manager, Azure Key Vault, and so on. Reference these from your
  configuration with environment variables rather than committing
  credentials.
- **Enable health checks.** Wire your platform's readiness and liveness
  probes to the Backstage health endpoints so unhealthy instances are
  taken out of rotation and restarted automatically.
- **Run behind HTTPS.** Terminate TLS at your ingress, load balancer, or
  reverse proxy and make sure the public URL is what `app.baseUrl` and
  `backend.baseUrl` are set to.

If you need to run Backstage behind a corporate proxy, see the
[corporate proxy guide](../../tutorials/corporate-proxy.md).

## Next steps

Your Backstage instance is deployed. Next, let's look at how to manage
configuration effectively across environments.

- [Config-first development](./005-config-first.md)
