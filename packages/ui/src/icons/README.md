# Internal BUI Icons

Tree-shakeable inline SVG icons used by `@backstage/ui` components.

These icons are derived from [Remix Icon](https://remixicon.com/) (Apache-2.0 license)
and replace the `@remixicon/react` runtime dependency, which ships a single ~2.4MB
barrel that cannot be tree-shaken by bundlers.

Each icon is a separate module so consumers only bundle the icons used by the
BUI components they import.
