# @backstage/plugin-events-backend

## 0.2.0-next.0

### Minor Changes

- cf41eedf43: **BREAKING:** Remove required field `router` at `HttpPostIngressEventPublisher.fromConfig`
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

### Patch Changes

- cf41eedf43: Introduce a new interface `RequestDetails` to abstract `Request`
  providing access to request body and headers.

  **BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.0

### Minor Changes

- dc9da28abd: Support events received via HTTP endpoints at plugin-events-backend.

  The plugin provides an event publisher `HttpPostIngressEventPublisher`
  which will allow you to receive events via
  HTTP endpoints `POST /api/events/http/{topic}`
  and will publish these to the used event broker.

  Using a provided custom validator, you can participate in the decision
  which events are accepted, e.g. by verifying the source of the request.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.

- 7bbd2403a1: Adds a new backend plugin plugin-events-backend for managing events.

  plugin-events-node exposes interfaces which can be used by modules.

  plugin-events-backend-test-utils provides utilities which can be used while writing tests e.g. for modules.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4
