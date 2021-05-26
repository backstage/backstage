---
'@backstage/create-app': patch
---

Added newer entity relationship cards to the default `@backstage/create-app` template:

- `EntityDependsOnComponentsCard`
- `EntityDependsOnResourcesCard`
- `EntityHasResourcesCard`
- `EntityHasSubcomponentsCard`

The `EntityLinksCard` was also added to the overview page. To apply these to your Backstage application, compare against the updated [EntityPage.tsx](https://github.com/backstage/backstage/blob/371760ca2493c8f63e9b44ecc57cc8488131ba5b/packages/create-app/templates/default-app/packages/app/src/components/catalog/EntityPage.tsx)
