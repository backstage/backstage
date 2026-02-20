---
'@backstage/core-plugin-api': patch
'@backstage/core-app-api': patch
---

Add optional `description` field to plugin-level feature flags.

Plugin developers can now provide an optional description for their feature flags:

```ts
export const myPlugin = createPlugin({
  id: 'my-plugin',
  featureFlags: [
    {
      name: 'show-beta-feature',
      description: 'Enables the new beta dashboard view',
    },
  ],
});

If no description is provided, the default "Registered in {pluginId} plugin" message is shown.

```
