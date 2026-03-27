# @backstage/ui

Backstage UI (BUI) is a component library for Backstage, built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) with CSS custom properties (`--bui-*` tokens).

## Relationship with shadcn/ui Core Components

The core Backstage developer portal UI has been redesigned using [shadcn/ui](https://ui.shadcn.com/) components (Radix UI primitives + Tailwind CSS), located in `packages/core-components/src/components/ui/`. The shadcn/ui token system (`--background`, `--foreground`, `--primary`, etc.) is aligned with BUI's existing `--bui-*` token vocabulary:

| BUI Token (`--bui-*`)  | shadcn/ui Token | Purpose                       |
| ---------------------- | --------------- | ----------------------------- |
| `--bui-bg-app`         | `--background`  | Application background        |
| `--bui-fg-primary`     | `--foreground`  | Primary text color            |
| `--bui-bg-solid`       | `--primary`     | Primary action/branding color |
| `--bui-border-1`       | `--border`      | Default border color          |
| `--bui-radius-3`       | `--radius`      | Base border radius            |
| `--bui-font-regular`   | `--font-sans`   | Proportional font family      |
| `--bui-font-monospace` | `--font-mono`   | Monospace font family         |

Both token systems coexist at runtime — BUI components consume `--bui-*` tokens while shadcn/ui components consume the standard shadcn/ui tokens, both defined on the document root.

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
