---
'@backstage/techdocs-common': patch
---

Move the sanity checks of the publisher configurations to a dedicated `PublisherBase#validateConfiguration()` method instead of throwing an error when doing `Publisher.fromConfig(...)`.
If you want to preserve this check in your application, use the following code:

```ts
const publisher = await Publisher.fromConfig(config, {
  logger,
  discovery,
});

const validation = await publisher.validateConfiguration();
if (!validation.isValid) {
  throw new Error('Invalid TechDocs publisher configuration');
}
```
