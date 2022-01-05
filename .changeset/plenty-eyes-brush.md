---
'@backstage/create-app': patch
---

Add permissions to create-app's PluginEnvironment

`CatalogEnvironment` now has a `permissions` field. This means that the environment parameter passed to `CatalogBuilder.create` in your Backstage backend needs to contain a `permissions` of type `ServerPermissionClient`. See the example backend's [`PluginEnvironment`](https://github.com/backstage/backstage/blob/ffdb98aa2973366d48ff1774a7f892bc0c926e7e/packages/backend/src/types.ts#L29) and how it's initialized [here])(https://github.com/backstage/backstage/blob/ffdb98aa2973366d48ff1774a7f892bc0c926e7e/packages/backend/src/index.ts#L68-L71).
