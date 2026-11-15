---
'@backstage/ui': minor
---

**BREAKING**: Backstage UI now uses explicit routing integration and React Aria's native link behavior: standalone apps that relied on automatic React Router integration must supply `BUIProvider` with a `useNavigation` hook, React Router is no longer a peer dependency, and `routerOptions` now supports only the router-neutral `replace` and `state` fields. **BREAKING**: Link targets using `javascript:`, `data:`, or `vbscript:` become inert `about:blank` links with a console warning. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [BUI routing migration guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#migrate-backstage-ui-routing) for integration requirements.

Affected components: BUIProvider, ButtonLink, Card, Combobox, Header, Link, List, Menu, PluginHeader, SearchAutocomplete, Select, Table, Tabs, TagGroup
