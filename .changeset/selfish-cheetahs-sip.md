---
'@backstage/plugin-catalog-react': minor
---

Add an optional `area` parameter to `EntityCard` extensions. A card's area value determines where it should be rendered by the entity content layout, as well as its maximum size.

We are initially supporting only three areas:

- `peek`: used for cards containing infrastucture information (e.g. last builds, deployments, etc.).
- `info`: used for cards that contain entity metadata (e.g. about, links);
- `full`: Contains information that plugins add to an entity (e.g. PagerDuty incidents and on-call escalation).

### Usage examples

Defining a default area when creating a card:

```diff
const myCard = EntityCardBlueprint.make({
  name: 'myCard',
  params: {
+   defaultArea: 'info',
    loader: import('./MyCard).then(m => { default: m.MyCard }),
  },
});
```

Changing the card area via `app-config.yaml` file:

```diff
app:
  extensions:
+   - entity-card:myPlugin/myCard:
+       config:
+         area: info
```
