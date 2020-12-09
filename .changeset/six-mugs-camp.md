---
'@backstage/create-app': patch
---

In the techdocs-backend plugin (`packages/backend/src/plugins/techdocs.ts`), create a publisher using

```
  const publisher = Publisher.fromConfig(config, logger, discovery);
```

instead of

```
  const publisher = new LocalPublish(logger, discovery);
```

An instance of `publisher` can either be a local filesystem publisher or a Google Cloud Storage publisher.

Read more about the configs here https://backstage.io/docs/features/techdocs/configuration
(You will also have to update `techdocs.storage.type` to `local` or `googleGcs`. And `techdocs.builder` to either `local` or `external`.)
