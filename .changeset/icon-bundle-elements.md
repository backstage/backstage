---
'@backstage/plugin-app-react': minor
'@backstage/plugin-app': minor
---

**BREAKING**: Icon bundles created with `IconBundleBlueprint` now accept only icon elements. Replace component values such as `icons: { user: MyIcon }` with `icons: { user: <MyIcon /> }`. For Material UI icons, use `<MyIcon fontSize="inherit" />`. Icons supplied through `convertLegacyAppOptions` continue to accept components and are converted automatically.
