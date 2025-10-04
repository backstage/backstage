---
'@backstage/plugin-signals-backend': minor
'@backstage/plugin-signals-node': minor
'@backstage/plugin-notifications-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Signal recipients for users have been changed to accept only arrays.

This change affects signal sending by changing the `recipients` field to
force `entityRefs` to be arrays of strings instead of
loosely accepting either a single string or an array of strings.
This change was made to simplify the API and avoid ambiguity.
If you were previously using a single string for either of these fields, you
will need to update your signal user sending to use an array and type `users` instead.

```diff
signalService.sendNotification({
  recipients: {
-   type: 'user',
-   entityRef: 'user:default/janedoe',
+   type: 'users',
+   entityRefs: ['user:default/janedoe'],
  },
  // payload...
});
```

Support for the old fields will be removed in a future release.
