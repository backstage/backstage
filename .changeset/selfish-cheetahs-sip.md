---
'@backstage/plugin-catalog-react': minor
---

Add an optional `type` parameter to `EntityCard` extensions. A card's type determines characteristics such as its expected size and where it will be rendered by the entity content layout.

Initially the following three types are supported:

- `peek`: small vertical cards that provide information at a glance, for example recent builds, deployments, and service health.
- `info`: medium size cards with high priority and frequently used information such as common actions, entity metadata, and links.
- `full`: Large cards that are more feature rich with more information, typically used by plugins that don't quite need the full content view and want to show a card instead.

### Usage examples

Defining a default type when creating a card:

```diff
const myCard = EntityCardBlueprint.make({
  name: 'myCard',
  params: {
+   type: 'info',
    loader: import('./MyCard).then(m => { default: m.MyCard }),
  },
});
```

Changing the card type via `app-config.yaml` file:

```diff
app:
  extensions:
+   - entity-card:myPlugin/myCard:
+       config:
+         type: info
```
