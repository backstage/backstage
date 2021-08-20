# @backstage/config

## 0.1.7

### Patch Changes

- 90f25476a: Extended the `Config` interface to have an optional `subscribe` method that can be used be notified of updates to the configuration.

## 0.1.6

### Patch Changes

- e9d3983ee: Add warning when trying to access configuration values that have been filtered out by visibility.

## 0.1.5

### Patch Changes

- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.

## 0.1.4

### Patch Changes

- 0434853a5: Reformulate the json types to break type recursion

## 0.1.3

### Patch Changes

- a1f5e6545: Adds an optional type to `config.get` & `config.getOptional`. This avoids the need for casting. For example:

  ```ts
  const config = useApi(configApiRef);

  const myConfig = config.get<SomeTypeDefinition>('myPlugin.complexConfig');
  // vs
  const myConfig config.get('myPlugin.complexConfig') as SomeTypeDefinition;
  ```

## 0.1.2

### Patch Changes

- e3bd9fc2f: Fix unneeded defensive code
- e3bd9fc2f: Fix useless conditional
