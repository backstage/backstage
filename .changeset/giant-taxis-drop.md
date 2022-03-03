---
'@backstage/plugin-catalog-common': minor
---

Remove resourceType property from catalogEntityCreatePermission. Resource type refers to the type of resources whose resourceRefs should be passed along with authorize requests, to allow conditional responses for that resource type. Since creation does not correspond to an entity (as the entity does not exist at the time of authorization), the resourceRef should not be included on the permission.
