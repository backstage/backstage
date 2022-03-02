# @backstage/config-loader

## 0.9.6

### Patch Changes

- c3a1300f79: Include any files included in configuration via $include or $file directives when watching for configuration changes.

## 0.9.5

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/cli-common@0.1.8
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/types@0.1.3

## 0.9.4

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/errors@0.2.1
  - @backstage/cli-common@0.1.7
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.9.3

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- Updated dependencies
  - @backstage/config@0.1.13

## 0.9.3-next.0

### Patch Changes

- f685e1398f: Loading of app configurations now reference the `@deprecated` construct from
  JSDoc to determine if a property in-use has been deprecated. Users are notified
  of deprecated keys in the format:

  ```txt
  The configuration key 'catalog.processors.githubOrg' of app-config.yaml is deprecated and may be removed soon. Configure a GitHub integration instead.
  ```

  When the `withDeprecatedKeys` option is set to `true` in the `process` method
  of `loadConfigSchema`, the user will be notified that deprecated keys have been
  identified in their app configuration.

  The `backend-common` and `plugin-app-backend` packages have been updated to set
  `withDeprecatedKeys` to true so that users are notified of deprecated settings
  by default.

- Updated dependencies
  - @backstage/config@0.1.13-next.0

## 0.9.2

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/errors@0.2.0

## 0.9.1

### Patch Changes

- 84663d59a3: Bump `typescript-json-schema` from `^0.51.0` to `^0.52.0`.

## 0.9.0

### Minor Changes

- f6722d2458: Removed deprecated option `env` from `LoadConfigOptions` and associated tests
- 67d6cb3c7e: Removed deprecated option `configPaths` as it has been superseded by `configTargets`

### Patch Changes

- 1e7070443d: In case remote.reloadIntervalSeconds is passed, it must be a valid positive value

## 0.8.1

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- 4bea7b81d3: Uses key visibility as fallback in non-object arrays

## 0.8.0

### Minor Changes

- 1e99c73c75: Update `loadConfig` to return `LoadConfigResult` instead of an array of `AppConfig`.

  This function is primarily used internally by other config loaders like `loadBackendConfig` which means no changes are required for most users.

  If you use `loadConfig` directly you will need to update your usage from:

  ```diff
  - const appConfigs = await loadConfig(options)
  + const { appConfigs } = await loadConfig(options)
  ```

### Patch Changes

- 8809b6c0dd: Update the json-schema dependency version.
- Updated dependencies
  - @backstage/cli-common@0.1.6

## 0.7.2

### Patch Changes

- 0611f3b3e2: Reading app config from a remote server
- 26c5659c97: Bump msw to the same version as the rest

## 0.7.1

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- ea21f7f567: bump `typescript-json-schema` from 0.50.1 to 0.51.0
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/cli-common@0.1.5
  - @backstage/errors@0.1.4

## 0.7.0

### Minor Changes

- 7e97d0b8c1: Removed the `EnvFunc` public export. Its only usage was to be passed in to `LoadConfigOptions.experimentalEnvFunc`. If you were using this type, add a definition in your own project instead with the signature `(name: string) => Promise<string | undefined>`.

### Patch Changes

- 223e8de6b4: Configuration schema errors are now filtered using the provided visibility option. This means that schema errors due to missing backend configuration will no longer break frontend builds.
- 7e97d0b8c1: Add public tags and documentation
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/errors@0.1.3

## 0.6.10

### Patch Changes

- 957e4b3351: Updated dependencies
- Updated dependencies
  - @backstage/cli-common@0.1.4

## 0.6.9

### Patch Changes

- ee7a1a4b64: Add option to collect configuration schemas from explicit package paths in addition to by package name.
- e68bd978e2: Allow collection of configuration schemas from multiple versions of the same package.

## 0.6.8

### Patch Changes

- d1da88a19: Properly export all used types.
- Updated dependencies
  - @backstage/cli-common@0.1.3
  - @backstage/config@0.1.9

## 0.6.7

### Patch Changes

- 0ade9d02b: Include `devDependencies` and `optionalDependencies` in the detection of Backstage packages when collecting configuration schema.
- 9b8cec063: Add support for config file watching through a new group of `watch` options to `loadConfig`.
- Updated dependencies
  - @backstage/config@0.1.7

