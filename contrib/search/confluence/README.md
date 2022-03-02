# Confluence

These files help you add Confluence as a source to the Backstage Search plugin.
To do so, add both files in this directory under the packages/backend/src/plugins/search/ pathway in your Backstage app.
Then, add the following code to your packages/app/src/components/search/SearchPage.tsx:

```tsx
import { ConfluenceResultListItem } from './ConfluenceResultListItem';
```

```tsx
case 'confluence':
  return (
    <ConfluenceResultListItem
      key={document.location}
      result={document}
    />
  );
```

and the following to packages/backend/src/plugins/search.ts:

```ts
import { ConfluenceCollator } from './search/ConfluenceCollator';
```

```ts
indexBuilder.addCollator({
  defaultRefreshIntervalSeconds: 600,
  collator: new ConfluenceCollator(),
});
```
