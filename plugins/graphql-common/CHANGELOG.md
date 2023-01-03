# @frontside/backstage-plugin-graphql

## 0.6.0

### Minor Changes

- f99de6d: Replacing batch-loader with getEntitiesByRefs from Backtage Catalog Client

  Backstage Catalog REST API is now providing an endpoint for querying entities by refs.
  This was in introduced in https://github.com/backstage/backstage/pull/14354 and
  it's available via the [Catalog API Client getEntitiesByRefs method](https://backstage.io/docs/reference/catalog-client.catalogapi.getentitiesbyrefs).

  This changes makes our `@frontside/backstage-plugin-batch-loader` unnecessary. In this release, we're deprecating
  `@frontside/backstage-plugin-batch-loader` and replacing it with native loader.

  You'll need to change your graphql plugin to pass the catalog client to the GraphQL plugin router.

- 6502a7e: Change interfaces naming convention. Rename @relation arguments

## 0.5.4

### Patch Changes

- f35c094: Update readme to use `printSchemaWithDirectives` instead of `printSchema`
- d62b0ad: Upgraded to Backstage 1.9
- Updated dependencies [d62b0ad]
  - @frontside/backstage-plugin-batch-loader@0.2.4

## 0.5.3

### Patch Changes

- e32fcc1: Mark some Entity fields required

## 0.5.2

### Patch Changes

- a8da69a: Rename Connection field `total`->`count`

## 0.5.1

### Patch Changes

- d64bccf: Remove using field name as a fallback for @relation and @field directives
- 832d838: Make `PageInfo` as an object type instead of interface
- 82b23f0: Add ability to specify default value for `@field` directive
- af44f87: Make cursor fields for PageInfo interface optional

## 0.5.0

### Minor Changes

- f4cd38f: Make a lot improvements to the graphql-plugin:

  - `@relation` directive supports Relay Connections
  - `@extend` directive works only on interfaces
  - `@extend` allows to declare subtypes by defining condition by `when/is` arguments
  - For each interface with `@extend` directive a new object type is generated with `-Impl` suffix
  - Exposed `transformSchema` function for creating input schema for codegen
  - Allows to specify custom data loaders
  - Union types which are used in connections are transformed to interfaces

### Patch Changes

- Updated dependencies [f4cd38f]
  - @frontside/backstage-plugin-batch-loader@0.2.3

## 0.4.2

### Patch Changes

- ad0fde9: Upgrade backstage to 1.7 and bump effection dependencies

## 0.4.1

### Patch Changes

- 2a52c92: Upgraded dependencies to bring inline with Backstage 1.6

## 0.4.0

### Minor Changes

- 79a8068: Add a graphgen model that can be used to generate a backstage Domain entity

## 0.3.0

### Minor Changes

- 6ad6e23: Separate grapghen SDL file into new package @frontside/graphgen-backstage

## 0.2.1

### Patch Changes

- 80962dc: Allow importing GraphQL Modules into Backstage GraphQL Plugin
- df24c85: Adding README for `@frontside/backstage-plugin-graphql`

## 0.2.0

### Minor Changes

- 7f8bb2b: Initial release of Backstage GraphQL Plugin
