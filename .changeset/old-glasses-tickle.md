---
'@backstage/plugin-catalog': patch
---

Adds an `EntityLinksCard` component to display `entity.metadata.links` on entity pages. The new component is a companion for the new [Entity Links](https://backstage.io/docs/features/software-catalog/descriptor-format#links-optional) catalog model addition.

Here is an example usage within an `EntityPage.tsx`.

```tsx
// in packages/app/src/components/catalog/EntityPage.tsx
const ComponentOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={4} sm={6}>
      <EntityLinksCard />
      // or ...
      <EntityLinksCard cols={{ md: 2, lg: 3, xl: 4 }} />
    </Grid>
  </Grid>
);
```
