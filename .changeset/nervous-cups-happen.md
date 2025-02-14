---
'@backstage/plugin-catalog-react': minor
---

Introduce a new `EntityHeaderBlueprint` that allows you to customize the default header and also have different headers depending on an entity filter.

### Usage examples

Customizing the default header to render more title actions:

```jsx
import { EntityHeaderBlueprint } from '@backstage/plugin-catalog-react/alpha';
// ...

function CopyEntityNameToClipboard() {
  const { entity } = useEntity();
  const alertApi = useApi(alertApiRef);

  const handleClick = useCallback(() => {
    if (!entity) return;
    window.navigator.clipboard
      .writeText(entity.metadata.name)
      .then(() =>
        alertApi.post({ message: 'Entity name copied to clipboard!' }),
      );
  }, [entity, alertApi]);

  return (
    <Tooltip title="Copy to clipboard">
      <IconButton onClick={handleClick}>
        <FileCopyIcon htmlColor="#fff" />
      </IconButton>
    </Tooltip>
  );
}

EntityHeaderBlueprint.make({
  name: 'my-default-header',
  params: {
    // The `FavoriteEntity` icon button is added by default
    // You can also completely override the default title
    // title: <MyTitleComponent />
    title: { actions: [<CopyEntityNameToClipboard />] },
    // A subtitle element is also supported.
    // subtitle: <MySubtitleComponent />
  },
});
```

Setting up a completely different default header component:

```jsx
import { EntityHeaderBlueprint } from '@backstage/plugin-catalog-react/alpha';

EntityHeaderBlueprint.make({
  name: 'my-default-header',
  params: {
    loader: () => import('./MyDefaultHeader').then(m => <m.MyDefaultHeader />),
  },
});
```

Use a different header for entities of type template:

```jsx
import { EntityHeaderBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { MyTemplateHeader } from './MyTemplateHeader';

EntityHeaderBlueprint.make({
  name: 'my-template-header',
  params: {
    defaultFilter: 'kind:template',
    loader: () => import('./MyTemplateHeader').then(m => <m.MyTemplateHeader />),
});
```

Disabling a header via configuration:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-header:app/my-template-header: false
```

Changing a header default filter via configuration:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-header:app/my-template-header:
        config:
          # Using this custom header with components instead
          filter: 'kind:component'
```
