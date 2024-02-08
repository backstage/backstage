---
'@backstage/plugin-tech-insights-backend-module-jsonfc': patch
---

Add support for the new backend system.

A new backend module for the tech-insights backend
was added and exported as `default`.

The module will register the `JsonRulesEngineFactCheckerFactory`
as `FactCheckerFactory`, loading checks from the config.

You can use it with the new backend system like

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-tech-insights-backend-module-jsonfc'));
```
