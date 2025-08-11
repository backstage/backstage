---
'@backstage/plugin-app': minor
---

**BREAKING**: The `componentsApi` implementation has been removed from the plugin and replaced with the new `SwappableComponentsApi` instead.

If you were overriding the `componentsApi` implementation, you can now use the new `SwappableComponentsApi` instead.

```ts
// old
appPlugin.getExtension('api:app/components').override(...)

// new
appPlugin.getExtension('api:app/swappable-components').override(...)
```
