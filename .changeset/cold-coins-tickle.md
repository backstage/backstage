---
'@backstage/plugin-catalog-backend': minor
---

Added an option to be able to trigger refreshes on entities based on a prestored arbitrary key.

The UrlReaderProcessor, FileReaderProcessor got updated to store the absolute URL of the catalog file as a refresh key. In the format of `<type>:<target>`
The PlaceholderProcessor got updated to store the resolverValues as refreshKeys for the entities.

The custom resolvers will need to be updated to pass in a `CatalogProcessorEmit` function as parameter and they should be updated to emit their refresh processingResults. You can see the updated resolvers in the `PlaceholderProcessor.ts`

```ts
  // yamlPlaceholderResolver
  ...
  const { content, url } = await readTextLocation(params);

  params.emit(processingResult.refresh(`url:${url}`));
  ...
```
