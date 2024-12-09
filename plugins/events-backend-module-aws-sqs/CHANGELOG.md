# @backstage/plugin-events-backend-module-aws-sqs

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/plugin-events-node@0.4.6-next.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0

## 0.4.5

### Patch Changes

- d52d7f9: Support ISO and ms string forms of durations in config too
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/types@1.2.0
  - @backstage/backend-plugin-api@1.0.2

## 0.4.5-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.4-next.1

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.3

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/plugin-events-node@0.4.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## 0.4.3-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.2

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.2

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.0-next.1

## 0.4.2-next.0

### Patch Changes

- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.4.0

### Minor Changes

- fc24d9e: Stop using `@backstage/backend-tasks` as it will be deleted in near future.

### Patch Changes

- ba8571e: Setup user agent header for AWS sdk clients, this enables users to better track API calls made from Backstage to AWS APIs through things like CloudTrail.
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9

## 0.3.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/backend-tasks@0.5.28-next.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9-next.3

## 0.3.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/backend-tasks@0.5.28-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/backend-tasks@0.5.28-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9-next.1

## 0.3.9-next.0

### Patch Changes

- ba8571e: Setup user agent header for AWS sdk clients, this enables users to better track API calls made from Backstage to AWS APIs through things like CloudTrail.
- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/backend-tasks@0.5.28-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.9-next.0

## 0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/backend-tasks@0.5.27
  - @backstage/plugin-events-node@0.3.8
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/backend-tasks@0.5.27-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.8-next.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/backend-tasks@0.5.26-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.5

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/backend-tasks@0.5.24
  - @backstage/plugin-events-node@0.3.5
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.5-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-tasks@0.5.24-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/backend-tasks@0.5.24-next.2
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.1
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-events-node@0.3.5-next.0

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.24-next.0
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/backend-tasks@0.5.23
  - @backstage/plugin-events-node@0.3.4

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-tasks@0.5.23-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/backend-tasks@0.5.23-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.4-next.0

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/backend-tasks@0.5.22
  - @backstage/plugin-events-node@0.3.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/backend-tasks@0.5.22-next.1
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/backend-tasks@0.5.22-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.3-next.0

## 0.3.2

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/backend-tasks@0.5.21
  - @backstage/plugin-events-node@0.3.2
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.1

### Patch Changes

- 81a995f: Updated dependency `aws-sdk-client-mock` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/backend-tasks@0.5.20
  - @backstage/plugin-events-node@0.3.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 0.3.0

### Minor Changes

- 132d672: BREAKING CHANGE: Migrate `AwsSqsConsumingEventPublisher` and its backend module to use `EventsService`.

  Uses the `EventsService` instead of `EventBroker` at `AwsSqsConsumingEventPublisher`,
  dropping the use of `EventPublisher` including `setEventBroker(..)`.

  Now, `AwsSqsConsumingEventPublisher.fromConfig` requires `events: EventsService` as option.

  ```diff
    const sqs = AwsSqsConsumingEventPublisher.fromConfig({
      config: env.config,
  +   events: env.events,
      logger: env.logger,
      scheduler: env.scheduler,
    });
  + await Promise.all(sqs.map(publisher => publisher.start()));

    // e.g. at packages/backend/src/plugins/events.ts
  - await new EventsBackend(env.logger)
  -   .setEventBroker(env.eventBroker)
  -   .addPublishers(sqs)
  -   .start();

    // or for other kinds of setups
  - await Promise.all(sqs.map(publisher => publisher.setEventBroker(eventBroker)));
  ```

  `eventsModuleAwsSqsConsumingEventPublisher` uses the `eventsServiceRef` as dependency,
  instead of `eventsExtensionPoint`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/config@1.2.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/backend-tasks@0.5.19
  - @backstage/types@1.1.1

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/backend-tasks@0.5.19-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.2

## 0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.3.0-next.0

### Minor Changes

- 132d672: BREAKING CHANGE: Migrate `AwsSqsConsumingEventPublisher` and its backend module to use `EventsService`.

  Uses the `EventsService` instead of `EventBroker` at `AwsSqsConsumingEventPublisher`,
  dropping the use of `EventPublisher` including `setEventBroker(..)`.

  Now, `AwsSqsConsumingEventPublisher.fromConfig` requires `events: EventsService` as option.

  ```diff
    const sqs = AwsSqsConsumingEventPublisher.fromConfig({
      config: env.config,
  +   events: env.events,
      logger: env.logger,
      scheduler: env.scheduler,
    });
  + await Promise.all(sqs.map(publisher => publisher.start()));

    // e.g. at packages/backend/src/plugins/events.ts
  - await new EventsBackend(env.logger)
  -   .setEventBroker(env.eventBroker)
  -   .addPublishers(sqs)
  -   .start();

    // or for other kinds of setups
  - await Promise.all(sqs.map(publisher => publisher.setEventBroker(eventBroker)));
  ```

  `eventsModuleAwsSqsConsumingEventPublisher` uses the `eventsServiceRef` as dependency,
  instead of `eventsExtensionPoint`.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/backend-tasks@0.5.18-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.2.13

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/backend-tasks@0.5.15
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19

## 0.2.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/backend-tasks@0.5.15-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.2.13-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/backend-tasks@0.5.15-next.2
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/backend-tasks@0.5.15-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19-next.1

