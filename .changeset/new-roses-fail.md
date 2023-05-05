---
'@backstage/plugin-org': patch
---

Changed the MembersListCard component to allow displaying aggregated members when viewing a group. Now, a toggle switch can be displayed that lets you switch between showing direct members and aggregated members.

To enable this new feature, set the showAggregateMembersToggle prop on EntityMembersListCard:

```jsx
// In packages/app/src/components/catalog/EntityPage.tsx
const groupPage = (
  // ...
  <EntityMembersListCard showAggregateMembersToggle />
  // ...
);
```
