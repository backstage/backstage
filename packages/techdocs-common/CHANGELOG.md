# @backstage/techdocs-common

## 0.3.3

### Patch Changes

- 68ad5af51: Improve techdocs-common Generator API for it to be used by techdocs-cli. TechDocs generator.run function now takes
  an input AND an output directory. Most probably you use techdocs-common via plugin-techdocs-backend, and so there
  is no breaking change for you.
  But if you use techdocs-common separately, you need to create an output directory and pass into the generator.
- 371f67ecd: fix to-string breakage of binary files
- f1e74777a: Fix bug where binary files (`png`, etc.) could not load when using AWS or GCS publisher.
- dbe4450c3: Google Cloud authentication in TechDocs has been improved.

  1. `techdocs.publisher.googleGcs.credentials` is now optional. If it is missing, `GOOGLE_APPLICATION_CREDENTIALS`
     environment variable (and some other methods) will be used to authenticate.
     Read more here https://cloud.google.com/docs/authentication/production

  2. `techdocs.publisher.googleGcs.projectId` is no longer used. You can remove it from your `app-config.yaml`.

- 5826d0973: AWS SDK version bump for TechDocs.
- b3b9445df: AWS S3 authentication in TechDocs has been improved.

  1. `techdocs.publisher.awsS3.bucketName` is now the only required config. `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are optional.

  2. If `techdocs.publisher.awsS3.credentials` and `techdocs.publisher.awsS3.region` are missing, the AWS environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` will be used. There are more better ways of setting up AWS authentication. Read the guide at https://backstage.io/docs/features/techdocs/using-cloud-storage

- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.3.2

### Patch Changes

- 7ec525481: 1. Added option to use AWS S3 as a choice to store the static generated files for TechDocs.
- f8ba88ded: Fix for `integration.github.apiBaseUrl` configuration not properly overriding apiBaseUrl used by techdocs
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2
  - @backstage/integration@0.1.5

## 0.3.1

### Patch Changes

- 8804e8981: Using @backstage/integration package for GitHub/GitLab/Azure tokens and request options.

  Most probably you do not have to make any changes in the app because of this change.
  However, if you are using the `DirectoryPreparer` or `CommonGitPreparer` exported by
  `@backstage/techdocs-common` package, you now need to add pass in a `config` (from `@backstage/config`)
  instance as argument.

  ```
  <!-- Before -->
      const directoryPreparer = new DirectoryPreparer(logger);
      const commonGitPreparer = new CommonGitPreparer(logger);
  <!-- Now -->
      const directoryPreparer = new DirectoryPreparer(config, logger);
      const commonGitPreparer = new CommonGitPreparer(config, logger);
  ```

## 0.3.0

### Minor Changes

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

## 0.2.0

### Minor Changes

- dae4f3983: _Breaking changes_

  1. Added option to use Google Cloud Storage as a choice to store the static generated files for TechDocs.
     It can be configured using `techdocs.publisher.type` option in `app-config.yaml`.
     Step-by-step guide to configure GCS is available here https://backstage.io/docs/features/techdocs/using-cloud-storage
     Set `techdocs.publisher.type` to `'local'` if you want to continue using local filesystem to store TechDocs files.

  2. `techdocs.builder` is now required and can be set to `'local'` or `'external'`. (Set it to `'local'` for now, since CI/CD build
     workflow for TechDocs will be available soon (in few weeks)).
     If builder is set to 'local' and you open a TechDocs page, `techdocs-backend` will try to generate the docs, publish to storage and
     show the generated docs afterwords.
     If builder is set to `'external'`, `techdocs-backend` will only fetch the docs and will NOT try to generate and publish. In this case of `'external'`,
     we assume that docs are being built in the CI/CD pipeline of the repository.
     TechDocs will not assume a default value for `techdocs.builder`. It is better to explicitly define it in the `app-config.yaml`.

  3. When configuring TechDocs in your backend, there is a difference in how a new publisher is created.

  ```
  ---  const publisher = new LocalPublish(logger, discovery);
  +++  const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  Based on the config `techdocs.publisher.type`, the publisher could be either Local publisher or Google Cloud Storage publisher.

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7000/api/techdocs/static/docs` in most setups.

  5. Parts of `@backstage/plugin-techdocs-backend` have been moved to a new package `@backstage/techdocs-common` to generate docs. Also to publish docs
     to-and-fro between TechDocs and a storage (either local or external). However, a Backstage app does NOT need to import the `techdocs-common` package -
     app should only import `@backstage/plugin-techdocs` and `@backstage/plugin-techdocs-backend`.

  _Patch changes_

  1. See all of TechDocs config options and its documentation https://backstage.io/docs/features/techdocs/configuration

  2. Logic about serving static files and metadata retrieval have been abstracted away from the router in `techdocs-backend` to the instance of publisher.

  3. Removed Material UI Spinner from TechDocs header. Spinners cause unnecessary UX distraction.
     Case 1 (when docs are built and are to be served): Spinners appear for a split second before the name of site shows up. This unnecessarily distracts eyes because spinners increase the size of the Header. A dot (.) would do fine. Definitely more can be done.
     Case 2 (when docs are being generated): There is already a linear progress bar (which is recommended in Storybook).

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1
