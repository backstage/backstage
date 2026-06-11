---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Added `ExtensionPredicateContextProviderBlueprint` for declaring predicate context providers that populate custom values in the extension predicate context. This enables gating extension display on arbitrary values loaded asynchronously. Each provider's output is namespaced by its extension ID, and provider failures are isolated so the app still boots.
