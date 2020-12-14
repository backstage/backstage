---
id: getting-started
title: Getting Started
description: Getting Started Documentation
---

TechDocs functions as a plugin to Backstage, so you will need to use Backstage
to use TechDocs.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

> If you used `npx @backstage/create-app`, TechDocs may already be present.
>
> You should skip to `Setting the Configuration` below.

## Adding TechDocs frontend plugin

The first step is to add the TechDocs plugin to your Backstage application.
Navigate to your new Backstage application directory. And then to your
`packages/app` directory, and install the `@backstage/plugin-techdocs` package.

```bash
cd my-backstage-app/
cd packages/app
yarn add @backstage/plugin-techdocs
```

Once the package has been installed, you need to import the plugin in your app.

Add the following to `packages/app/src/plugins.ts`:

```typescript
export { plugin as TechDocs } from '@backstage/plugin-techdocs';
```

Now let us embed the TechDocs router in our main Backstage frontend router. In
`packages/app/src/App.tsx`, import the TechDocs router and add the following to
`AppRoutes`:

```tsx
import { Router as DocsRouter } from '@backstage/plugin-techdocs';

// ...

const AppRoutes = () => {
  <Routes>
    // ... other plugin routes
    <Route path="/docs/*" element={<DocsRouter />} />
  </Routes>;
};
```

That's it! But now, we need the TechDocs Backend plugin for the frontend to
work.

## Adding TechDocs backend plugin

Navigate to `packages/backend` of your Backstage app, and install the
`@backstage/plugin-techdocs-backend` package.

```bash
cd my-backstage-app/
cd packages/backend
yarn add @backstage/plugin-techdocs-backend
```

Create a file called `techdocs.ts` inside `packages/backend/src/plugins/` and
add the following

```typescript
import {
  createRouter,
  DirectoryPreparer,
  Preparers,
  Generators,
  TechdocsGenerator,
  CommonGitPreparer,
  UrlPreparer,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import { PluginEnvironment } from '../types';
import Docker from 'dockerode';

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
}: PluginEnvironment) {
  // Preparers are responsible for fetching source files for documentation.
  const preparers = new Preparers();

  const directoryPreparer = new DirectoryPreparer(logger);
  preparers.register('dir', directoryPreparer);

  const commonGitPreparer = new CommonGitPreparer(logger);
  preparers.register('github', commonGitPreparer);
  preparers.register('gitlab', commonGitPreparer);
  preparers.register('azure/api', commonGitPreparer);

  const urlPreparer = new UrlPreparer(reader, logger);
  preparers.register('url', urlPreparer);

  // Generators are used for generating documentation sites.
  const generators = new Generators();
  const techdocsGenerator = new TechdocsGenerator(logger, config);
  generators.register('techdocs', techdocsGenerator);

  // Publishers are used for
  // 1. Publishing generated files to storage
  // 2. Fetching files from storage and passing them to TechDocs frontend.
  const publisher = Publisher.fromConfig(config, logger, discovery);

  // Docker client used by the generators.
  const dockerClient = new Docker();

  return await createRouter({
    preparers,
    generators,
    publisher,
    dockerClient,
    logger,
    config,
    discovery,
  });
}
```

You may need to install the `dockerode` package. But you may already have it in
your backend since Scaffolder plugin also uses it.

See [Concepts](concepts.md) and [TechDocs Architecture](architecture.md) to
learn more about how preparers, generators and publishers work.

Final step is to import the techdocs backend plugin in Backstage app backend.
Add the following to your `packages/backend/src/index.ts`:

```typescript
import techdocs from './plugins/techdocs';

// .... main should already be present.
async function main() {
  // ... other backend plugin envs
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));

  // ... other backend plugin routes
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
}
```

That's it! TechDocs frontend and backend have now been added to your Backstage
app. Now let us tweak some configurations to suit your needs.

## Setting the configuration

**See [TechDocs Configuration Options](configuration.md) for complete
configuration reference.**

### Setting TechDocs URLs

```yaml
techdocs:
  storageUrl: http://localhost:7000/api/techdocs/static/docs
  requestUrl: http://localhost:7000/api/techdocs/
```

`requestUrl` is used by TechDocs frontend plugin to discover techdocs-backend
endpoints, and the `storageUrl` is another endpoint in `techdocs-backend` which
acts as a middleware between TechDocs and the storage (where the static
generated docs site are stored). These default values should mostly work for
you. These options will soon be optional to set.

### Should Backstage generate docs?

```yaml
techdocs:
  storageUrl: http://localhost:7000/api/techdocs/static/docs
  requestUrl: http://localhost:7000/api/techdocs/
  builder: 'local'
```

Set `techdocs.builder` to `'local'` if you want your Backstage app to be
responsible for generating documentation sites. If set to `'external'`,
Backstage will assume that the sites are being generated on each entity's CI/CD
pipeline, and are being stored in a storage somewhere.

When `techdocs.builder` is set to `'external'`, TechDocs becomes more or less a
read-only experience where it serves static files from a storage containing all
the generated documentation. Read more in the "Basic" and "Recommended" setup of
TechDocs [here](architecture.md)

### Choosing storage (publisher)

TechDocs needs to know where to store generated documentation sites and where to
fetch the sites from. This is managed by a
[Publisher](./concepts.md#techdocs-publisher). Examples: Google Cloud Storage,
Amazon S3, or local filesystem of Backstage server.

It is okay to use the local filesystem in a "Basic" setup when you are trying
out Backstage for the first time. Using Cloud Storage is documented
[here](./using-cloud-storage.md).

```yaml
techdocs:
  storageUrl: http://localhost:7000/api/techdocs/static/docs
  requestUrl: http://localhost:7000/api/techdocs/
  builder: 'local'
  publisher:
    type: 'local'
```

### Disabling Docker in Docker situation (Optional)

You can skip this if your `techdocs.builder` is set to `'external'`.

The TechDocs backend plugin runs a docker container with mkdocs installed to
generate the frontend of the docs from source files (Markdown). If you are
deploying Backstage using Docker, this will mean that your Backstage Docker
container will try to run another Docker container for TechDocs backend.

To avoid this problem, we have a configuration available. You can set a value in
your `app-config.yaml` that tells the techdocs generator if it should run the
`local` mkdocs or run it from `docker`. This defaults to running as `docker` if
no config is provided.

```yaml
techdocs:
  generators:
    techdocs: local
```

Setting `generators.techdocs` to `local` means you will have to make sure your
environment is compatible with techdocs.

You will have to install the `mkdocs` and `mkdocs-techdocs-core` package from
pip, as well as `graphviz` and `plantuml` from your OS package manager (e.g.
apt). See our
[Dockerfile](https://github.com/backstage/techdocs-container/blob/main/Dockerfile)
for the latest requirements. You should be trying to match your Dockerfile with
this one.

Note: We recommend Python version 3.7 or higher.

Caveat: Please install the `mkdocs-techdocs-core` package after all other Python
packages. The order is important to make sure we get correct version of some of
the dependencies. For example, we want `Markdown` version to be
[3.2.2](https://github.com/backstage/backstage/blob/f9f70c225548017b6a14daea75b00fbd399c11eb/packages/techdocs-container/techdocs-core/requirements.txt#L11).
You can also explicitly install `Markdown==3.2.2` after installing all other
Python packages.

## Run Backstage locally

Start the frontend and the backend app by
[running backstage locally](../../getting-started/running-backstage-locally.md).

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/)
to see all your documentation sites.

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
