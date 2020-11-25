# @backstage/catalog-model

## 0.3.0

### Minor Changes

- 1166fcc36: add kubernetes selector to component model

### Patch Changes

- 1185919f3: Marked the `Group` entity fields `ancestors` and `descendants` for deprecation on Dec 6th, 2020. See https://github.com/backstage/backstage/issues/3049 for details.

  Code that consumes these fields should remove those usages as soon as possible. There is no current or planned replacement for these fields.

  The BuiltinKindsEntityProcessor has been updated to inject these fields as empty arrays if they are missing. Therefore, if you are on a catalog instance that uses the updated version of this code, you can start removing the fields from your source catalog-info.yaml data as well, without breaking validation.

  After Dec 6th, the fields will be removed from types and classes of the Backstage repository. At the first release after that, they will not be present in released packages either.

  If your catalog-info.yaml files still contain these fields after the deletion, they will still be valid and your ingestion will not break, but they won't be visible in the types for consuming code.

## 0.2.0

### Minor Changes

- 3a4236570: Add handling and docs for entity references
- e0be86b6f: Entirely case insensitive read path of entities
- f70a52868: Add the User & Group entities

  A user describes a person, such as an employee, a contractor, or similar. Users belong to Group entities in the catalog.

  A group describes an organizational entity, such as for example a team, a business unit, or a loose collection of people in an interest group. Members of these groups are modeled in the catalog as kind User.

- 12b5fe940: Add ApiDefinitionAtLocationProcessor that allows to load a API definition from another location
- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.
- 5adfc005e: Changes the various kind policies into a new type `KindValidator`.

  Adds `CatalogProcessor#validateEntityKind` that makes use of the above
  validators. This moves entity schema validity checking away from entity
  policies and into processors, centralizing the extension points into the
  processor chain.

- b3d57961c: Enable adding locations for config files that does not yet exist by adding a flag to api request

### Patch Changes

- fa56f4615: Fix documentation and validation message for tags
