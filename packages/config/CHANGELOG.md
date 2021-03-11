# @backstage/config

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
