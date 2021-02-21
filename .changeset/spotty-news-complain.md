---
'@backstage/config': patch
---

Adds an optional type to `config.get` & `config.getOptional`. This avoids the need for casting. For example:

```ts
const config = useApi(configApiRef);

const myConfig = config.get<SomeTypeDefinition>('myPlugin.complexConfig');
// vs
const myConfig config.get('myPlugin.complexConfig') as SomeTypeDefinition;
```
