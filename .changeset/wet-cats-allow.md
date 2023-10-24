---
'@backstage/plugin-home': patch
---

Added a new Featured Docs component to `plugin-home`, which can display any entity given a filter.

```
import { FeaturedDocs } from '@backstage/plugin-home';

<FeaturedDocs
  filter={{
    'spec.type': 'documentation',
    'metadata.name': 'getting-started-with-backstage',
  }}
  title={cardTitleReactNode}
  customStyles={styles}
  subLinkText="More Details"
  color="secondary"
  emptyState={emptyStateReactNode}
  path={'/customPath'}
  responseLimit={5}
/>
```

See the [storybook examples](https://backstage.io/storybook/?path=/story/plugins-home-components-featureddocs--default)
