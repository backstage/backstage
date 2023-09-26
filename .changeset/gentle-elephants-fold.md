---
'@backstage/plugin-catalog': minor
---

The catalog plugin no longer implements the experimental reconfiguration API. The create button title can now instead be configured using the new experimental internationalization API, via the `catalogTranslationRef` exported at `/alpha`. For example:

```ts
import { catalogTranslationRef } from '@backstage/plugin-catalog/alpha';

const app = createApp({
  __experimentalTranslations: {
    resources: [
      createTranslationMessages({
        ref: catalogTranslationRef,
        catalog_page_create_button_title: 'Create Software',
      }),
    ],
  },
});
```
