# @backstage/plugin-catalog-backend

## 0.2.2

### Patch Changes

- 0c2121240: Add support for reading groups and users from the Microsoft Graph API.
- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.2.1

### Patch Changes

- f531d307c: An entity A, that exists in the catalog, can no longer be overwritten by registering a different location that also tries to supply an entity with the same kind+namespace+name. Writes of that new entity will instead be rejected with a log message similar to `Rejecting write of entity Component:default/artist-lookup from file:/Users/freben/dev/github/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml because entity existed from github:https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/components/artist-lookup-component.yaml`
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.2.0

### Minor Changes

- e0be86b6f: Entirely case insensitive read path of entities
- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- 57d555eb2: This feature works the same as \$secret does in config - it allows programmatic substitution of values into a document.

  This is particularly useful e.g. for API type entities where you do not want to repeat your entire API spec document inside the catalog-info.yaml file. For those cases, you can instead do something like

  ```
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: my-federated-service
  spec:
    type: graphql
    definition:
      $text: ./schema.graphql
  ```

  The textual content of that file will be injected as the value of definition, during each refresh loop. Both relative and absolute paths are supported, as well as any HTTP/HTTPS URL pointing to a service that returns the relevant data.

  The initial version supports injection of text file data, and structured data from JSON and YAML files. You can add any handler of your own in addition to these.

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- 81cb94379: Simplify the read function in processors
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- ce1f55398: Use the new `UrlReader` in `PlaceholderProcessor`.
  This allows to use the placeholder processor to include API definitions in API entities.
  Previously it was only possible to do this if the definition comes from the same location type as the entity itself.
- e6b00e3af: Remove the backstage.io/definition-at-location annotation.
  The annotation was superseded by the placeholder processor.

  ```yaml
  apiVersion: backstage.io/v1alpha1
  kind: API
  metadata:
    name: spotify
    description: The Spotify web API
    tags:
      - spotify
      - rest
    annotations:
      # Don't use this annotation, but the placeholder $text instead (see below).
      backstage.io/definition-at-location: 'url:https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml'
  spec:
    type: openapi
    lifecycle: production
    owner: spotify@example.com
    definition:
      $text: https://raw.githubusercontent.com/APIs-guru/openapi-directory/master/APIs/spotify.com/v1/swagger.yaml
  ```

- 99710b102: The way that wiring together a catalog happens, has changed drastically. Now
  there is a new class `CatalogBuilder` that does almost all of the heavy lifting
  of how to augment/replace pieces of catalog functionality, such as adding
  support for custom entities or adding additional processors.

  As the builder was added, a lot of the static methods and builders for default
  setups have been removed from classes deep in the hierarchy. Instead, the
  builder contains the knowledge of what the defaults are.

- 002860e7a: Filters passed to the `/entities` endpoint of the catalog has changed format.

  The old way was to pass things on the form `?a=b&c=d`; the new way is to pass
  things on the form `?filter=a=b,c=d`. See discussion in
  [#2910](https://github.com/backstage/backstage/issues/2910) for details.

  The comma separated items within a single filter have an AND between them. If
  multiple such filters are passed, they have an OR between those item groups.

- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- 948052cbb: Add ability to dry run adding a new location to the catalog API.

  The location is now added in a transaction and afterwards rolled back.
  This allows users to dry run this operation to see if there entity has issues.
  This is probably done by automated tools in the CI/CD pipeline.

- 4036ff59d: - The `CatalogProcessor` API was updated to have `preProcessEntity` and
  `postProcessEntity` methods, instead of just one `processEntity`. This makes
  it easier to make processors that have several stages in one, and to make
  different processors more position independent in the list of processors.
  - The `EntityPolicy` is now given directly to the `LocationReaders`, instead of
    being enforced inside a policy. We have decided to separate out the act of
    validating an entity to be outside of the processing flow, to make it
    possible to apply more liberally and to evolve it as a separate concept.
  - Because of the above, the `EntityPolicyProcessor` has been removed.
- 512d70973: Use the new `UrlReader` in the `CodeOwnersProcessor`.
- 2f62e1804: Removed the parseData step from catalog processors. Locations readers should emit full entities instead.
- 36a71d278: Removed support for deprecated `catalog.providers` config that have been moved to `integrations`
- a5cb46bac: Renamed the `LocationProcessor` class to `CatalogProcessor`.

  Likewise, renamed `LocationProcessorResult`, `LocationProcessorLocationResult`,
  `LocationProcessorDataResult`, `LocationProcessorEntityResult`,
  `LocationProcessorErrorResult`, and `LocationProcessorEmit` to their `Catalog*`
  counterparts.

- 49d70ccab: Remove the `read` argument of `LocationProcessor.processEntity`.
  Instead, pass the `UrlReader` into the constructor of your `LocationProcessor`.
- 440a17b39: The catalog backend UrlReaderProcessor now uses a UrlReader from @backstage/backend-common, which must now be supplied to the constructor.

### Patch Changes

- 3472c8be7: Add codeowners processor

  - Add `codeowners-utils@^1.0.2` as a dependency
  - Add `core-js@^3.6.5` as a dependency
  - Added new CodeOwnersProcessor

- 33454c0f2: Fix `CatalogBuilder#addProcessor`.
- 183e2a30d: Add support for `fields` sub-selection of just parts of an entity when listing
  entities in the catalog backend.

  Example: `.../entities?fields=metadata.name,spec.type` will return partial
  entity objects with only those exact fields present and the rest cut out.
  Fields do not have to be simple scalars - you can for example do
  `fields=metadata`.

- 8bdf0bcf5: Fix CodeOwnersProcessor to handle non team users
- 4c4eab81b: The CodeOwnersProcessor now handles 'url' locations
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
