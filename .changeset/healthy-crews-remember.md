---
'@backstage/create-app': patch
---

fix routing and config for user-settings plugin

To make the corresponding change in your local app, add the following in your App.tsx

```
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
...
<Route path="/settings" element={<SettingsRouter />} />
```

and the following to your plugins.ts:

```
export { plugin as UserSettings } from '@backstage/plugin-user-settings';
```
