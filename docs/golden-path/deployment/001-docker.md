---
id: docker
sidebar_label: 001 - Building the Docker image
title: Building the Docker image
description: How to build your Backstage app into a deployable Docker image
---

Audience: Developers and Admins

## Summary

Every production deployment of Backstage starts with a Docker image. The image
bundles both the frontend and backend into a single artifact that you can deploy
anywhere containers run.

By the end of this page, you will have a Docker image ready to push to a
container registry.

## What is in the Docker image?

When you created your app with `@backstage/create-app`, a `Dockerfile` was
generated at `packages/backend/Dockerfile`. The build process layers both the
frontend and backend into a single image:

1. The **backend** is compiled and bundled into `packages/backend/dist/`.
2. The **frontend** is built and served by the
   `@backstage/plugin-app-backend` plugin, which is included in the backend
   by default.
3. Production dependencies are installed, and the result is packaged into a
   slim Node.js image.

The image runs as a non-root `node` user and sets `NODE_ENV=production`.

## Building the image

The recommended approach is a **host build**, where compilation happens on
your machine (or CI runner) and Docker only packages the result. This is faster
and produces better caching behavior.

From the root of your repository:

```shell
yarn install
yarn tsc
yarn build:backend
```

Then build the Docker image:

```shell
docker image build . -f packages/backend/Dockerfile --tag backstage
```

To verify it works locally:

```shell
docker run -it -p 7007:7007 backstage
```

You should see logs in your terminal and be able to open `http://localhost:7007`
in your browser.

:::tip Troubleshooting

If you run into build issues, two Docker flags can help:

- `--progress=plain` shows verbose output instead of folded log sections.
- `--no-cache` rebuilds all layers from scratch.

```shell
docker image build . -f packages/backend/Dockerfile --tag backstage --progress=plain --no-cache
```

:::

## Further reading

For a full multi-stage Docker build (where everything happens inside Docker)
or for deploying the frontend separately, see the
[Building a Docker image](../../deployment/docker.md) reference documentation.

## Next steps

Before deploying, you need to set up two production dependencies: a database and
an authentication provider.

- [Setting up a production database](./002-database.md)
