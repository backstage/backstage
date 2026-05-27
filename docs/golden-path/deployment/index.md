---
id: index
title: Deploying Backstage to production
description: A guided path for deploying your Backstage app to production
---

## Prerequisites

- You have completed the [create-app golden path](../create-app/index.md) and
  have a working Backstage app.
- Your code is pushed to a source control management system (GitHub, GitLab,
  etc.).
- You have a general understanding of how your company builds and deploys
  software.

## What should I get out of this guide?

This guide walks through everything you need to get your Backstage instance
running in a production environment. By the end, you will have:

- A Docker image containing your Backstage app.
- A production database (PostgreSQL) connected to your deployment.
- A real authentication provider replacing the default guest login.
- A running deployment, whether on Kubernetes, ECS, or another platform.
- Monitoring and observability set up with OpenTelemetry.
- An understanding of how to scale your deployment as usage grows.

## Structure

We start with the Docker image since that is the foundation of any deployment.
Then we set up the two critical pre-deploy dependencies: a database and
authentication. After that, we walk through deploying to Kubernetes and discuss
other deployment options. Finally, we cover operational topics like
configuration management, monitoring, and scaling.

## Next steps

- [Building the Docker image](./001-docker.md)
