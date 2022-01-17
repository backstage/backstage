---
'@backstage/plugin-org': patch
---

For the component `EntityMembersListCard` you can now specify the pageSize. For example:

```tsx
<Grid item xs={12}>
  <EntityMembersListCard pageSize={100} />
</Grid>
```

If left empty it will by default use 50.
