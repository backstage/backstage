# @backstage/plugin-events-node

## 0.2.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3

## 0.2.12-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.3

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.3-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.2-next.0

## 0.2.9

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2

## 0.2.9-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.5-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4-next.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.2

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1

## 0.2.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.2

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.0

## 0.2.4

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.0

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.1

## 0.2.4-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0

## 0.2.3

### Patch Changes

- 19d4abf72c: Make `EventParams` typed for implementing tidier event handling.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0

## 0.2.3-next.2

### Patch Changes

- 19d4abf72c: Make `EventParams` typed for implementing tidier event handling.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0

## 0.2.0

### Minor Changes

- cf41eedf43: Introduce a new interface `RequestDetails` to abstract `Request`
  providing access to request body and headers.

  **BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.3

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5-next.1

## 0.2.0-next.0

### Minor Changes

- cf41eedf43: Introduce a new interface `RequestDetails` to abstract `Request`
  providing access to request body and headers.

  **BREAKING:** Replace `request: Request` with `request: RequestDetails` at `RequestValidator`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5-next.0

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
  - @backstage/backend-plugin-api@0.1.4
