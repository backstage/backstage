---
'@backstage/plugin-catalog-react': minor
---

Introduces a new `EntityContentLayoutBlueprint` that creates custom entity content layouts.

The layout components receive card elements and can render them as they see fit. Cards is an array of objects with the following properties:

- element: `JSx.Element`;
- area: `"peek" | "info" | "full" | undefined`;

### Usage example

Creating a custom overview tab layout:

```tsx
import {
  EntityContentLayoutProps,
  EntityContentLayoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
// ...

function StickyEntityContentOverviewLayout(props: EntityContentLayoutProps) {
  const { cards } = props;
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid
        className={classes.infoArea}
        xs={12}
        md={4}
        item
      >
        <Grid container spacing={3}>
          {cards
            .filter(card => card.area === 'info')
            .map((card, index) => (
              <Grid key={index} xs={12} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid xs={12} md={8} item>
        <Grid container spacing={3}>
          {cards
            .filter(card => card.area === 'peek')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
          {cards
            .filter(card => !card.area || card.area === 'full')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export const customEntityContentOverviewStickyLayoutModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    EntityContentLayoutBlueprint.make({
      name: 'sticky',
      params: {
        // (optional) defaults the `() => false` filter function
        defaultFilter: 'kind:template'
        loader: async () => StickyEntityContentOverviewLayout,
      },
    }),
  ],
```

Disabling the custom layout:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-content-layout:app/sticky: false
```

Overriding the custom layout filter:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-content-layout:app/sticky:
        config:
          # This layout will be used only with component entities
          filter: 'kind:component'
```
