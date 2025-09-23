---
'@backstage/plugin-notifications-backend': minor
'@backstage/plugin-notifications-node': minor
'@backstage/plugin-scaffolder-backend-module-notifications': patch
'@backstage/plugin-notifications-backend-module-email': patch
'@backstage/plugin-notifications-backend-module-slack': patch
---

Notification entity recipients have been changed to accept only arrays.

This change affects notification sending by changing the `recipients` field to
force both `entityRefs` and `excludedEntityRefs` to be arrays of strings instead of
loosely accepting either a single string or an array of strings.
This change was made to simplify the API and avoid ambiguity.
If you were previously using a single string for either of these fields, you
will need to update your notification entities to use an array and type `entities` instead.

```diff
notificationService.sendNotification({
  recipients: {
-   type: 'entity',
-   entityRef: 'user:default/janedoe',
-   excludedEntityRef: ['group:default/contractors'],
+   type: 'entities',
+   entityRefs: ['user:default/janedoe'],
+   excludedEntityRefs: ['group:default/contractors']
  },
  // payload...
});
```

Support for the old fields will be removed in a future release.
