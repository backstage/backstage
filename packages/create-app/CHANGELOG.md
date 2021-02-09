# @backstage/create-app

## 0.3.8

### Patch Changes

- 019fe39a0: **BREAKING CHANGE**: The `useEntity` hook has been moved from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
  To apply this change to an existing app, add `@backstage/plugin-catalog-react` to your dependencies in `packages/app/package.json`, and update
  the import inside `packages/app/src/components/catalog/EntityPage.tsx` as well as any other places you were using `useEntity` or any other functions that were moved to `@backstage/plugin-catalog-react`.
- 436ca3f62: Remove techdocs.requestUrl and techdocs.storageUrl from app-config.yaml
- Updated dependencies [ceef4dd89]
- Updated dependencies [720149854]
- Updated dependencies [c777df180]
- Updated dependencies [398e1f83e]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [b712841d6]
- Updated dependencies [a5628df40]
- Updated dependencies [2430ee7c2]
- Updated dependencies [3149bfe63]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [bc5082a00]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [b37501a3d]
- Updated dependencies [a26668913]
- Updated dependencies [025e122c3]
- Updated dependencies [e9aab60c7]
- Updated dependencies [21e624ba9]
- Updated dependencies [19fe61c27]
- Updated dependencies [e9aab60c7]
- Updated dependencies [da9f53c60]
- Updated dependencies [a08c4b0b0]
- Updated dependencies [24e47ef1e]
- Updated dependencies [bc5082a00]
- Updated dependencies [b37501a3d]
- Updated dependencies [90c8f20b9]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [529d16d27]
- Updated dependencies [54c7d02f7]
- Updated dependencies [de98c32ed]
- Updated dependencies [806929fe2]
- Updated dependencies [019fe39a0]
- Updated dependencies [cdea0baf1]
- Updated dependencies [019fe39a0]
- Updated dependencies [11cb5ef94]
  - @backstage/plugin-catalog-import@0.3.7
  - @backstage/plugin-scaffolder@0.4.2
  - @backstage/plugin-techdocs-backend@0.5.5
  - @backstage/cli@0.6.0
  - @backstage/core@0.6.0
  - @backstage/plugin-api-docs@0.4.4
  - @backstage/plugin-catalog@0.3.0
  - @backstage/theme@0.2.3
  - @backstage/plugin-lighthouse@0.2.9
  - @backstage/backend-common@0.5.2
  - @backstage/plugin-catalog-backend@0.6.0
  - @backstage/plugin-techdocs@0.5.5
  - @backstage/plugin-user-settings@0.2.5
  - @backstage/catalog-model@0.7.1
  - @backstage/plugin-scaffolder-backend@0.6.0
  - @backstage/plugin-app-backend@0.3.6
  - @backstage/plugin-tech-radar@0.3.4
  - @backstage/plugin-explore@0.2.4
  - @backstage/plugin-circleci@0.2.7
  - @backstage/plugin-github-actions@0.3.1
  - @backstage/plugin-search@0.2.7
  - @backstage/test-utils@0.1.6
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.7

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [12a56cdfe]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [0b1182346]
- Updated dependencies [d7b1d317f]
- Updated dependencies [a91aa6bf2]
- Updated dependencies [39b05b9ae]
- Updated dependencies [4eaa06057]
  - @backstage/backend-common@0.5.1
  - @backstage/plugin-scaffolder-backend@0.5.2
  - @backstage/cli@0.5.0
  - @backstage/plugin-catalog@0.2.14
  - @backstage/plugin-catalog-backend@0.5.5
  - @backstage/plugin-catalog-import@0.3.6
  - @backstage/plugin-scaffolder@0.4.1
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/test-utils@0.1.6
  - @backstage/theme@0.2.2
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-app-backend@0.3.5
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-user-settings@0.2.4

## 0.3.6

### Patch Changes

- d3947caf3: Fix accidental dependency on non-existent dependencies.
- Updated dependencies [a4e636c8f]
- Updated dependencies [099c5cf4f]
- Updated dependencies [0ea002378]
- Updated dependencies [a08db734c]
  - @backstage/plugin-catalog@0.2.13
  - @backstage/plugin-scaffolder-backend@0.5.1

