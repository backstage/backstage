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

## Routing

BUI uses React Aria for link activation, including keyboard input, modified
clicks, downloads, and event cancellation. Backstage apps configure BUI routing
automatically. A standalone app can configure client navigation with
`BUIProvider`'s `useRouter` prop:

```tsx
type BUIRouter = {
  navigate: (
    href: string,
    options?: { replace?: boolean; state?: unknown },
  ) => void;
  resolveHref: (href: string) => string;
  pathname: string;
};
```

The hook runs at each consuming control's position in the app. Return a
`resolveHref` function and a `navigate` function that interpret relative targets
from that same position. Resolved hrefs and `pathname` must include the deployment
basename. `resolveHref` is a normal function so collections can resolve multiple
items. Absolute URLs remain browser-owned.

BUI uses browser navigation unless the app supplies a host hook or a React Aria
`RouterProvider` from the control's installation. BUI no longer detects an
ambient React Router. Nested BUI providers inherit the host hook.

### Migrating an existing integration

- Upgrade the app's BUI provider and separately bundled BUI components together.
- Standalone apps that relied on automatic React Router integration must supply
  `useRouter`. React Router is no longer a BUI peer dependency.
- Use the router-neutral `routerOptions` fields `replace` and `state`. Options
  specific to React Router are no longer part of the BUI contract.
- Use `href="."` to navigate to the current route. Empty hrefs follow React
  Aria's native behavior and are no longer resolved by the host router.
- When using React Aria components directly, configure their own `RouterProvider`
  at the desired route scope, from the same installation as those components.
  BUIProvider configures BUI controls. In the new frontend system, the public
  `useAppRouting` hook supplies React Aria's matching `navigate` and `useHref`
  callbacks; see [page router integration](https://backstage.io/docs/frontend-system/building-plugins/page-routers).

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
