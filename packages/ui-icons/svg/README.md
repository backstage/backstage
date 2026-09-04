# Remix Icon SVG Sources

SVG files in this directory are **copied from [Remix Icon](https://remixicon.com/)**
([Remix-Design/RemixIcon](https://github.com/Remix-Design/RemixIcon), Apache-2.0).

This package does **not** depend on `@remixicon/react`. Icons are vendored here so
bundlers can load each icon as a separate module.

## Adding or updating an icon

1. Download the SVG from [remixicon.com](https://remixicon.com) or copy from the
   [Remix Icon repository](https://github.com/Remix-Design/RemixIcon/tree/master/icons)
   (currently based on **v4.8.x**).
2. Save it in this directory using kebab-case naming (e.g. `check-line.svg`).
3. Add an entry to [`icons.manifest.json`](../icons.manifest.json).
4. Run:

   ```bash
   yarn workspace @backstage/ui-icons generate
   ```

5. Commit the SVG, manifest update, and generated `src/icons/*.tsx` files.

## Manifest

See [`icons.manifest.json`](../icons.manifest.json) for the mapping between React
component names (`RiCheckLine`) and SVG files, including the original Remix Icon
source path for traceability.
