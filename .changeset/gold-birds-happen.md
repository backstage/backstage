---
'@backstage/plugin-org': patch
---

For the component `EntityMembersListCard` you can now specify the type of members you have in a group. For example:

```tsx
<Grid item xs={12}>
  <EntityMembersListCard memberType="Ninja's" />
</Grid>
```

If left empty it will by default use 'Members'.
