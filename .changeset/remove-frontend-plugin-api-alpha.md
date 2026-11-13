---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the `/alpha` entry point. All of its exports are already available from `@backstage/frontend-plugin-api`; update imports to use the main entry point instead:

```diff
-import { PluginWrapperBlueprint } from '@backstage/frontend-plugin-api/alpha';
+import { PluginWrapperBlueprint } from '@backstage/frontend-plugin-api';
```

The exported APIs retain the same behavior and identity. For the deprecated `pluginWrapperApiRef`, prefer `coreApis.pluginWrapper` from the main entry point.
