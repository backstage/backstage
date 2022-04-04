---
'@backstage/plugin-org': patch
---

Provides the ability to hide the relations toggle on the `OwnershipCard` as well as setting a default relation type.

To hide the toggle simply include the `hideRelationsToggle` prop like this:

```tsx
<EntityOwnershipCard
  variant="gridItem"
  entityFilterKind={customEntityFilterKind}
  hideRelationsToggle
/>
```

To set the default relation type, add the `relationsType` prop with a value of direct or aggregated, the default if not provided is direct. Here is an example:

```tsx
<EntityOwnershipCard
  variant="gridItem"
  entityFilterKind={customEntityFilterKind}
  relationsType="aggregated"
/>
```
