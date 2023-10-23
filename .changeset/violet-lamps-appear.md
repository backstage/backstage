---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-react': minor
---

Release design improvements for the `Scaffolder` plugin and support v5 of `@rjsf/*` libraries.

This change should be non-breaking. If you're seeing typescript issues after migrating please [open an issue](https://github.com/backstage/backstage/issues/new/choose)

The `next` versions like `createNextFieldExtension` and `NextScaffolderPage` have been promoted to the public interface under `createScaffolderFieldExtension` and `ScaffolderPage`, so any older imports which are no longer found will need updating from `@backstage/plugin-scaffolder/alpha` or `@backstage/plugin-scaffolder-react/alpha` will need to be imported from `@backstage/plugin-scaffolder` and `@backstage/plugin-scaffolder-react` respectively.

The legacy versions are now available in `/alpha` under `createLegacyFieldExtension` and `LegacyScaffolderPage` if you're running into issues, but be aware that these will be removed in a next mainline release.