## 0.3.6

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- a284f5bc1: Due to a package name change from `@kyma-project/asyncapi-react` to
  `@asyncapi/react-component` the jest configuration in the root `package.json`
  has to be updated:

  ```diff
     "jest": {
       "transformModules": [
  -      "@kyma-project/asyncapi-react
  +      "@asyncapi/react-component"
       ]
     }
  ```

- 89278acab: Migrate to using `FlatRoutes` from `@backstage/core` for the root app routes.

  This is the first step in migrating applications as mentioned here: https://backstage.io/docs/plugins/composability#porting-existing-apps.

  To apply this change to an existing app, switch out the `Routes` component from `react-router` to `FlatRoutes` from `@backstage/core`.
  This also allows you to remove any `/*` suffixes on the route paths. For example:

  ```diff
  import {
     OAuthRequestDialog,
     SidebarPage,
     createRouteRef,
  +  FlatRoutes,
   } from '@backstage/core';
   import { AppSidebar } from './sidebar';
  -import { Route, Routes, Navigate } from 'react-router';
  +import { Route, Navigate } from 'react-router';
   import { Router as CatalogRouter } from '@backstage/plugin-catalog';
  ...
           <AppSidebar />
  -        <Routes>
  +        <FlatRoutes>
  ...
             <Route
  -            path="/catalog/*"
  +            path="/catalog"
               element={<CatalogRouter EntityPage={EntityPage} />}
             />
  -          <Route path="/docs/*" element={<DocsRouter />} />
  +          <Route path="/docs" element={<DocsRouter />} />
  ...
             <Route path="/settings" element={<SettingsRouter />} />
  -        </Routes>
  +        </FlatRoutes>
         </SidebarPage>
  ```

- 26d3b24f3: fix routing and config for user-settings plugin

  To make the corresponding change in your local app, add the following in your App.tsx

  ```
  import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
  ...
  <Route path="/settings" element={<SettingsRouter />} />
  ```

  and the following to your plugins.ts:

  ```
  export { plugin as UserSettings } from '@backstage/plugin-user-settings';
  ```

- 92dbbcedd: Add `*-credentials.yaml` to gitignore to prevent accidental commits of sensitive credential information.

  To apply this change to an existing installation, add these lines to your `.gitignore`

  ```gitignore
  # Sensitive credentials
  *-credentials.yaml
  ```

- d176671d1: use `fromConfig` for all scaffolder helpers, and use the url protocol for app-config location entries.

  To apply this change to your local installation, replace the contents of your `packages/backend/src/plugins/scaffolder.ts` with the following contents:

  ```ts
  import {
    CookieCutter,
    createRouter,
    Preparers,
    Publishers,
    CreateReactAppTemplater,
    Templaters,
    CatalogEntityClient,
  } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';
  import type { PluginEnvironment } from '../types';
  import Docker from 'dockerode';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    const cookiecutterTemplater = new CookieCutter();
    const craTemplater = new CreateReactAppTemplater();
    const templaters = new Templaters();
    templaters.register('cookiecutter', cookiecutterTemplater);
    templaters.register('cra', craTemplater);

    const preparers = await Preparers.fromConfig(config, { logger });
    const publishers = await Publishers.fromConfig(config, { logger });

    const dockerClient = new Docker();

    const discovery = SingleHostDiscovery.fromConfig(config);
    const entityClient = new CatalogEntityClient({ discovery });

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      entityClient,
    });
  }
  ```

  This will ensure that the `scaffolder-backend` package can add handlers for the `url` protocol which is becoming the standard when registering entities in the `catalog`

- 9d1d1138e: Ensured that versions bumps of packages used in the app template trigger a release of this package when needed.
- db05f7a35: Remove the `@types/helmet` dev dependency from the app template. This
  dependency is now unused as the package `helmet` brings its own types.

  To update your existing app, simply remove the `@types/helmet` dependency from
  the `package.json` of your backend package.

