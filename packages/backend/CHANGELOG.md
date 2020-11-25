# example-backend

## 0.2.3

### Patch Changes

- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [0c2121240]
- Updated dependencies [ef2831dde]
- Updated dependencies [1185919f3]
- Updated dependencies [475fc0aaa]
- Updated dependencies [b47dce06f]
- Updated dependencies [5a1d8dca3]
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-kubernetes-backend@0.2.0
  - @backstage/backend-common@0.3.1
  - @backstage/plugin-catalog-backend@0.2.2
  - @backstage/plugin-scaffolder-backend@0.3.2
  - example-app@0.2.3
  - @backstage/plugin-auth-backend@0.2.3
  - @backstage/plugin-techdocs-backend@0.2.2

## 0.2.2

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [f531d307c]
- Updated dependencies [3efd03c0e]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
- Updated dependencies [d33f5157c]
  - @backstage/backend-common@0.3.0
  - @backstage/plugin-app-backend@0.3.0
  - @backstage/plugin-catalog-backend@0.2.1
  - example-app@0.2.2
  - @backstage/plugin-scaffolder-backend@0.3.1
  - @backstage/plugin-auth-backend@0.2.2
  - @backstage/plugin-graphql-backend@0.1.3
  - @backstage/plugin-kubernetes-backend@0.1.3
  - @backstage/plugin-proxy-backend@0.2.1
  - @backstage/plugin-rollbar-backend@0.1.3
  - @backstage/plugin-sentry-backend@0.1.3
  - @backstage/plugin-techdocs-backend@0.2.1

## 0.2.1

### Patch Changes

- Updated dependencies [752808090]
- Updated dependencies [462876399]
- Updated dependencies [59166e5ec]
- Updated dependencies [33b7300eb]
  - @backstage/plugin-auth-backend@0.2.1
  - @backstage/plugin-scaffolder-backend@0.3.0
  - @backstage/backend-common@0.2.1
  - example-app@0.2.1

## 0.2.0

### Patch Changes

- 440a17b39: Bump @backstage/catalog-backend and pass the now required UrlReader interface to the plugin
- 6840a68df: Pass GitHub token into Scaffolder GitHub Preparer
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 7bbeb049f: Change loadBackendConfig to return the config directly
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [3e254503d]
- Updated dependencies [6d29605db]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [b4e5466e1]
- Updated dependencies [6f1768c0f]
- Updated dependencies [e37c0a005]
- Updated dependencies [3472c8be7]
- Updated dependencies [57d555eb2]
- Updated dependencies [61db1ddc6]
- Updated dependencies [81cb94379]
- Updated dependencies [1687b8fbb]
- Updated dependencies [a768a07fb]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [0c370c979]
- Updated dependencies [ce1f55398]
- Updated dependencies [e6b00e3af]
- Updated dependencies [9226c2aaa]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [99710b102]
- Updated dependencies [6579769df]
- Updated dependencies [002860e7a]
- Updated dependencies [5adfc005e]
- Updated dependencies [33454c0f2]
- Updated dependencies [183e2a30d]
- Updated dependencies [948052cbb]
- Updated dependencies [65d722455]
- Updated dependencies [b652bf2cc]
- Updated dependencies [4036ff59d]
- Updated dependencies [991a950e0]
- Updated dependencies [512d70973]
- Updated dependencies [8c2b76e45]
- Updated dependencies [8bdf0bcf5]
- Updated dependencies [c926765a2]
- Updated dependencies [5a920c6e4]
- Updated dependencies [2f62e1804]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [4c4eab81b]
- Updated dependencies [22ff8fba5]
- Updated dependencies [36a71d278]
- Updated dependencies [b3d57961c]
- Updated dependencies [6840a68df]
- Updated dependencies [a5cb46bac]
- Updated dependencies [49d70ccab]
- Updated dependencies [1c8c43756]
- Updated dependencies [26e69ab1a]
- Updated dependencies [5e4551e3a]
- Updated dependencies [e142a2767]
- Updated dependencies [e7f5471fd]
- Updated dependencies [e3d063ffa]
- Updated dependencies [440a17b39]
- Updated dependencies [7bbeb049f]
  - @backstage/plugin-app-backend@0.2.0
  - @backstage/plugin-auth-backend@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/plugin-scaffolder-backend@0.2.0
  - @backstage/plugin-techdocs-backend@0.2.0
  - @backstage/plugin-catalog-backend@0.2.0
  - @backstage/plugin-proxy-backend@0.2.0
  - @backstage/backend-common@0.2.0
  - example-app@0.2.0
  - @backstage/plugin-graphql-backend@0.1.2
  - @backstage/plugin-kubernetes-backend@0.1.2
  - @backstage/plugin-rollbar-backend@0.1.2
  - @backstage/plugin-sentry-backend@0.1.2
