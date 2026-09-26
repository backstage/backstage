---
'@backstage/plugin-techdocs-backend': minor
---

Added opt-in support for authorizing documentation access with the new `techdocs.entity.read` permission, so that documentation can be restricted from users who are still able to see the entity in the catalog.

This is disabled by default and is enabled with a new experimental configuration flag:

```yaml
techdocs:
  experimentalTechdocsPermissions: true
```

When enabled, `techdocs.entity.read` replaces the catalog's `catalog.entity.read` permission as the check that guards documentation content. Reading the catalog entity behind a documentation site continues to require `catalog.entity.read` as well. Be aware that this makes `techdocs.entity.read` the only permission guarding your documentation content, so make sure your permission policy handles it before turning the flag on — otherwise a policy that allows unknown permissions by default will serve documentation to everyone.

These checks only apply to documentation served through the TechDocs backend. If `techdocs.storageUrl` points somewhere clients can reach directly, that location must enforce its own access control. The backend logs a warning when both are configured, and refuses to start if the flag is enabled while the permission framework is disabled.

The flag gives you time to update your permission policy before switching over. This behavior is intended to become the default in a future release.
