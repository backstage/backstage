---
'@backstage/ui': minor
---

**BREAKING**: Backstage UI now uses explicit routing integration and React Aria's native link behavior. Standalone apps that relied on automatic React Router integration must supply `BUIProvider` with a `useRouter` hook. React Router is no longer a peer dependency, and `routerOptions` supports the router-neutral `replace` and `state` options.

Upgrade the provider and separately bundled BUI components together. Use `href="."` for the current route; empty hrefs follow React Aria's native behavior. Backstage apps configure scoped BUI navigation automatically.

**BREAKING**: Link targets using `javascript:`, `data:`, or `vbscript:` become inert `about:blank` links with a console warning. Replace `data:` links with blob URLs or display their content directly, and replace `javascript:` links with `onClick` handlers. Other URL schemes, including custom schemes, use native browser navigation.

See the [BUI routing migration guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#migrate-backstage-ui-routing) for integration requirements.

Affected components: BUIProvider, ButtonLink, Card, Combobox, Header, Link, List, Menu, PluginHeader, SearchAutocomplete, Select, Table, Tabs, TagGroup
