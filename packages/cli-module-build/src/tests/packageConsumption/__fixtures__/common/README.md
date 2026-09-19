# Common-library root and alpha scenario

An adopter must be able to call the same public functions through native
`require` and `import` of a packaged common library, including an `/alpha` subpath.
The functions exercise an external CommonJS (CJS) dependency and asynchronous
loading of an ECMAScript module (ESM) dependency.

This scenario contributes runtime coverage toward MOD03 (module interoperability)
and PUB03 (subpath exports) in the
[requirements investigation](https://github.com/backstage/backstage/issues/35604).
It is motivated in part by the
[CJS import correction](https://github.com/backstage/backstage/pull/35598).
It reproduces the relevant dependency shape; it does not test `lodash` itself or
the corrected source of any production Backstage package.

## Details that carry coverage

| Detail                                               | Why it matters                                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `backstage.role: common-library`                     | Exercises the real role's JavaScript outputs together                                          |
| Source paths in `main` and `exports`                 | Makes publication rewriting necessary; existing dist paths would bypass it                     |
| No package `type` field                              | Represents the existing common-library authoring convention; adding one changes the experiment |
| `files: ["dist"]`                                    | Requires consumers to work without the TypeScript source tree                                  |
| Distinct `/alpha` function                           | Makes accidentally pointing the subpath at the root observable                                 |
| `./index` without an extension in `alpha.ts`         | Exercises rewriting an internal source import into a runnable output reference                 |
| Default import of `compat-cjs-dependency`            | Retrieves a dynamically populated CJS export object from both outputs                          |
| Dependency uses `Object.assign(module.exports, ...)` | Native Node cannot infer its `value` named export from an `exports.value` assignment           |
| Bare external dependency imports                     | Leaves interoperability work for the consumer runtime, rather than bundling it away            |
| Dynamic `import()` of `compat-esm-dependency`        | Exercises native asynchronous loading from the CJS output as well as the ESM output            |
| Top-level await in the ESM dependency                | Prevents newer Node `require(esm)` support from masking an import rewritten into require       |
| `.cjs` and `.mjs` consumers                          | Fixes each consumer's native module interpretation independently of package heuristics         |
| Resolution checks in the harness                     | Prevents a passing test from silently consuming CJS output twice                               |

Both consumers must return `42` from the root, `43` from `/alpha`, and `44` from
the asynchronous function. These literals are independently chosen expectations,
not results calculated using the builder's implementation.

The dependency names, function names, and numeric values are incidental. The
export shapes, import mechanisms, distinct entry behavior, and runtime isolation
are essential. The `.d.ts` files alongside dependencies describe fixture APIs for
the editor; they are not generated declarations or evidence of consumer type
compatibility. See the [suite coverage limits](../../README.md).

## Negative controls

These are temporary verification edits, not additional supported fixture variants:

- Replace the default dependency import in `src/index.ts` with
  `import { value } from 'compat-cjs-dependency'` and call `value()`. The native
  ESM consumer should fail to import that named CJS export, even though the CJS
  consumer works. This demonstrates the class of failure behind that dependency import regression.
- Replace the asynchronous `import('compat-esm-dependency')` with
  `require('compat-esm-dependency')`. The CJS consumer should reject loading the
  asynchronous ESM module. A transformer making the equivalent mistake should
  be caught at the same boundary.
- Remove `./alpha` from the prepared package's `exports` before packing. The
  consumer should fail with a package-subpath resolution error.

Run the suite after each edit, inspect the failure, and restore the fixture or
harness before rerunning successfully. Do not fix a failure by adding a loader,
using a direct dist path, bundling the dependency, or making both consumers select
the same output: those changes remove the boundary this scenario exercises.
