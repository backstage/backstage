---
'@backstage/plugin-catalog-backend-module-azure': minor
---

isCloud function now also checks if hostname endswith visualstudio.com along with dev.azure.com

```diff
- const isCloud = (host: string) => host === 'dev.azure.com';
+ const isCloud = (host: string) => host === 'dev.azure.com' || host.endsWith('visualstudio.com');
```
