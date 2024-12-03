---
'@backstage/plugin-techdocs': patch
---

Add optional props to `TechDocCustomHome` to allow for more flexibility:

```tsx
import { TechDocsCustomHome } from '@backstage/plugin-techdocs';
//...

const options = { emptyRowsWhenPaging: false };
const linkDestination = (entity: Entity): string | undefined => {
  return entity.metadata.annotations?.['external-docs'];
};
const techDocsTabsConfig = [
  {
    label: 'Recommended Documentation',
    panels: [
      {
        title: 'Golden Path',
        description: 'Documentation about standards to follow',
        panelType: 'DocsCardGrid',
        panelProps: { showHeader: false, showSupport: false },
        filterPredicate: entity =>
          entity?.metadata?.tags?.includes('golden-path') ?? false,
      },
      {
        title: 'Recommended',
        description: 'Useful documentation',
        panelType: 'InfoCardGrid',
        panelProps: {
          showHeader: false,
          showSupport: false,
          linkDestination: linkDestination,
        },
        filterPredicate: entity =>
          entity?.metadata?.tags?.includes('recommended') ?? false,
      },
    ],
  },
  {
    label: 'Browse All',
    panels: [
      {
        description: 'Browse all docs',
        filterPredicate: filterEntity,
        panelType: 'TechDocsIndexPage',
        title: 'All',
        panelProps: { showHeader: false, showSupport: false, options: options },
      },
    ],
  },
];

const AppRoutes = () => {
  <FlatRoutes>
    <Route
      path="/docs"
      element={
        <TechDocsCustomHome
          tabsConfig={techDocsTabsConfig}
          title="Docs"
          showSubtitle={false}
          filter={{
            kind: ['Location', 'Resource', 'Component'],
            'metadata.annotations.featured-docs': CATALOG_FILTER_EXISTS,
          }}
        />
      }
    />
  </FlatRoutes>;
};
```

Add new Grid option called `InfoCardGrid` which is a more customizable card option for the Docs grid.

```tsx
<InfoCardGrid
  entities={entities}
  linkContent="Learn more"
  linkDestination={entity => entity.metadata['external-docs']}
/>
```

Expose existing `CustomDocsPanel` so that it can be used independently if desired.

```tsx
const panels: PanelConfig[] = [
  {
    description: '',
    filterPredicate: entity => {},
    panelType: 'InfoCardGrid',
    title: 'Standards',
    panelProps: {
      showSupport: false,
      linkContent: 'Read more',
      linkDestination: entity => {},
    },
  },
  {
    description: '',
    filterPredicate: entity => {},
    panelType: 'DocsCardGrid',
    title: 'Contribute',
  },
];
{
  panels.map((config, index) => (
    <CustomDocsPanel
      key={index}
      config={config}
      entities={!!entities ? entities : []}
      index={index}
    />
  ));
}
```
