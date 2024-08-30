---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Updated the type parameters for `ExtensionDefinition` and `ExtensionBlueprint` to only have a single object parameter. The base type parameter is exported as `ExtensionDefinitionParameters` and `ExtensionBlueprintParameters` respectively. This is shipped as an immediate breaking change as we expect usage of these types to be rare, and it does not affect the runtime behavior of the API.

This is a breaking change as it changes the type parameters. Existing usage can generally be updated as follows:

- `ExtensionDefinition<any>` -> `ExtensionDefinition`
- `ExtensionDefinition<any, any>` -> `ExtensionDefinition`
- `ExtensionDefinition<TConfig>` -> `ExtensionDefinition<{ config: TConfig }>`
- `ExtensionDefinition<TConfig, TConfigInput>` -> `ExtensionDefinition<{ config: TConfig, configInput: TConfigInput }>`

If you need to infer the parameter you can use `ExtensionDefinitionParameters`, for example:

```ts
import {
  ExtensionDefinition,
  ExtensionDefinitionParameters,
} from '@backstage/frontend-plugin-api';

function myUtility<T extends ExtensionDefinitionParameters>(
  ext: ExtensionDefinition<T>,
): T['config'] {
  // ...
}
```

The same patterns apply to `ExtensionBlueprint`.

This change is made to improve the readability of API references and ability to evolve the type parameters in the future.
