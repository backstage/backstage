# @backstage/plugin-app-backend

## 0.3.0

### Minor Changes

- 1722cb53c: Use new config schema support to automatically inject config with frontend visibility, in addition to the existing env schema injection.

  This removes the confusing behavior where configuration was only injected into the app at build time. Any runtime configuration (except for environment config) in the backend used to only apply to the backend itself, and not be injected into the frontend.

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0
  - @backstage/config-loader@0.3.0

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [ce5512bc0]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
  - @backstage/config-loader@0.2.0
