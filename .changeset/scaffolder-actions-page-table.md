---
'@backstage/plugin-scaffolder': patch
---

Migrated the actions page to use `@backstage/ui` list and search components. Actions are now presented in a sidebar list with a separate detail panel for the selected action, along with built-in search filtering. The selected action is also reflected in the URL hash, allowing deep-linking to a specific action.