- Updated dependencies [def2307f3]
- Updated dependencies [46bba09ea]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [2b514d532]
- Updated dependencies [318a6af9f]
- Updated dependencies [33846acfc]
- Updated dependencies [294a70cab]
- Updated dependencies [b604a9d41]
- Updated dependencies [ac7be581a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [0ea032763]
- Updated dependencies [8855f61f6]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [ad838c02f]
- Updated dependencies [f04db53d7]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [0643a3336]
- Updated dependencies [debf359b5]
- Updated dependencies [a2291d7cc]
- Updated dependencies [f9ba00a1c]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/plugin-catalog-backend@0.5.4
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/core@0.5.0
  - @backstage/backend-common@0.5.0
  - @backstage/plugin-catalog@0.2.12
  - @backstage/plugin-catalog-import@0.3.5
  - @backstage/cli@0.4.7
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-scaffolder@0.4.0
  - @backstage/plugin-scaffolder-backend@0.5.0
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-auth-backend@0.2.11
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-user-settings@0.2.4
  - @backstage/plugin-app-backend@0.3.4
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.5

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

## 0.3.4

### Patch Changes

- 643dcec7c: noop release for create-app to force re-deploy

## 0.3.3

### Patch Changes

- bd9c6719f: Bumping the version for `create-app` so that we can use the latest versions of internal packages and rebuild the version which is passed to the package.json

## 0.3.2

### Patch Changes

- c2b52d9c5: Replace `register-component` plugin with new `catalog-import` plugin
- fc6839f13: Bump `sqlite3` to v5.

  To apply this change to an existing app, change the version of `sqlite3` in the `dependencies` of `packages/backend/package.json`:

  ```diff
       "pg": "^8.3.0",
  -    "sqlite3": "^4.2.0",
  +    "sqlite3": "^5.0.0",
       "winston": "^3.2.1"
  ```

  Note that the `sqlite3` dependency may not be preset if you chose to use PostgreSQL when creating the app.

- 8d68e4cdc: Removed the Circle CI sidebar item, since the target page does not exist.

  To apply this change to an existing app, remove `"CircleCI"` sidebar item from `packages/app/src/sidebar.tsx`, and the `BuildIcon` import if it is unused.

- 1773a5182: Removed lighthouse plugin from the default set up plugins, as it requires a separate Backend to function.

  To apply this change to an existing app, remove the following:

  1. The `lighthouse` block from `app-config.yaml`.
  2. The `@backstage/plugin-lighthouse` dependency from `packages/app/package.json`.
  3. The `@backstage/plugin-lighthouse` re-export from `packages/app/src/plugins.ts`.
  4. The Lighthouse sidebar item from `packages/app/src/sidebar.tsx`, and the `RuleIcon` import if it is unused.

## 0.3.1

### Patch Changes

- 4e0e3b1bf: Add missing `yarn clean` for app.

  For users with existing Backstage installations, add the following under the `scripts` section in `packages/app/package.json`, after the "lint" entry:

  ```json
  "clean": "backstage-cli clean",
  ```

  This will add the missing `yarn clean` for the generated frontend.

- 352a6581f: Added `"start-backend"` script to root `package.json`.

  To apply this change to an existing app, add the following script to the root `package.json`:

  ```json
  "start-backend": "yarn workspace backend start"
  ```

## 0.3.0

### Minor Changes

- 0101c7a16: Add search plugin to default template for CLI created apps

### Patch Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

## 0.2.5

### Patch Changes

- 2783ec018: In the techdocs-backend plugin (`packages/backend/src/plugins/techdocs.ts`), create a publisher using

  ```
    const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  instead of

  ```
    const publisher = new LocalPublish(logger, discovery);
  ```

  An instance of `publisher` can either be a local filesystem publisher or a Google Cloud Storage publisher.

  Read more about the configs here https://backstage.io/docs/features/techdocs/configuration
  (You will also have to update `techdocs.storage.type` to `local` or `googleGcs`. And `techdocs.builder` to either `local` or `external`.)

## 0.2.4

### Patch Changes

- 94348441e: Add `"files": ["dist"]` to both app and backend packages. This ensures that packaged versions of these packages do not contain unnecessary files.

  To apply this change to an existing app, add the following to `packages/app/package.json` and `packages/backend/package.json`:

  ```json
    "files": [
      "dist"
    ]
  ```

- cb5fc4b29: Adjust template to the latest changes in the `api-docs` plugin.

  ## Template Changes

  While updating to the latest `api-docs` plugin, the following changes are
  necessary for the `create-app` template in your
  `app/src/components/catalog/EntityPage.tsx`. This adds:

  - A custom entity page for API entities
  - Changes the API tab to include the new `ConsumedApisCard` and
    `ProvidedApisCard` that link to the API entity.

  ```diff
   import {
  +  ApiDefinitionCard,
  -  Router as ApiDocsRouter,
  +  ConsumedApisCard,
  +  ProvidedApisCard,
  +  ConsumedApisCard,
  +  ConsumingComponentsCard,
  +  ProvidedApisCard,
  +  ProvidingComponentsCard
   } from '@backstage/plugin-api-docs';

  ...

  +const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3} alignItems="stretch">
  +    <Grid item md={6}>
  +      <ProvidedApisCard entity={entity} />
  +    </Grid>
  +    <Grid item md={6}>
  +      <ConsumedApisCard entity={entity} />
  +    </Grid>
  +  </Grid>
  +);

   const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
     <EntityPageLayout>
       <EntityPageLayout.Content
        path="/"
        title="Overview"
        element={<OverviewContent entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/ci-cd/*"
        title="CI/CD"
        element={<CICDSwitcher entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/api/*"
        title="API"
  -     element={<ApiDocsRouter entity={entity} />}
  +     element={<ComponentApisContent entity={entity} />}
      />
  ...

  -export const EntityPage = () => {
  -  const { entity } = useEntity();
  -  switch (entity?.spec?.type) {
  -    case 'service':
  -      return <ServiceEntityPage entity={entity} />;
  -    case 'website':
  -      return <WebsiteEntityPage entity={entity} />;
  -    default:
  -      return <DefaultEntityPage entity={entity} />;
  -  }
  -};

  +export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  +  switch (entity?.spec?.type) {
  +    case 'service':
  +      return <ServiceEntityPage entity={entity} />;
  +    case 'website':
  +      return <WebsiteEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  +
  +const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item md={6}>
  +      <AboutCard entity={entity} />
  +    </Grid>
  +    <Grid container item md={12}>
  +      <Grid item md={6}>
  +        <ProvidingComponentsCard entity={entity} />
  +      </Grid>
  +      <Grid item md={6}>
  +        <ConsumingComponentsCard entity={entity} />
  +      </Grid>
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item xs={12}>
  +      <ApiDefinitionCard apiEntity={entity} />
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiEntityPage = ({ entity }: { entity: Entity }) => (
  +  <EntityPageLayout>
  +    <EntityPageLayout.Content
  +      path="/*"
  +      title="Overview"
  +      element={<ApiOverviewContent entity={entity} />}
  +    />
  +    <EntityPageLayout.Content
  +      path="/definition/*"
  +      title="Definition"
  +      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
  +    />
  +  </EntityPageLayout>
  +);
  +
  +export const EntityPage = () => {
  +  const { entity } = useEntity();
  +
  +  switch (entity?.kind?.toLowerCase()) {
  +    case 'component':
  +      return <ComponentEntityPage entity={entity} />;
  +    case 'api':
  +      return <ApiEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  ```

- 1e22f8e0b: Unify `dockerode` library and type dependency versions

## 0.2.3

### Patch Changes

- 68fdc3a9f: Optimized the `yarn install` step in the backend `Dockerfile`.

  To apply these changes to an existing app, make the following changes to `packages/backend/Dockerfile`:

  Replace the `RUN yarn install ...` line with the following:

  ```bash
  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
  ```

- 4a655c89d: Removed `"resolutions"` entry for `esbuild` in the root `package.json` in order to use the version specified by `@backstage/cli`.

  To apply this change to an existing app, remove the following from your root `package.json`:

  ```json
  "resolutions": {
    "esbuild": "0.6.3"
  },
  ```

- ea475893d: Add [API docs plugin](https://github.com/backstage/backstage/tree/master/plugins/api-docs) to new apps being created through the CLI.

## 0.2.2

### Patch Changes

- 7d7abd50c: Add `app-backend` as a backend plugin, and make a single docker build of the backend the default way to deploy backstage.

  Note that the `app-backend` currently only is a solution for deployments of the app, it's not a dev server and is not intended for local development.

  ## Template changes

  As a part of installing the `app-backend` plugin, the below changes where made. The changes are grouped into two steps, installing the plugin, and updating the Docker build and configuration.

  ### Installing the `app-backend` plugin in the backend

  First, install the `@backstage/plugin-app-backend` plugin package in your backend. These changes where made for `v0.3.0` of the plugin, and the installation process might change in the future. Run the following from the root of the repo:

  ```bash
  cd packages/backend
  yarn add @backstage/plugin-app-backend
  ```

  For the `app-backend` to get access to the static content in the frontend we also need to add the local `app` package as a dependency. Add the following to your `"dependencies"` in `packages/backend/package.json`, assuming your app package is still named `app` and on version `0.0.0`:

  ```json
  "app": "0.0.0",
  ```

  Don't worry, this will not cause your entire frontend dependency tree to be added to the app, just double check that `packages/app/package.json` has a `"bundled": true` field at top-level. This signals to the backend build process that the package is bundled and that no transitive dependencies should be included.

  Next, create `packages/backend/src/plugins/app.ts` with the following:

  ```ts
  import { createRouter } from '@backstage/plugin-app-backend';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    return await createRouter({
      logger,
      config,
      appPackageName: 'app',
    });
  }
  ```

  In `packages/backend/src/index.ts`, make the following changes:

  Add an import for the newly created plugin setup file:

  ```ts
  import app from './plugins/app';
  ```

  Setup the following plugin env.

  ```ts
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  ```

  Change service builder setup to include the `app` plugin as follows. Note that the `app` plugin is not installed on the `/api` route with most other plugins.

  ```ts
  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));
  ```

  You should now have the `app-backend` plugin installed in your backend, ready to serve the frontend bundle!

  ### Docker build setup

  Since the backend image is now the only one needed for a simple Backstage deployment, the image tag name in the `build-image` script inside `packages/backend/package.json` was changed to the following:

  ```json
  "build-image": "backstage-cli backend:build-image --build --tag backstage",
  ```

  For convenience, a `build-image` script was also added to the root `package.json` with the following:

  ```json
  "build-image": "yarn workspace backend build-image",
  ```

  In the root of the repo, a new `app-config.production.yaml` file was added. This is used to set the appropriate `app.baseUrl` now that the frontend is served directly by the backend in the production deployment. It has the following contents:

  ```yaml
  app:
    # Should be the same as backend.baseUrl when using the `app-backend` plugin
    baseUrl: http://localhost:7000

  backend:
    baseUrl: http://localhost:7000
    listen:
      port: 7000
  ```

  In order to load in the new configuration at runtime, the command in the `Dockerfile` at the repo root was changed to the following:

  ```dockerfile
  CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
  ```

## 0.2.1

### Patch Changes

- c56e28375: Fix missing api-docs plugin registration in app template

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- d7873e1aa: Default to using internal scope for new plugins
- 6f447b3fc: Remove identity-backend

  Not used, and we're heading down the route of identities in the catalog

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

- 7aff112af: The default mount point for backend plugins have been changed to /api. These changes are done in the backend package itself, so it is recommended that you sync up existing backend packages with this new pattern.

### Patch Changes

- e67d49bf5: Sync scaffolded backend with example
- 961414d55: Remove discovery api override
- 440a17b39: Bump @backstage/catalog-backend and pass the now required UrlReader interface to the plugin
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

- 67d76b419: Fix for configured templates using 'url' locations even though it's not supported yet
- 7bbeb049f: Change loadBackendConfig to return the config directly
