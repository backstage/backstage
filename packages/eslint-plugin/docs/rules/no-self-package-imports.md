# @backstage/no-self-package-imports

This rule prevents a package from importing itself by its own name when the
imported entry point bundles the current file. Self-package imports in that
situation create a circular dependency through the bundled barrel, which can
surface as runtime errors such as
`Cannot access 'X' before initialization` when the package is loaded in an
environment that triggers eager re-evaluation (for example
`jest.requireActual`, or ESM consumers that follow the cycle).

The rule understands your package's `exports` map and follows the
relative import graph from each entry's source file to determine which files
are actually bundled into each entry. It then reports:

- **Same-entry self-imports**: the current file is part of the same bundle
  as the entry it imports, so the cycle is real.
- **Cross-entry self-imports** (optional): the file is part of a different
  entry's bundle than the one it imports. Cross-entry self-imports don't
  always cycle, but they still couple unrelated entry points at initialization
  time and are worth avoiding.

Files that aren't reachable from any published entry (tests, scripts,
orphans) are skipped, as self-imports from them can't affect a published
bundle.

Imports declared with `import type` (or `export type`) are erased at runtime
and are always allowed, since they can't cause circular initialization.

## Usage

Add the rule as follows:

```js
"@backstage/no-self-package-imports": ["error"]
```

This errors on same-entry self-imports. Cross-entry self-imports are allowed
by default; opt in to reporting them with `allowCrossEntry: false`:

```js
"@backstage/no-self-package-imports": ["error", { "allowCrossEntry": false }]
```

## Rule Details

Given this `package.json`:

```json
{
  "name": "@backstage/plugin-foo",
  "exports": {
    ".": "./src/index.ts",
    "./alpha": "./src/alpha.ts",
    "./package.json": "./package.json"
  }
}
```

and `src/index.ts` that re-exports `./blueprint`:

```ts
export * from './blueprint';
```

### Fail

Importing `@backstage/plugin-foo` from a file that is also reachable from
`src/index.ts` creates a cycle:

```ts
// src/blueprint.ts
import { helper } from '@backstage/plugin-foo';
```

### Pass

Use a relative import instead:

```ts
// src/blueprint.ts
import { helper } from './helper';
```

Or, if only the type is used, `import type` is erased at runtime and is
always allowed:

```ts
// src/blueprint.ts
import type { Helper } from '@backstage/plugin-foo';
```

Importing `package.json` is always allowed:

```ts
import { version } from '@backstage/plugin-foo/package.json';
```

## Options

### `allowCrossEntry`

- Type: `boolean`
- Default: `true`

When `false`, the rule also reports self-imports that target a different
entry from the one the current file is part of.
