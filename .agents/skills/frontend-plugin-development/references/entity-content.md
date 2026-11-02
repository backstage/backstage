# Entity content

Read when adding or changing a tab on the catalog entity page. Tabs come from `EntityContentBlueprint` in `@backstage/plugin-catalog-react/alpha`. Use the blueprint directly rather than `convertLegacyEntityContentExtension`, which is only meant for third-party plugins you do not control.

```tsx
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

const myEntityContent = EntityContentBlueprint.make({
  params: {
    path: '/my-plugin',
    title: 'My Plugin',
    group: 'development',
    filter: { kind: 'component', 'spec.type': 'service' },
    loader: () => import('./components/MyTab').then(m => <m.MyTab />),
  },
});
```

The extension is added to the plugin's `extensions`. It does not need `mountPoint` or a route ref: the entity page owns the routing.

## Filter: keep the same entities

`filter` decides which entities show the tab. It accepts an [entity predicate query](https://backstage.io/docs/features/software-catalog/catalog-customization#entity-predicate-queries) object, a function `(entity: Entity) => boolean`, or a filter expression string.

Match the original check exactly. If the old check only looked at `spec.type`, do not add a `kind` condition: that changes which entities show the tab.

## Group

`group` places the tab in a group on the entity page. The default groups are `overview`, `documentation`, `development`, `deployment`, `operation`, and `observability`.

- A tab whose `group` matches no group definition (or alias) is shown on its own, outside any group.
- If the app config defines `groups` on `page:catalog/entity`, that list **replaces** the default groups. Check the app config before choosing a group ID.
- Integrators can change a tab's group per installation with `config.group`, or remove it with `false`.

See [entity page groups](https://backstage.io/docs/features/software-catalog/catalog-customization#group-aliases) for group definitions, aliases, and ordering.

## Several tabs from one plugin

Each `EntityContentBlueprint` in a plugin needs a unique `name`, or the plugin throws `provided duplicate extensions` when it is created.

## Moving a tab from legacy entity page JSX

In an app that still has legacy entity page JSX, the legacy route and the new extension both render, so the entity page shows the tab twice. When you add the blueprint:

1. Search every entity kind's page for the plugin's legacy content component and its predicate, not just the first match:

   ```bash
   grep -rn "Entity<Name>Content\|is<Name>Available" packages/app/src
   ```

2. Remove each legacy route and its import.
3. Before deleting JSX in favour of an extension, check that the extension is enabled in `app-config`. See [App integration](app-integration.md#check-app-config-before-deleting-legacy-jsx).

Test entity content with `createExtensionTester`. See [Testing entity extensions](https://backstage.io/docs/frontend-system/building-plugins/testing#testing-entity-extensions).
