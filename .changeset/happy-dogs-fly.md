---
'@backstage/plugin-org': minor
'@backstage/plugin-catalog-graph': minor
'@backstage/create-app': patch
---

**BREAKING**: Migrated `MembersListCard`, `OwnershipCard`, and `CatalogGraphCard` to use BUI card primitives via `EntityInfoCard`.

- `OwnershipCard`: Removed `variant` and `maxScrollHeight` props. Card height and scrolling are now controlled by the parent container — the card fills its container and the body scrolls automatically when content overflows.
- `CatalogGraphCard`: Removed `variant` prop.
- `MembersListCard`: Translation keys `subtitle`, `paginationLabel`, `aggregateMembersToggle.directMembers`, `aggregateMembersToggle.aggregatedMembers`, and `aggregateMembersToggle.ariaLabel` have been removed. The `title` key now includes `{{groupName}}`. New keys added: `cardLabel`, `noSearchResult`, `aggregateMembersToggle.label`.
- `OwnershipCard`: Translation keys `aggregateRelationsToggle.directRelations`, `aggregateRelationsToggle.aggregatedRelations`, and `aggregateRelationsToggle.ariaLabel` have been removed. New key added: `aggregateRelationsToggle.label`.
- Removed `MemberComponentClassKey` export, and `root` and `cardContent` from `MembersListCardClassKey`, `card` from `OwnershipCardClassKey`, and `card` from `CatalogGraphCardClassKey`.

**Migration:**

```diff
- <EntityOwnershipCard variant="gridItem" />
+ <EntityOwnershipCard />
```

```diff
- <EntityCatalogGraphCard variant="gridItem" height={400} />
+ <EntityCatalogGraphCard height={400} />
```
