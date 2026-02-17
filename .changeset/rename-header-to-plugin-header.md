---
'@backstage/ui': minor
---

**BREAKING**: Renamed the `Header` component to `PluginHeader` for clarity.

The following exports have been renamed:

- `Header` → `PluginHeader`
- `HeaderProps` → `PluginHeaderProps`
- `HeaderDefinition` → `PluginHeaderDefinition`

The `HeaderTab` type is unchanged as it is shared with `HeaderPage`.

CSS class names have been updated from `bui-Header*` to `bui-PluginHeader*`.

**Migration:**

```diff
-import { Header, HeaderDefinition } from '@backstage/ui';
+import { PluginHeader, PluginHeaderDefinition } from '@backstage/ui';

-<Header title="My plugin" />
+<PluginHeader title="My plugin" />
```

**Affected components:** plugin-header
