---
'@backstage/plugin-catalog-backend': minor
'@backstage/catalog-model': minor
'@backstage/plugin-org': minor
---

- Added the ability to optionally define leaders of groups in the catalog
  - A "leader" here is a manager, a chairperson, a spokesperson, etc.
  - A group can have zero-or-one user defined as the leader, and users can be leaders of zero-or-more groups. The leader is not required to be a member of the group
- Display the leader of a group (if any) on the Group Profile Card
- Display the group(s) a user leads (if any) on the User Profile Card
  - Also adds labels to the fields being displayed on the User Profile Card
