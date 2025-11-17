---
'@backstage/frontend-plugin-api': minor
---

Renamed `ExtensionDefinition` to `OverridableExtensionDefinition` and introduced a slimmer `ExtensionDefinition` type that does not include override methods. The overridable type is generally used as an output type, while plain `ExtensionDefinition`s are used for input. This reduces type conflicts across different of `@backstage/frontend-plugin-api`, improving long-term compatibility.
