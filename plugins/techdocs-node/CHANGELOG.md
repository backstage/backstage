# @backstage/plugin-techdocs-node

## 1.1.2

### Patch Changes

- f5283a42e2: Updated dependency `@google-cloud/storage` to `^6.0.0`.
- 2c048f8b90: Updated deprecated use of `express`' `res.redirect()` method when handling legacy path casing.
- Updated dependencies
  - @backstage/plugin-search-common@0.3.5
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-model@1.0.3

## 1.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-common@0.3.5-next.1
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2

## 1.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-search-common@0.3.5-next.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0

## 1.1.1

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- c2a1d8935e: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v1.0.3`.
- b26f4cb6a1: Allow usage of custom tags with sequence node type (such as the !ENV tag) in the techdocs mkdocs config.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/plugin-search-common@0.3.4
  - @backstage/catalog-model@1.0.2

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.4-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1

## 1.1.1-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- b26f4cb6a1: Allow usage of custom tags with sequence node type (such as the !ENV tag) in the techdocs mkdocs config.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0

## 1.1.0

### Minor Changes

- bcf1a2496c: Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

### Patch Changes

- 9fa68705bf: The default container version used to generate TechDocs content is now `v1.0.2`.
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-search-common@0.3.3
  - @backstage/backend-common@0.13.2

## 1.1.0-next.2

### Minor Changes

- bcf1a2496c: BREAKING: The default Techdocs behavior will no longer attempt to copy `docs/README.md` or `README.md` to `docs/index.md` (if not found). To retain this behavior in your instance, you can set the following config in your `app-config.yaml`:

  ```yaml
  techdocs:
    generator:
      mkdocs:
        legacyCopyReadmeMdToIndexMd: true
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1
  - @backstage/plugin-search-common@0.3.3-next.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-search-common@0.3.3-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 700d93ff41: - `DirectoryPreparer` now uses private constructor. Use static fromConfig method to instantiate.
  - `UrlPreparer` now uses private constructor. Use static fromConfig method to instantiate.

### Patch Changes

- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-search-common@0.3.2

## 0.11.12

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- cea6f10b97: Renamed `@backstage/techdocs-common` to `@backstage/plugin-techdocs-node`.
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-search-common@0.3.1

## 0.11.12-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3e54f6c436: Use `@backstage/plugin-search-common` package instead of `@backstage/search-common`.
- cea6f10b97: Renamed `@backstage/techdocs-common` to `@backstage/plugin-techdocs-node`.
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-search-common@0.3.1-next.0

## 0.11.11

### Patch Changes

- 955be6bc7d: adds passing projectID to the Storage client
- ff0a16fb1a: Modify techdocs builder to automatically append techdocs-core plugin to mkdocs.yaml file if it is missing. Adds an optional configuration item if this plugin needs to be omitted.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/backend-common@0.12.0
  - @backstage/integration@0.8.0
  - @backstage/search-common@0.3.0

## 0.11.10

### Patch Changes

- 209fd128e6: Updated usage of `github:` location types in docs to use `url:` instead.
- 13ef228d03: Clean up the API interface for TechDocs common library.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/integration@0.7.5

## 0.11.9

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/search-common@0.2.4

## 0.11.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/search-common@0.2.3

## 0.11.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7

## 0.11.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.11.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.11.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.11.5

### Patch Changes

- ff93fbeeec: Fix interpolated string for "Failed to generate docs from ..."
- Updated dependencies
  - @backstage/search-common@0.2.2
  - @backstage/backend-common@0.10.5

## 0.11.4

### Patch Changes

