---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Adds `EntityContextMenuItemBlueprint` to enable extending the entity page's context menu with user defined items.

For example:

```ts
import { EntityContextMenuItemBlueprint } from '@backstage/plugin-catalog-react/alpha';

const myCustomHref = EntityContextMenuItemBlueprint.make({
  name: 'test-href',
  params: {
    icon: <span>Example Icon</span>,
    useProps: () => ({
      title: 'Example Href',
      href: '/example-path',
      disabled: false,
      component: 'a',
    }),
  },
});

const myCustomOnClick = EntityContextMenuItemBlueprint.make({
  name: 'test-click',
  params: {
    icon: <span>Test Icon</span>,
    useProps: () => ({
      title: 'Example onClick',
      onClick: () => window.alert('Hello world!'),
      disabled: false,
    }),
  },
});
```
