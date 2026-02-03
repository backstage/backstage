# @backstage/ui

Backstage UI is a component library for Backstage.

## Installation

Install the package via Yarn:

```sh
cd <package-dir> # if within a monorepo
yarn add @backstage/ui
```

## Documentation

- [Backstage UI Documentation](https://ui.backstage.io)
- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)

## Writing Changesets for Components

When creating changesets for component-specific changes, add component metadata to help maintain documentation:

```markdown
---
'@backstage/ui': patch
---

Fixed size prop handling for Avatar component.

Affected components: Avatar
```

**Guidelines:**

- **Component names**: Use PascalCase as they appear in imports (Avatar, ButtonIcon, SearchField)
- **Multiple components**: `Affected components: Button, ButtonLink, ButtonIcon`
- **General changes**: Omit the metadata line (build changes, package-level updates)
- **Placement**: The line can appear anywhere in the description

The changelog sync tool will parse these tags and update the documentation site automatically.
