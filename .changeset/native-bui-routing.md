---
'@backstage/ui': minor
---

BUI routing now uses an explicit app integration and React Aria's native link behavior. React Router is no longer a peer dependency.

**Migration:**

Standalone apps must supply `BUIProvider` with a `useRouter` hook for client-side navigation; an ambient React Router no longer enables routing automatically.

The hook supplies matching href resolution, navigation, and the current pathname. `routerOptions` supports the router-neutral `replace` and `state` options. Upgrade the provider and separately bundled BUI components together. Direct React Aria controls need their own scoped `RouterProvider` from the same React Aria installation.

Use `href="."` to navigate to the current route. Empty hrefs follow React Aria's native behavior and are no longer resolved by the host router.

**Affected components:** BUIProvider, ButtonLink, Combobox, Header, Link, List, Menu, PluginHeader, SearchAutocomplete, Select, Table, Tabs, TagGroup
