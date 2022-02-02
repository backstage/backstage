---
'@backstage/plugin-catalog-react': patch
---

Add caching to the useEntityPermission hook

The hook now caches the authorization decision based on the permission + the entity, and returns the cache match value as the default `allowed` value while loading. This helps avoid flicker in UI elements that would be conditionally rendered based on the `allowed` result of this hook.
