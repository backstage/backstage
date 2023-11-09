---
'@backstage/plugin-home': patch
---

Added a new Featured Docs component to `plugin-home`, which can display any entity given a filter.

```
import { FeaturedDocsCard } from '@backstage/plugin-home';

<FeaturedDocsCard
  filter={{
    'spec.type': 'documentation',
    'metadata.name': 'getting-started-with-backstage',
  }}
  title={cardTitleReactNode}
  subLinkText="More Details"
  emptyState={emptyStateReactNode}
  linkDestination={'/customPath'}
  responseLimit={5}
/>
```

See the [storybook examples](https://backstage.io/storybook/?path=/story/plugins-home-components-featureddocs--default)
