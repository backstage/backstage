---
'@backstage/techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
to remove registering individual preparers and generators.

Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

```typescript
const preparers = await Preparers.fromConfig(config, {
  logger,
  reader,
});

const generators = await Generators.fromConfig(config, {
  logger,
});

const publisher = await Publisher.fromConfig(config, {
  logger,
  discovery,
});
```

You should be able to remove unnecessary imports, and just do

```typescript
import {
  createRouter,
  Preparers,
  Generators,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
```
