# @backstage/core-components

This package provides the core UI components used by Backstage plugins and apps, built on [shadcn/ui](https://ui.shadcn.com/) — accessible Radix UI primitives styled with Tailwind CSS utility classes. Theming is driven by CSS custom properties with full light and dark mode support, replacing the former MUI ThemeProvider/makeStyles pattern.

The shadcn/ui primitive components live in `src/components/ui/` as first-party code, giving Backstage full ownership and the ability to customize every component at the source level.

## Technology Stack

| Layer               | Technology                                                                                                | Purpose                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **UI Primitives**   | [shadcn/ui](https://ui.shadcn.com/) on [Radix UI](https://www.radix-ui.com/) (`radix-ui` unified package) | Accessible, composable component primitives                             |
| **Styling**         | [Tailwind CSS](https://tailwindcss.com/) with `cn()` helper (`clsx` + `tailwind-merge`)                   | Utility-first styling with zero CSS-in-JS runtime                       |
| **Icons**           | [Lucide React](https://lucide.dev/) (`lucide-react`)                                                      | Tree-shakeable, consistent SVG icon set                                 |
| **Data Tables**     | [`@tanstack/react-table`](https://tanstack.com/table)                                                     | Headless table state management (sorting, filtering, pagination)        |
| **Toasts**          | [Sonner](https://sonner.emilkowal.ski/) (`sonner`)                                                        | Animated, stackable toast notifications                                 |
| **Command Palette** | [cmdk](https://cmdk.paco.me/)                                                                             | Keyboard-first command dialog (⌘K)                                      |
| **Theming**         | CSS custom properties                                                                                     | Light/dark mode via `[data-theme-mode]` selector, WCAG 2.1 AA compliant |

## Installation

Install the package via Yarn:

```sh
cd <package-dir> # if within a monorepo
yarn add @backstage/core-components
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
