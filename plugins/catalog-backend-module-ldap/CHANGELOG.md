# @backstage/plugin-catalog-backend-module-ldap

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
