---
'@backstage/plugin-catalog-backend': patch
---

**BREAKING**:

- Removed the previously deprecated `runPeriodically` export. Please use the `@backstage/backend-tasks` package instead, or copy [the actual implementation](https://github.com/backstage/backstage/blob/02875d4d56708c60f86f6b0a5b3da82e24988354/plugins/catalog-backend/src/util/runPeriodically.ts#L29) into your own code if you explicitly do not want coordination of task runs across your worker nodes.
- Removed the previously deprecated `CatalogProcessorLocationResult.optional` field. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
- Related to the previous point, the `processingResult.location` function no longer has a second boolean `optional` argument. Please set the corresponding `LocationSpec.presence` field to `'optional'` instead.
- Removed the previously deprecated `StaticLocationProcessor`. It has not been in use for some time; its functionality is covered by `ConfigLocationEntityProvider` instead.
