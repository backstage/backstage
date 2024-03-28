---
'@backstage/plugin-catalog-backend': patch
---

Make entity collection errors a little quieter in the logs.

Instead of logging a warning line when an entity has an error
during processing, it will now instead emit an event on the event
broker.

This only removes a single log line, however it is possible to
add the log line back if it is required by subscribing to the
`CATALOG_ERRORS_TOPIC` as shown below.

```typescript
env.eventBroker.subscribe({
  supportsEventTopics(): string[] {
    return [CATALOG_ERRORS_TOPIC];
  },

  async onEvent(
    params: EventParams<{
      entity: string;
      location?: string;
      errors: Array<Error>;
    }>,
  ): Promise<void> {
    const { entity, location, errors } = params.eventPayload;
    for (const error of errors) {
      env.logger.warn(error.message, {
        entity,
        location,
      });
    }
  },
});
```
