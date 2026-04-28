---
'@backstage/plugin-scaffolder-react': minor
'@backstage/plugin-scaffolder': minor
---

Refactored the Scaffolder New Frontend System (NFS) to enable easier customization and alignment with NFS patterns:

- Exported commonly used components (e.g., `TemplateListContent`, `TemplatesSubPage`) and their associated props from `@backstage/plugin-scaffolder/alpha` to enable various customization scenarios.
- Introduced `ScaffolderFilterBlueprint` and `ScaffolderGroupFilterBlueprint` blueprints to provide a consistent pattern for configuring custom filters and template groups.
- The `TemplatesSubPage` now accepts `filters` and `groups` as props, allowing customization to be controlled from the parent component rather than requiring full component replacement.
- Refactored the monolithic `extensions.tsx` file into smaller, modular files (`apis`, `fields`, `filters`, `navItems`, `pages`).
- Added a `DefaultFilters` component in `@backstage/plugin-scaffolder-react/alpha`.
