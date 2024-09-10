---
'@backstage/plugin-user-settings-backend': minor
---

The plugin version that supports the new backend system has been moved from the `alpha` subpath to the `root` path. Here's how you import it now:

```diff
- backend.add(import('@backstage/plugin-user-settings-backend/alpha'));
+ backend.add(import('@backstage/plugin-user-settings-backend'));

