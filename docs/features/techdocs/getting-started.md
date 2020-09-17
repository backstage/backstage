---
id: getting-started
title: Getting Started
description: Getting Started Guidelines
---

TechDocs functions as a plugin to Backstage, so you will need to use Backstage
to use TechDocs.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

## Installing TechDocs

TechDocs is provided with the Backstage application by default. If you want to
set up TechDocs manually, keep follow the instructions below.

### Adding the package

The first step is to add the TechDocs plugin to your Backstage application.
Navigate to your new Backstage application folder:

```bash
cd hello-world/
```

Then navigate to your `packages/app` folder to install TechDocs:

```bash
cd packages/app
yarn add @backstage/plugin-techdocs
```

After a short while, the TechDocs plugin should be successfully installed.

Next, you need to set up some basic configuration. Enter the following command:

```bash
yarn install
```

Add this to `packages/app/src/plugins.ts`:

```typescript
export { plugin as TechDocs } from '@backstage/plugin-techdocs';
```

### Setting the configuration

TechDocs allows for configuration of the docs storage URL through your
`app-config.yaml` file. We provide two different values to be configured,
`requestUrl` and `storageUrl`. The `requestUrl` is what the reader will request
its data from, and `storageUrl` is where the backend can find the stored
documentation.

The default storage and request URLs:

```yaml
techdocs:
  storageUrl: http://localhost:7000/techdocs/static/docs
  requestUrl: http://localhost:7000/techdocs/docs
```

If you want `techdocs-backend` to manage building and publishing, you want
`requestUrl` to point to the default value (or wherever `techdocs-backend` is
hosted). `storageUrl` should be where your publisher publishes your docs. Using
the default `LocalPublish` that is the default value.

If you have a setup where you are not using `techdocs-backend` for managing
building and publishing of your documentation, you want to change the
`requestUrl` to point to your storage. In this case `storageUrl` is not
required.

### Disable Docker in Docker situation (Optional)

The TechDocs backend plugin runs a docker container with mkdocs to generate the
frontend of the docs from source files (Markdown). If you are deploying
Backstage using Docker, this will mean that your Backstage Docker container will
try to run another Docker container for TechDocs backend.

To avoid this problem, we have a configuration available. If you go to
`packages/backend/src/plugins/techdocs.ts`, you can find the line where we
create a new TechDocs Generator. (Also see [Concepts](concepts.md)).

```
const techdocsGenerator = new TechdocsGenerator(logger);
```

You can pass an options object as a second argument here.

```
const techdocsGenerator = new TechdocsGenerator(logger, { useTechdocsContainer: false });
```

Setting `useTechdocsContainer` to `false` means that TechDocs backend will not
run another Docker container, and will use locally available `mkdocs` instead.

## Run Backstage locally

Change folder to `<backstage-project-root>/packages/backend` and run the
following command:

```bash
yarn start
```

Open a new command line window. Change directory to your Backstage application
root and run the following command:

```bash
yarn start
```

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/).

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
