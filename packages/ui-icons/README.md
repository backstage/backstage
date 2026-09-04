# @backstage/ui-icons

Tree-shakeable [Remix Icon](https://remixicon.com/) components for Backstage UI and plugins.

## Why this package exists

`@remixicon/react` ships a single ~2.4MB ESM barrel with no per-icon subpath exports.
Bundlers cannot tree-shake individual icons, causing large bundle sizes.

`@backstage/ui-icons` vendors SVG sources copied from Remix Icon and exposes **per-icon
modules** that bundlers can tree-shake. This package has **no runtime dependency** on
`@remixicon/react`.

## Usage

Prefer direct per-icon imports for optimal tree-shaking:

```tsx
import { RiCheckLine } from '@backstage/ui-icons/RiCheckLine';
import { RiLoader4Line } from '@backstage/ui-icons/RiLoader4Line';

<Button iconStart={<RiCheckLine aria-hidden="true" />}>Save</Button>;
```

Barrel imports are also supported:

```tsx
import { RiCheckLine, RiLoader4Line } from '@backstage/ui-icons';
```

## Icon maintenance

Icons are **not** fetched from npm at build time. SVG files are vendored in [`svg/`](./svg/)
and tracked in [`icons.manifest.json`](./icons.manifest.json).

To add or update an icon:

1. Copy the SVG from [Remix Icon](https://github.com/Remix-Design/RemixIcon) (v4.8.x) into `svg/`
2. Update `icons.manifest.json`
3. Run `yarn workspace @backstage/ui-icons generate`
4. Commit SVG, manifest, and generated TypeScript files

See [`svg/README.md`](./svg/README.md) for details.

## License

Icon SVG paths are derived from [Remix Icon](https://remixicon.com/) (Apache-2.0).
See [`svg/README.md`](./svg/README.md) for attribution.
