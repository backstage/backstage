# @backstage/config-loader

## 1.9.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/cli-common@0.1.15

## 1.9.5-next.0

### Patch Changes

- 8ecf8cb: Exclude `@backstage/backend-common` from schema collection if `@backstage/backend-defaults` is present
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/types@1.2.0

## 1.9.3

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/errors@1.2.6
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0

## 1.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0

## 1.9.3-next.0

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0

## 1.9.2

### Patch Changes

- c5e39e7: Internal refactor to use the deferred from the types package
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.5

## 1.9.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.15-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.1

### Patch Changes

- ef3c507: Updated dependency `typescript-json-schema` to `^0.65.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.1-next.0

### Patch Changes

- ef3c507: Updated dependency `typescript-json-schema` to `^0.65.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.0

### Minor Changes

- 274428f: Add configuration key to File and Remote `ConfigSource`s that enables configuration of parsing logic. Previously limited to yaml, these `ConfigSource`s now allow for a multitude of parsing options (e.g. JSON).

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 1edd6c2: The `env` option of `ConfigSources.default` now correctly allows undefined members.
- 493feac: Add boolean `allowMissingDefaultConfig` option to `ConfigSources.default` and
  `ConfigSources.defaultForTargets`, which results in omission of a ConfigSource
  for the default app-config.yaml configuration file if it's not present.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.0-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.0-next.1

### Minor Changes

- 274428f: Add configuration key to File and Remote `ConfigSource`s that enables configuration of parsing logic. Previously limited to yaml, these `ConfigSource`s now allow for a multitude of parsing options (e.g. JSON).

### Patch Changes

- 1edd6c2: The `env` option of `ConfigSources.default` now correctly allows undefined members.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.8.2-next.0

### Patch Changes

- 493feac: Add boolean `allowMissingDefaultConfig` option to `ConfigSources.default` and
  `ConfigSources.defaultForTargets`, which results in omission of a ConfigSource
  for the default app-config.yaml configuration file if it's not present.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.8.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.8.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.14-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.8.0

### Minor Changes

- 2ce31b3: The default environment variable substitution function will now trim whitespace characters from the substituted value. This alleviates bugs where whitespace characters are mistakenly included in environment variables.

  If you depend on the old behavior, you can override the default substitution function with your own, for example:

  ```ts
  ConfigSources.default({
    substitutionFunc: async name => process.env[name],
  });
  ```

- 99bab65: Support parameter substitution for environment variables

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.8.0-next.0

### Minor Changes

- 99bab65: Support parameter substitution for environment variables

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.7.0

### Minor Changes

- db8358d: Forward `null` values read from configuration files in configuration data, rather than treating them as an absence of config.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 1.7.0-next.1

### Minor Changes

- db8358d: Forward `null` values read from configuration files in configuration data, rather than treating them as an absence of config.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 1.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/types@1.1.1

## 1.6.2

### Patch Changes

- 0a9a03c: Make schema processing gracefully handle an empty config.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- bf3da16: Updated dependency `typescript-json-schema` to `^0.63.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.2-next.0

### Patch Changes

- 0a9a03c: Make schema processing gracefully handle an empty config.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.1

### Patch Changes

- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.1-next.0

### Patch Changes

- 7acbb5a: Removed `mock-fs` dev dependency.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.0

### Minor Changes

- 24f5a85: Add "path" to `TransformFunc` context

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.0-next.0

### Minor Changes

- 24f5a85: Add "path" to `TransformFunc` context

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.5.3

### Patch Changes

- 22ca64f117: Correctly resolve config targets into absolute paths
- 087bab5b42: Updated dependency `typescript-json-schema` to `^0.62.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.5.2-next.0

### Patch Changes

- 22ca64f117: Correctly resolve config targets into absolute paths
- Updated dependencies
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.5.1

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 30c553c1d2: Updated dependency `typescript-json-schema` to `^0.61.0`.
- 773ea341d2: The `FileConfigSource` will now retry file reading after a short delay if it reads an empty file. This is to avoid flakiness during watch mode where change events can trigger before the file content has been written.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.5.1-next.1

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 30c553c1d2: Updated dependency `typescript-json-schema` to `^0.61.0`.
- a4617c422a: Added `watch` option to configuration loaders that can be used to disable file watching by setting it to `false`.
- Updated dependencies
  - @backstage/errors@1.2.3-next.0
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 1.5.1-next.0

### Patch Changes

- 773ea341d2: The `FileConfigSource` will now retry file reading after a short delay if it reads an empty file. This is to avoid flakiness during watch mode where change events can trigger before the file content has been written.
- Updated dependencies
  - @backstage/cli-common@0.1.13-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 1.5.0

### Minor Changes

- 9606ba0939e6: Deep visibility now also applies to values that are not covered by the configuration schema.

  For example, given the following configuration schema:

  ```ts
  // plugins/a/config.schema.ts
  export interface Config {
    /** @deepVisibility frontend */
    a?: unknown;
  }

  // plugins/a/config.schema.ts
  export interface Config {
    a?: {
      b?: string;
    };
  }
  ```

  All values under `a` are now visible to the frontend, while previously only `a` and `a/b` would've been visible.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- f9657b891b00: Do not unnecessarily notify subscribers when no-op updates to config happen
- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/cli-common@0.1.12

## 1.5.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/cli-common@0.1.12

## 1.5.0-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.5.0-next.0

### Minor Changes

- 9606ba0939e6: Deep visibility now also applies to values that are not covered by the configuration schema.

  For example, given the following configuration schema:

  ```ts
  // plugins/a/config.schema.ts
  export interface Config {
    /** @deepVisibility frontend */
    a?: unknown;
  }

  // plugins/a/config.schema.ts
  export interface Config {
    a?: {
      b?: string;
    };
  }
  ```

  All values under `a` are now visible to the frontend, while previously only `a` and `a/b` would've been visible.

### Patch Changes

- f9657b891b00: Do not unnecessarily notify subscribers when no-op updates to config happen
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.4.0

### Minor Changes

- 2f1859585998: Loading invalid TypeScript configuration schemas will now throw an error rather than silently being ignored.

  In particular this includes defining any additional types other than `Config` in the schema file, or use of unsupported types such as `Record` or `Partial`.

- cd514545d1d0: Adds a new `deepVisibility` schema keyword that sets child visibility recursively to the defined value, respecting preexisting values or child `deepVisibility`.

  Example usage:

  ```ts
  export interface Config {
    /**
     * Enforces a default of `secret` instead of `backend` for this object.
     * @deepVisibility secret
     */
    mySecretProperty: {
      type: 'object';
      properties: {
        secretValue: {
          type: 'string';
        };

        verySecretProperty: {
          type: 'string';
        };
      };
    };
  }
  ```

  Example of a schema that would not be allowed:

  ```ts
  export interface Config {
    /**
     * Set the top level property to secret, enforcing a default of `secret` instead of `backend` for this object.
     * @deepVisibility secret
     */
    mySecretProperty: {
      type: 'object';
      properties: {
        frontendUrl: {
          /**
           * We can NOT override the visibility to reveal a property to the front end.
           * @visibility frontend
           */
          type: 'string';
        };

        verySecretProperty: {
          type: 'string';
        };
      };
    };
  }
  ```

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.4.0-next.1

### Minor Changes

- 2f1859585998: Loading invalid TypeScript configuration schemas will now throw an error rather than silently being ignored.

  In particular this includes defining any additional types other than `Config` in the schema file, or use of unsupported types such as `Record` or `Partial`.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.4.0-next.0

### Minor Changes

- cd514545d1d0: Adds a new `deepVisibility` schema keyword that sets child visibility recursively to the defined value, respecting preexisting values or child `deepVisibility`.

  Example usage:

  ```ts
  export interface Config {
    /**
     * Enforces a default of `secret` instead of `backend` for this object.
     * @deepVisibility secret
     */
    mySecretProperty: {
      type: 'object';
      properties: {
        secretValue: {
          type: 'string';
        };

        verySecretProperty: {
          type: 'string';
        };
      };
    };
  }
  ```

  Example of a schema that would not be allowed:

  ```ts
  export interface Config {
    /**
     * Set the top level property to secret, enforcing a default of `secret` instead of `backend` for this object.
     * @deepVisibility secret
     */
    mySecretProperty: {
      type: 'object';
      properties: {
        frontendUrl: {
          /**
           * We can NOT override the visibility to reveal a property to the front end.
           * @visibility frontend
           */
          type: 'string';
        };

        verySecretProperty: {
          type: 'string';
        };
      };
    };
  }
  ```

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 1.3.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 1.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 1.3.1

### Patch Changes

- f25427f665f7: Fix a bug where config items with `/` in the key were incorrectly handled.
- a5c5491ff50c: Use `durationToMilliseconds` from `@backstage/types` instead of our own
- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/errors@1.2.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.3.1-next.0

### Patch Changes

- f25427f665f7: Fix a bug where config items with `/` in the key were incorrectly handled.
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.3.0

### Minor Changes

- 201206132da: Introduced a new config source system to replace `loadConfig`. There is a new `ConfigSource` interface along with utilities provided by `ConfigSources`, as well as a number of built-in configuration source implementations. The new system is more flexible and makes it easier to create new and reusable sources of configuration, such as loading configuration from secret providers.

  The following is an example of how to load configuration using the default behavior:

  ```ts
  const source = ConfigSources.default({
    argv: options?.argv,
    remote: options?.remote,
  });
  const config = await ConfigSources.toConfig(source);
  ```

  The `ConfigSource` interface looks like this:

  ```ts
  export interface ConfigSource {
    readConfigData(options?: ReadConfigDataOptions): AsyncConfigSourceIterator;
  }
  ```

  It is best implemented using an async iterator:

  ```ts
  class MyConfigSource implements ConfigSource {
    async *readConfigData() {
      yield {
        config: [
          {
            context: 'example',
            data: { backend: { baseUrl: 'http://localhost' } },
          },
        ],
      };
    }
  }
  ```

