---
'@backstage/ui': patch
---

Fixed client-side navigation for container components by wrapping the container (not individual items) in RouterProvider. Components now conditionally provide routing context only when children have internal links, removing the Router context requirement when not needed. This also removes the need to wrap these components in MemoryRouter during tests when they are not using the `href` prop.

Additionally, when multiple tabs match the current URL via prefix matching, the tab with the most specific path (highest segment count) is now selected. For example, with URL `/catalog/users/john`, a tab with path `/catalog/users` is now selected over a tab with path `/catalog`.

Affected components: Tabs, Tab, TagGroup, Tag, Menu, MenuItem, MenuAutocomplete