## 0.6.6

### Patch Changes

- e9d3983ee: Add option to populate the `filteredKeys` property when processing configuration with a schema.
- Updated dependencies
  - @backstage/config@0.1.6

## 0.6.5

### Patch Changes

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.

## 0.6.4

### Patch Changes

- f00493739: Removed workaround for breaking change in typescript 4.3 and bump `typescript-json-schema` instead. This should again allow the usage of `@items.visibility <value>` to set the visibility of array items.

## 0.6.3

### Patch Changes

- 2cf98d279: Resolve the path to app-config.yaml from the current working directory. This will allow use of `yarn link` or running the CLI in other directories and improve the experience for local backstage development.
- 438a512eb: Fixed configuration schema parsing when using TypeScript `4.3`.

## 0.6.2

### Patch Changes

- 290405276: Updated dependencies

## 0.6.1

### Patch Changes

- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.
- Updated dependencies [d8b81fd28]
  - @backstage/config@0.1.5

## 0.6.0

### Minor Changes

- 82c66b8cd: Fix bug where `${...}` was not being escaped to `${...}`

  Add support for environment variable substitution in `$include`, `$file` and
  `$env` transform values.

  - This change allows for including dynamic paths, such as environment specific
    secrets by using the same environment variable substitution (`${..}`) already
    supported outside of the various include transforms.
  - If you are currently using the syntax `${...}` in your include transform values,
    you will need to escape the substitution by using `${...}` instead to maintain
    the same behavior.

## 0.5.1

### Patch Changes

- 062df71db: Bump `config-loader` to `ajv` 7, to enable v7 feature use elsewhere
- e9aab60c7: Each piece of the configuration schema is now validated upfront, in order to produce more informative errors.

## 0.5.0

### Minor Changes

- ef7957be4: Removed support for the deprecated `$data` placeholder.
- ef7957be4: Enable further processing of configuration files included using the `$include` placeholder. Meaning that for example for example `$env` includes will be processed as usual in included files.

### Patch Changes

- ef7957be4: Added support for environment variable substitutions in string configuration values using a `${VAR}` placeholder. All environment variables must be available, or the entire expression will be evaluated to `undefined`. To escape a substitution, use `${...}`, which will end up as `${...}`.

  For example:

  ```yaml
  app:
    baseUrl: https://${BASE_HOST}
  ```

## 0.4.1

### Patch Changes

- ad5c56fd9: Deprecate `$data` and replace it with `$include` which allows for any type of json value to be read from external files. In addition, `$include` can be used without a path, which causes the value at the root of the file to be loaded.

  Most usages of `$data` can be directly replaced with `$include`, except if the referenced value is not a string, in which case the value needs to be changed. For example:

  ```yaml
  # app-config.yaml
  foo:
    $data: foo.yaml#myValue # replacing with $include will turn the value into a number
    $data: bar.yaml#myValue # replacing with $include is safe

  # foo.yaml
  myValue: 0xf00

  # bar.yaml
  myValue: bar
  ```

## 0.4.0

### Minor Changes

- 4e7091759: Fix typo of "visibility" in config schema reference

  If you have defined a config element named `visiblity`, you
  will need to fix the spelling to `visibility`. For more info,
  see https://backstage.io/docs/conf/defining#visibility.

### Patch Changes

- b4488ddb0: Added a type alias for PositionError = GeolocationPositionError

## 0.3.0

### Minor Changes

- 1722cb53c: Added support for loading and validating configuration schemas, as well as declaring config visibility through schemas.

  The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

  A configuration schema is declared using the `https://backstage.io/schema/config-v1` JSON Schema meta schema, which is based on draft07. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, and `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

  Packages that wish to contribute configuration schema should declare it in a root `"configSchema"` field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be in either `.json` or `.d.ts` format.

  TypeScript configuration schema files should export a single `Config` type, for example:

  ```ts
  export interface Config {
    app: {
      /**
       * Frontend root URL
       * @visibility frontend
       */
      baseUrl: string;
    };
  }
  ```

## 0.2.0

### Minor Changes

- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- ce5512bc0: Added support for new shorthand when defining secrets, where `$env: ENV` can be used instead of `$secret: { env: ENV }` etc.
