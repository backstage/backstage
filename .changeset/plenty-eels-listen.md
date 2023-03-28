---
'@backstage/plugin-catalog-react': minor
---

Attempt to load entity owner names in the EntityOwnerPicker through the `by-refs` endpoint. If `spec.profile.displayName` or `metadata.title` are populated, we now attempt to show those before showing the `humanizeEntityRef`'d version.

**BREAKING**: This updates the `EntityOwnerFilter` to use the full entity ref instead of the `humanizeEntityRef`. If you rely on `EntityOwnerFilter.values` or the `owners` query parameter of the catalog page, you will need to adjust your code to use

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