## 0.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/backend-tasks@0.5.15-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.19-next.0

## 0.2.12

### Patch Changes

- 7b8e551: Fix errors when deleting SQS messages:

  - If zero messages were received, skip deletion to avoid `EmptyBatchRequest` error from the SQS client.
  - If zero failures were returned from the SQS client during deletion, skip error logging.

- d5ddc4e: Add documentation on how to install the plugins with the new backend system.
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/backend-tasks@0.5.14
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.18

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-events-node@0.2.18-next.2
  - @backstage/backend-tasks@0.5.14-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/backend-tasks@0.5.14-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.18-next.1

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/backend-tasks@0.5.14-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.18-next.0

## 0.2.11

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/backend-tasks@0.5.13
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17

## 0.2.11-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/backend-tasks@0.5.13-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.3

## 0.2.11-next.2

### Patch Changes

- cc4228e: Switched module ID to use kebab-case.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/backend-tasks@0.5.13-next.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.2

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/backend-tasks@0.5.13-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.0

## 0.2.10

### Patch Changes

- 3d043526f4: Updated dependency `aws-sdk-client-mock` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/backend-tasks@0.5.12
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.16

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/backend-tasks@0.5.12-next.2
  - @backstage/plugin-events-node@0.2.16-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/backend-tasks@0.5.12-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.16-next.1

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/backend-tasks@0.5.12-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.16-next.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.11
  - @backstage/backend-common@0.19.8
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.15

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/backend-tasks@0.5.11-next.2
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.15-next.2

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.10-next.1
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.14-next.1

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/config@1.1.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/backend-tasks@0.5.10-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.14-next.0

## 0.2.6

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/backend-tasks@0.5.8
  - @backstage/backend-common@0.19.5
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3
  - @backstage/plugin-events-node@0.2.12

## 0.2.6-next.3

### Patch Changes

- 71114ac50e02: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/backend-tasks@0.5.8-next.3
  - @backstage/plugin-events-node@0.2.12-next.3

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/backend-tasks@0.5.8-next.2
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.12-next.2

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/backend-tasks@0.5.8-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/plugin-events-node@0.2.12-next.1
  - @backstage/types@1.1.0

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-tasks@0.5.7-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.11-next.0

## 0.2.3

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-events-node@0.2.9
  - @backstage/backend-tasks@0.5.5
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-tasks@0.5.5-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-events-node@0.2.9-next.2

## 0.2.3-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- 4b82382ed8c2: Fixed invalid configuration schema. The configuration schema may be more strict as a result.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-events-node@0.2.9-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/backend-tasks@0.5.5-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/backend-tasks@0.5.5-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.9-next.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/backend-tasks@0.5.4
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.8

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/backend-tasks@0.5.4-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-events-node@0.2.8-next.0

## 0.2.1

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/backend-tasks@0.5.3
  - @backstage/config@1.0.8
  - @backstage/plugin-events-node@0.2.7

## 0.2.1-next.2

### Patch Changes

- 5f2c38c70f5b: Fix SNYK-JS-FASTXMLPARSER-5668858 (`fast-xml-parser`) by upgrading aws-sdk to at least the current latest version.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/backend-tasks@0.5.3-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.7-next.2

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/backend-tasks@0.5.3-next.1
  - @backstage/plugin-events-node@0.2.7-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.7-next.0

## 0.2.0

### Minor Changes

- 2c5661f3899: Allow endpoint configuration for sqs, enabling use of localstack for testing.

### Patch Changes

- 3659c71c5d9: Standardize `@aws-sdk` v3 versions
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.6

## 0.2.0-next.2

### Minor Changes

- 2c5661f3899: Allow endpoint configuration for sqs, enabling use of localstack for testing.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-events-node@0.2.6-next.1

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.6-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.5-next.0

## 0.1.5

### Patch Changes

- a5de745ac17: Renamed `awsSqsConsumingEventPublisherEventsModule` to `eventsModuleAwsSqsConsumingEventPublisher` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/plugin-events-node@0.2.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-events-node@0.2.4-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.4-next.1

## 0.1.5-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/plugin-events-node@0.2.4-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/plugin-events-node@0.2.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-events-node@0.2.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-events-node@0.2.3-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
  - @backstage/plugin-events-node@0.2.3-next.0

## 0.1.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/config@1.0.6
  - @backstage/plugin-events-node@0.2.1
  - @backstage/types@1.0.2

## 0.1.2-next.1

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/types@1.0.2

## 0.1.1

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- dd008a10c1: Upgrade to AWS SDK for Javascript v3
- Updated dependencies
  - @backstage/backend-tasks@0.4.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.1.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.1.1-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.1.1-next.1

### Patch Changes

- dd008a10c1: Upgrade to AWS SDK for Javascript v3
- Updated dependencies
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.0-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/config@1.0.5-next.0

## 0.1.0

### Minor Changes

- d3ecb2382d: Adds a new module `aws-sqs` for plugin-events-backend.

  The module provides an event publisher `AwsSqsConsumingEventPublisher`
  which will allow you to receive events from
  an AWS SQS queue and will publish these to the used event broker.

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.7
  - @backstage/plugin-events-node@0.1.0
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/config@1.0.4
