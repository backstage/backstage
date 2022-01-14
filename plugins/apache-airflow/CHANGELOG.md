# @backstage/plugin-apache-airflow

## 0.1.3

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0

## 0.1.2

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/core-components@0.8.3

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2

## 0.1.0

### Minor Changes

- 9aea335911: Introduces a new plugin for the Apache Airflow workflow management platform.
  This implementation has been tested with the Apache Airflow v2 API,
  authenticating with basic authentication through the Backstage proxy plugin.

  Supported functionality includes:

  - Information card of version information of the Airflow instance
  - Information card of instance health for the meta-database and scheduler
  - Table of DAGs with meta information and status, along with a link to view
    details in the Airflow UI

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1
