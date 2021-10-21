# @backstage/plugin-catalog-backend-module-ldap

## 0.3.5

### Patch Changes

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.0

## 0.3.3

### Patch Changes

- a31afc5b62: Replace slash stripping regexp with trimEnd to remove CodeQL warning
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.16.0
  - @backstage/catalog-model@0.9.4

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.15.0

## 0.3.1

### Patch Changes

- 8b016ce67b: Alters LDAP processor to handle one SearchEntry at a time
- febddedcb2: Bump `lodash` to remediate `SNYK-JS-LODASH-590103` security vulnerability
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.14.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10

## 0.3.0

### Minor Changes

- 54b441abe: Introduce `LdapOrgEntityProvider` as an alternative to `LdapOrgReaderProcessor`. This also changes the `LdapClient` interface to require a logger.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.3
  - @backstage/config@0.1.7

## 0.2.2

### Patch Changes

- 2a2a2749b: chore(deps): bump `@types/ldapjs` from 1.0.10 to 2.2.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.1

## 0.2.1

### Patch Changes

- afe3e4b54: Expose missing types used by the custom transformers
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.13.0

## 0.2.0

### Minor Changes

- b055ef88a: Add extension points to the `LdapOrgReaderProcessor` to make it possible to do more advanced modifications
  of the ingested users and groups.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.0
  - @backstage/plugin-catalog-backend@0.12.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.11.0
