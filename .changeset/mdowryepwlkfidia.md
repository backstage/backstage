---
'@backstage/frontend-plugin-api': minor
---

Removed the `ResolvedExtensionInput` and `ExtensionDataRefToValue` helper types from the public API surface to reduce top-level API clutter. These types were internal plumbing that are not needed by plugin authors. If you were relying on `ResolvedExtensionInput`, use the `ResolvedExtensionInputs` type instead, which maps a full set of inputs. If you were using `ExtensionDataRefToValue`, replace it with `ExtensionDataValue` combined with inferred types from your `ExtensionDataRef`.