### Patch Changes

- 7c116bcac7f: Fixed the way that some request errors are thrown
- 473db605a4f: Added a new `noUndeclaredProperties` option to `SchemaLoader` to support enforcing that there are no extra keys when verifying config.
- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.3.0-next.0

### Minor Changes

- 201206132da: Introduced a new config source system to replace `loadConfig`. There is a new `ConfigSource` interface along with utilities provided by `ConfigSources`, as well as a number of built-in configuration source implementations. The new system is more flexible and makes it easier to create new and reusable sources of configuration, such as loading configuration from secret providers.

  The following is an example of how to load configuration using the default behavior:

  ```ts
  const source = ConfigSources.default({
    argv: options?.argv,
    remote: options?.remote,
  });
  const config = await ConfigSources.toConfig(source);
  ```

  The `ConfigSource` interface looks like this:

  ```ts
  export interface ConfigSource {
    readConfigData(options?: ReadConfigDataOptions): AsyncConfigSourceIterator;
  }
  ```

  It is best implemented using an async iterator:

  ```ts
  class MyConfigSource implements ConfigSource {
    async *readConfigData() {
      yield {
        config: [
          {
            context: 'example',
            data: { backend: { baseUrl: 'http://localhost' } },
          },
        ],
      };
    }
  }
  ```

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.2.0

### Minor Changes

- c791fcd96b9: Configuration validation is now more permissive when it comes to config whose values are `string` but whose schemas declare them to be `boolean` or `number`.

  For example, configuration was previously marked invalid when a string `'true'` was set on a property expecting type `boolean` or a string `'146'` was set on a property expecting type `number` (as when providing configuration via variable substitution sourced from environment variables). Now, such configurations will be considered valid and their values will be coerced to the right type at read-time.

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.1.9

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/errors@1.1.5
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.1.9-next.0

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 482dae5de1c: Updated link to docs.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/cli-common@0.1.12-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2

## 1.1.8

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 1.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 1.1.7

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 40e7e6e1a2: Updated dependency `typescript-json-schema` to `^0.55.0`.
- Updated dependencies
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/cli-common@0.1.11
  - @backstage/config@1.0.5

## 1.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.11-next.0
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 1.1.7-next.1

### Patch Changes

- 40e7e6e1a2: Updated dependency `typescript-json-schema` to `^0.55.0`.
- Updated dependencies
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/cli-common@0.1.10
  - @backstage/errors@1.1.4-next.1

## 1.1.7-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/types@1.0.2-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 1.1.6

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 1.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1-next.0
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 1.1.5

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/types@1.0.0

## 1.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/types@1.0.0

## 1.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/types@1.0.0

## 1.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/types@1.0.0

## 1.1.4

### Patch Changes

- 5ecca7e44b: No longer log when reloading remote config.
- 7d47def9c4: Removed dependency on `@types/jest`.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/cli-common@0.1.10
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 1.1.4-next.2

### Patch Changes

- 5ecca7e44b: No longer log when reloading remote config.
- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/cli-common@0.1.10-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0

## 1.1.4-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.

## 1.1.4-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.

## 1.1.3

### Patch Changes

- bcada7cd9f: From now on the `$file` placeholder will trim the whitespaces and newline characters from the end of the file it reads.
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- a3acec8819: Updated dependency `typescript-json-schema` to `^0.54.0`.
- Updated dependencies
  - @backstage/errors@1.1.0

## 1.1.3-next.1

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- a3acec8819: Updated dependency `typescript-json-schema` to `^0.54.0`.

## 1.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.0-next.0

## 1.1.2

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 1.1.2-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 1.1.1

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 9e8ef53498: Handle empty config files gracefully
- Updated dependencies
  - @backstage/cli-common@0.1.9
  - @backstage/config@1.0.1

## 1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.1.9-next.0
  - @backstage/config@1.0.1-next.0

## 1.1.1-next.0

### Patch Changes

- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- 9e8ef53498: Handle empty config files gracefully

## 1.1.0

### Minor Changes

- 19f6c6c32a: Added `ignoreSchemaErrors` to `schema.process`.

### Patch Changes

- e0a51384ac: build(deps): bump `ajv` from 7.0.3 to 8.10.0
- 230ad0826f: Bump to using `@types/node` v16
- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.

## 1.1.0-next.1

### Minor Changes

- 19f6c6c32a: Added `ignoreSchemaErrors` to `schema.process`.

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16

## 1.0.1-next.0

### Patch Changes

- e0a51384ac: build(deps): bump `ajv` from 7.0.3 to 8.10.0
- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- 664821371e: The `typescript-json-schema` dependency that is used during schema collection is now lazy loaded, as it eagerly loads in the TypeScript compiler.
- f910c2a3f8: build(deps): bump `typescript-json-schema` from 0.52.0 to 0.53.0
- Updated dependencies
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.9.7

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1

## 0.9.7-next.0

### Patch Changes

- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1

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
