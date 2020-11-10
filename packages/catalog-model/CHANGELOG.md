# @backstage/catalog-model

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
