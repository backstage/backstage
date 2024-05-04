---
'@backstage/plugin-deployment-metadata-backend': minor
---

Introducing the `@backstage/plugin-deployment-metadata-backend` plugin! This plugin lets you get additional metadata about your deployment like the currently installed features. To install, you'll need to install both this plugin and the `@backstage/plugin-dynamic-discovery-backend` plugin like so,

```ts
backend.add(import('@backstage/plugin-dynamic-discovery-backend/service'));
backend.add(import('@backstage/plugin-dynamic-discovery-backend/plugin'));
backend.add(import('@backstage/plugin-deployment-metadata-backend/service'));
backend.add(import('@backstage/plugin-deployment-metadata-backend/plugin'));
```
