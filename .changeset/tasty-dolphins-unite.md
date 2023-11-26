---
'@backstage/frontend-plugin-api': minor
---

Extension inputs are now wrapped into an additional object when passed to the extension factory, with the previous values being available at the `output` property. The `ExtensionInputValues` type has also been replaced by `ResolvedExtensionInputs`.
