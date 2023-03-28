---
'@backstage/plugin-catalog-react': minor
---

Attempt to load entity owner names in the EntityOwnerPicker through the `by-refs` endpoint. If `spec.profile.displayName` or `metadata.title` are populated, we now attempt to show those before showing the `humanizeEntityRef`'d version.

**BREAKING**: `EntityOwnerFilter` now uses the full entity ref instead of the `humanizeEntityRef`. If you rely on `EntityOwnerFilter.values` or the `queryParameters.owners` of `useEntityList`, you will need to adjust your code like the following.

```tsx
const {queryParameters: {owners: oldEntityOwnerFilterRef}} = useEntityList();
// or
const {filter: {owners}} = useEntityList();

// Instead of,
...
if(owners.some(ref=>ref === humanizeEntityRef(myEntity))){
    ...
}

// You'll need to use,
...
if(owners.some(ref=>ref === stringifyEntityRef(myEntity))){
    ...
}
```
