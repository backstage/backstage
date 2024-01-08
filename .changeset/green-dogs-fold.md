---
'@backstage/plugin-tech-insights-backend': patch
'@backstage/plugin-tech-insights-node': patch
---

Add support for the new backend system.

A new backend plugin for the tech-insights backend
was added and exported as `default`.

You can use it with the new backend system like

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-tech-insights-backend'));
```
