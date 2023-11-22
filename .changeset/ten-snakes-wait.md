---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: This version changes how extensions are created and how their IDs are determined. The `createExtension` function now accepts `kind`, `namespace` and `name` instead of `id`. All of the new options are optional, and are used to construct the final extension ID. By convention extension creators should set the `kind` to match their own name, for example `createNavItemExtension` sets the kind `nav-item`.

The `createExtension` function as well as all extension creators now also return an `ExtensionDefinition` rather than an `Extension`, which in turn needs to be passed to `createPlugin` or `createExtensionOverrides` to be used.
