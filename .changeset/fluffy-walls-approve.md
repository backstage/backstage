---
'@backstage/plugin-events-backend': minor
---

**BREAKING:** Remove required field `router` at `HttpPostIngressEventPublisher.fromConfig`
and replace it with `bind(router: Router)`.
Additionally, the path prefix `/http` will be added inside `HttpPostIngressEventPublisher`.

```diff
// at packages/backend/src/plugins/events.ts
   const eventsRouter = Router();
-  const httpRouter = Router();
-  eventsRouter.use('/http', httpRouter);

   const http = HttpPostIngressEventPublisher.fromConfig({
     config: env.config,
     logger: env.logger,
-    router: httpRouter,
   });
+  http.bind(eventsRouter);
```