- 47277c0d8c: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v0.3.6`, which includes an update to `mkdocs-monorepo-plugin` that allows glob-based wildcard includes.
- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10

## 0.11.4-next.0

### Patch Changes

- 47277c0d8c: Updated the default version of the `@spotify/techdocs` container used when `techdocs.generator.runIn` is `docker` to `v0.3.6`, which includes an update to `mkdocs-monorepo-plugin` that allows glob-based wildcard includes.
- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration@0.7.2-next.0

## 0.11.3

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.11.2

### Patch Changes

- c2c8768771: Bump `@azure/identity` from `^1.5.0` to `^2.0.1`.
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/integration@0.7.0

## 0.11.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0

## 0.11.0

### Minor Changes

- 1bada775a9: Added the ability for the TechDocs Backend to (optionally) leverage a cache
  store to improve performance when reading files from a cloud storage provider.

### Patch Changes

- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/backend-common@0.9.13

## 0.10.8

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/backend-common@0.9.11

## 0.10.7

### Patch Changes

- 0b60a051c9: Added OpenStack Swift case migration support.
- 9e64a7ac1e: Allow amazon web services s3 buckets to pass an server side encryption configuration so they can publish to encrypted buckets
- Updated dependencies
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10

## 0.10.6

### Patch Changes

- a2d4389587: 1. Techdocs publisher constructors now use parameter objects when being
  instantiated

  2. Internal refactor of `LocalPublish` publisher to use `fromConfig` for
     creation to be aligned with other publishers; this does not impact
     `LocalPublish` usage.

  ```diff
  - const publisher = new LocalPublish(config, logger, discovery);
  + const publisher = LocalPublish.fromConfig(config, logger, discovery);
  ```

- 6129c89a47: Default TechDocs container used at docs generation-time is now [v0.3.5](https://github.com/backstage/techdocs-container/releases/tag/v0.3.5).
- f3c7eec64b: Updated to properly join URL segments under any OS for both AWS S3 and GCP
- Updated dependencies
  - @backstage/backend-common@0.9.9

## 0.10.5

### Patch Changes

- d207f6ee9e: Support optional bucketRootPath configuration parameter in S3 and GCS publishers
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/search-common@0.2.1

## 0.10.4

### Patch Changes

- 87f5b9db13: Use docs/README.md or README.md as fallback if docs/index.md is missing
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.10.3

### Patch Changes

- 156421c59a: Sets the default techdocs docker image to the [latest released version - v0.3.3](https://github.com/backstage/techdocs-container/releases/tag/v0.3.3).
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/integration@0.6.7

## 0.10.2

### Patch Changes

- 1c75e8bf98: Add more context to techdocs log lines when files are not found along with
  ensuring that the routers return 404 with a descriptive message.
- e92f0f728b: Locks the version of the default docker image used to generate TechDocs. As of
  this changelog entry, it is v0.3.2!
- Updated dependencies
  - @backstage/backend-common@0.9.5
  - @backstage/integration@0.6.6

## 0.10.1

### Patch Changes

- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.10.0

### Minor Changes

- 8b0f6f860: Set the correct `edit_uri` or `repo_url` for documentation pages that are hosted on GitHub and GitLab.

  The constructor of the `TechDocsGenerator` changed.
  Prefer the use of `TechdocsGenerator.fromConfig(…)` instead:

  ```diff
  - const techdocsGenerator = new TechdocsGenerator({
  + const techdocsGenerator = TechdocsGenerator.fromConfig(config, {
      logger,
      containerRunner,
  -   config,
    });
  ```

### Patch Changes

- 30ed662a3: Adding in-context search to TechDocs Reader component. Using existing search-backend to query for indexed search results scoped into a specific entity's techdocs. Needs TechDocsCollator enabled on the backend to work.

  Adding extra information to indexed tech docs documents for search.

- 3624616e7: "Local" (out-of-the-box) publisher explicitly follows lower-case entity triplet
  logic.
- 67ba7e088: Only write the updated `mkdocs.yml` file if the content was updated.

  This keeps local files unchanged if the `dir` annotation is used in combination with the `file` location.

- 8eab6be6a: Force using `posix` path for cloud storage
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/search-common@0.2.0
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.9.0

### Minor Changes

- 58452cdb7: OpenStack Swift Client changed with Trendyol's OpenStack Swift SDK.

  ## Migration from old OpenStack Swift Configuration

  Let's assume we have the old OpenStack Swift configuration here.

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          username: ${OPENSTACK_SWIFT_STORAGE_USERNAME}
          password: ${OPENSTACK_SWIFT_STORAGE_PASSWORD}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        keystoneAuthVersion: ${OPENSTACK_SWIFT_STORAGE_AUTH_VERSION}
        domainId: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_ID}
        domainName: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_NAME}
        region: ${OPENSTACK_SWIFT_STORAGE_REGION}
  ```

  ##### Step 1: Change the credential keys

  Since the new SDK uses _Application Credentials_ to authenticate OpenStack, we
  need to change the keys `credentials.username` to `credentials.id`,
  `credentials.password` to `credentials.secret` and use Application Credential ID
  and secret here. For more detail about credentials look
  [here](https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail,authenticating-with-an-application-credential-detail#authenticating-with-an-application-credential).

  ##### Step 2: Remove the unused keys

  Since the new SDK doesn't use the old way authentication, we don't need the keys
  `openStackSwift.keystoneAuthVersion`, `openStackSwift.domainId`,
  `openStackSwift.domainName` and `openStackSwift.region`. So you can remove them.

  ##### Step 3: Add Swift URL

  The new SDK needs the OpenStack Swift connection URL for connecting the Swift.
  So you need to add a new key called `openStackSwift.swiftUrl` and give the
  OpenStack Swift url here. Example url should look like that:
  `https://example.com:6780/swift/v1`

  ##### That's it!

  Your new configuration should look like that!

  ```yaml
  techdocs:
    publisher:
      type: 'openStackSwift'
      openStackSwift:
        containerName: 'name-of-techdocs-storage-bucket'
        credentials:
          id: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_ID}
          secret: ${OPENSTACK_SWIFT_STORAGE_APPLICATION_CREDENTIALS_SECRET}
        authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
        swiftUrl: ${OPENSTACK_SWIFT_STORAGE_SWIFT_URL}
  ```

- c772d9a84: TechDocs sites can now be accessed using paths containing entity triplets of
  any case (e.g. `/docs/namespace/KIND/name` or `/docs/namespace/kind/name`).

  If you do not use an external storage provider for serving TechDocs, this is a
  transparent change and no action is required from you.

  If you _do_ use an external storage provider for serving TechDocs (one of\* GCS,
  AWS S3, or Azure Blob Storage), you must run a migration command against your
  storage provider before updating.

  [A migration guide is available here](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta).

  - (\*) We're seeking help from the community to bring OpenStack Swift support
    [to feature parity](https://github.com/backstage/backstage/issues/6763) with the above.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.8.1

### Patch Changes

- bc405be6e: Stale TechDocs content (files that had previously been published but which have
  since been removed) is now removed from storage at publish-time. This is now
  supported by the following publishers:

  - Google GCS
  - AWS S3
  - Azure Blob Storage

  You may need to apply a greater level of permissions (e.g. the ability to
  delete objects in your storage provider) to any credentials/accounts used by
  the TechDocs CLI or TechDocs backend in order for this change to take effect.

  For more details, see [#6132][issue-ref].

  [issue-ref]: https://github.com/backstage/backstage/issues/6132

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9

## 0.8.0

### Minor Changes

- 48ea3d25b: TechDocs has dropped all support for the long-ago deprecated git-based common
  prepares as well as all corresponding values in `backstage.io/techdocs-ref`
  annotations.

  Entities whose `backstage.io/techdocs-ref` annotation values still begin with
  `github:`, `gitlab:`, `bitbucket:`, or `azure/api:` will no longer be generated
  by TechDocs. Be sure to update these values so that they align with their
  expected format and your usage of TechDocs.

  For details, see [this explainer on TechDocs ref annotation values][how].

  [how]: https://backstage.io/docs/features/techdocs/how-to-guides#how-to-understand-techdocs-ref-annotation-values

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9

## 0.7.1

### Patch Changes

- 59a5fa319: Migrated files are now printed when `techdocs-cli migrate` is run with the
  `--verbose` flag set.
- 54356336e: TechDocs generator stage now supports `mkdocs.yaml` file, in addition to `.yml`
  depending on whichever is present at the time of generation. (Assumes the
  latest `spotify/techdocs` container, running mkdocs `v1.2.2` or greater).

## 0.7.0

### Minor Changes

- d32d01e5b: Improve the annotation `backstage.io/techdocs-ref: dir:<relative-target>` that links to a path that is relative to the source of the annotated entity.
  This annotation works with the basic and the recommended flow, however, it will be most useful with the basic approach.

  This change remove the deprecation of the `dir` reference and provides first-class support for it.
  In addition, this change removes the support of the deprecated `github`, `gitlab`, and `azure/api` locations from the `dir` reference preparer.

  #### Example Usage

  The annotation is convenient if the documentation is stored in the same location, i.e. the same git repository, as the `catalog-info.yaml`.
  While it is still supported to add full URLs such as `backstage.io/techdocs-ref: url:https://...` for custom setups, documentation is mostly stored in the same repository as the entity definition.
  By automatically resolving the target relative to the registration location of the entity, the configuration overhead for this default setup is minimized.
  Since it leverages the `@backstage/integrations` package for the URL resolution, this is compatible with every supported source.

  Consider the following examples:

  1. "I have a repository with a single `catalog-info.yaml` and a TechDocs page in the root folder!"

  ```
  https://github.com/backstage/example/tree/main/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:. # -> same folder
   |  > spec: {}
   |- docs/
   |- mkdocs.yml
  ```

  2. "I have a repository with a single `catalog-info.yaml` and my TechDocs page in located in a folder!"

  ```
  https://bitbucket.org/my-owner/my-project/src/master/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: example
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: dir:./some-folder # -> subfolder
   |  > spec: {}
   |- some-folder/
     |- docs/
     |- mkdocs.yml
  ```

  3. "I have a mono repository that hosts multiple components!"

  ```
  https://dev.azure.com/organization/project/_git/repository
   |- my-1st-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-1st-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- my-2nd-module/
     |- catalog-info.yaml
     |  > apiVersion: backstage.io/v1alpha1
     |  > kind: Component
     |  > metadata:
     |  >   name: my-2nd-module
     |  >   annotations:
     |  >     backstage.io/techdocs-ref: dir:. # -> same folder
     |  > spec: {}
     |- docs/
     |- mkdocs.yml
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Location
   |  > metadata:
   |  >   name: example
   |  > spec:
   |  >   targets:
   |  >     - ./*/catalog-info.yaml
  ```

### Patch Changes

- 6e5aed1c9: Fix validation of mkdocs.yml docs_dir
- 250984333: Add link to https://backstage.io/docs/features/techdocs/configuration in the log warning message about updating techdocs.generate key.
- Updated dependencies
  - @backstage/backend-common@0.8.7

## 0.6.8

### Patch Changes

- d5eaab91d: Adds custom docker image support to the techdocs generator. This change adds a new `techdocs.generator` configuration key and deprecates the existing `techdocs.generators.techdocs` key.

  ```yaml
  techdocs:
    # recommended, going forward:
    generator:
      runIn: 'docker' # or 'local'
      # New optional settings
      dockerImage: my-org/techdocs # use a custom docker image
      pullImage: false # disable automatic pulling of image (e.g. if custom docker login is required)
    # legacy (deprecated):
    generators:
      techdocs: 'docker' # or 'local'
  ```

- c18e8eb91: Provide optional `logger: Logger` and `logStream: Writable` arguments to the `GeneratorBase#run(...)` command.
  They receive all log messages that are emitted during the generator run.
- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.6.7

### Patch Changes

- 683308ecf: Fix openStack swift publisher encoding issue. Remove utf8 forced encoding on binary files
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5

## 0.6.6

### Patch Changes

- ab5cc376f: Use new utilities from `@backstage/backend-common` for safely resolving child paths
- b47fc34bc: Update "service catalog" references to "software catalog"
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7

## 0.6.5

### Patch Changes

- c17c0fcf9: Adding additional checks on tech docs to prevent folder traversal via mkdocs.yml docs_dir value.
- Updated dependencies
  - @backstage/catalog-model@0.8.4

## 0.6.4

### Patch Changes

- aad98c544: Fixes multiple XSS and sanitization bypass vulnerabilities in TechDocs.
- 090594755: Support parsing `mkdocs.yml` files that are using custom yaml tags like
  `!!python/name:materialx.emoji.twemoji`.
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.6.3

### Patch Changes

- 8cefadca0: Adding validation to mkdocs.yml parsing to prevent directory tree traversing
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-model@0.8.0

## 0.6.2

### Patch Changes

- 65e6c4541: Remove circular dependencies
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.6.1

### Patch Changes

- e04f1ccfb: Fixed a bug that prevented loading static assets from GCS, S3, Azure, and OpenStackSwift whose keys contain spaces or other special characters.
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.6.0

### Minor Changes

- e0bfd3d44: Migrate the package to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also no longer provides the `ContainerRunner` as an input to the `GeneratorBase#run(…)` function, but expects it as a constructor parameter instead.

  If you use the `TechdocsGenerator` you need to update the usage:

  ```diff
  + const containerRunner = new DockerContainerRunner({ dockerClient });

  - const generator = new TechdocsGenerator(logger, config);
  + const techdocsGenerator = new TechdocsGenerator({
  +   logger,
  +   containerRunner,
  +   config,
  + });

    await this.generator.run({
      inputDir: preparedDir,
      outputDir,
  -   dockerClient: this.dockerClient,
      parsedLocationAnnotation,
      etag: newEtag,
    });
  ```

### Patch Changes

- e9e56b01a: Adding optional config to enable S3-like API for tech-docs using s3ForcePathStyle option.
  This allows providers like LocalStack, Minio and Wasabi (+possibly others) to be used to host tech docs.
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5

## 0.5.1

### Patch Changes

- f4af06ebe: Gracefully handle HTTP request failures in download method of AzureBlobStorage publisher.

## 0.5.0

### Minor Changes

- bc9d62f4f: Move the sanity checks of the publisher configurations to a dedicated `PublisherBase#getReadiness()` method instead of throwing an error when doing `Publisher.fromConfig(...)`.
  You should include the check when your backend to get early feedback about a potential misconfiguration:

  ```diff
    // packages/backend/src/plugins/techdocs.ts

    export default async function createPlugin({
      logger,
      config,
      discovery,
      reader,
    }: PluginEnvironment): Promise<Router> {
      // ...

      const publisher = await Publisher.fromConfig(config, {
        logger,
        discovery,
      })

  +   // checks if the publisher is working and logs the result
  +   await publisher.getReadiness();

      // Docker client (conditionally) used by the generators, based on techdocs.generators config.
      const dockerClient = new Docker();

      // ...
  }
  ```

  If you want to crash your application on invalid configurations, you can throw an `Error` to preserve the old behavior.
  Please be aware that this is not the recommended for the use in a Backstage backend but might be helpful in CLI tools such as the `techdocs-cli`.

  ```ts
  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  const ready = await publisher.getReadiness();
  if (!ready.isAvailable) {
    throw new Error('Invalid TechDocs publisher configuration');
  }
  ```

### Patch Changes

- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
  - @backstage/catalog-model@0.7.7

## 0.4.5

### Patch Changes

- 8686eb38c: Use errors from `@backstage/errors`
- 424742dc1: Applies only if you use TechDocs local builder instead of building on CI/CD i.e. if `techdocs.builder` in your `app-config.yaml` is set to `'local'`

  Improvements

  1. Do not check for updates in the repository if a check has been made in the last 60 seconds. This is to prevent the annoying check for update on every page switch or load.
  2. No need to maintain an in-memory etag storage, and use the one stored in `techdocs_metadata.json` file alongside generated docs.

  New feature

  1. You can now use a mix of basic and recommended setup i.e. `techdocs.builder` is `'local'` but using an external cloud storage instead of local storage. Previously, in this setup, the docs would never get updated.

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.4.4

### Patch Changes

- d7245b733: Remove runDockerContainer, and start using the utility function provided by @backstage/backend-common
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- 2ef5bc7ea: Implement proper AWS Credentials precedence with assume-role and explicit credentials
- aa095e469: OpenStack Swift publisher added for tech-docs.
- bc46435f5: - Improve deprecation warning messaging in logs.
  - Replace temp folder path from git provider domain(`source`) to full git host name (`resource`). (See: https://github.com/IonicaBizau/git-url-parse#giturlparseurl)
- a501128db: Refactor log messaging to improve clarity
- ca4a904f6: Add an optional configuration option for setting the url endpoint for AWS S3 publisher: `techdocs.publisher.awsS3.endpoint`
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4

## 0.4.3

### Patch Changes

- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- 61299519f: Remove read-store-upload loop when uploading S3 objects for TechDocs
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.4.2

### Patch Changes

- 2499f6cde: Add support for assuming role in AWS integrations
- 1e4ddd71d: Fix AWS, GCS and Azure publisher to work on Windows.
- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.4.1

### Patch Changes

- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- 26e143e60: After TechDocs generate step, insert build timestamp to techdocs_metadata.json
- c6655413d: Improved error reporting in AzureBlobStorage to surface errors when fetching metadata and uploading files fails.
- 44414239f: Pass user and group ID when invoking docker container. When TechDocs invokes Docker, docker could be run as a `root` user which results in generation of files by applications run by non-root user (e.g. TechDocs) will not have access to modify. This PR passes in current user and group ID to docker so that the file permissions of the generated files and folders are correct.
- b0a41c707: Add etag of the prepared file tree to techdocs_metadata.json in the storage
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.4.0

### Minor Changes

- 08142b256: URL Preparer will now use proper etag based caching introduced in https://github.com/backstage/backstage/pull/4120. Previously, builds used to be cached for 30 minutes.

### Patch Changes

- 77ad0003a: Revert AWS SDK version to v2
- 08142b256: TechDocs will throw warning in backend logs when legacy git preparer or dir preparer is used to preparer docs. Migrate to URL Preparer by updating `backstage.io/techdocs-ref` annotation to be prefixed with `url:`.
  Detailed docs are here https://backstage.io/docs/features/techdocs/how-to-guides#how-to-use-url-reader-in-techdocs-prepare-step
  See benefits and reason for doing so https://github.com/backstage/backstage/issues/4409
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [5a5163519]
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.3.7

### Patch Changes

- c777df180: 1. Added option to use Azure Blob Storage as a choice to store the static generated files for TechDocs.
- e44925723: `techdocs.requestUrl` and `techdocs.storageUrl` are now optional configs and the discovery API will be used to get the URL where techdocs plugin is hosted.
- f0320190d: dir preparer will use URL Reader in its implementation.
- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.3.6

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- db2328c88: Add rate limiter for concurrent execution of file uploads in AWS and Google publishers
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1
  - @backstage/integration@0.3.1

## 0.3.5

### Patch Changes

- 53c9c51f2: TechDocs backend now streams files through from Google Cloud Storage to the browser, improving memory usage.
- a5e27d5c1: Create type for TechDocsMetadata (#3716)

  This change introduces a new type (TechDocsMetadata) in packages/techdocs-common. This type is then introduced in the endpoint response in techdocs-backend and in the api interface in techdocs (frontend).

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [fa8ba330a]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/integration@0.3.0

## 0.3.4

### Patch Changes

- a594a7257: @backstage/techdocs-common can now be imported in an environment without @backstage/plugin-techdocs-backend being installed.

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

  4. `techdocs.storageUrl` is now a required config. Should be `http://localhost:7007/api/techdocs/static/docs` in most setups.

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
