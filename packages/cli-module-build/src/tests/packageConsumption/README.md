# Published package consumption tests

This suite exercises the boundary between building a Backstage package and
consuming its archive through native Node.js package resolution. It is a first
slice of the [module compatibility requirements investigation](https://github.com/backstage/backstage/issues/35604),
not the full acceptance matrix or a proposed replacement build system.

Read this document and the [common-library scenario](./__fixtures__/common/README.md)
before changing fixtures. Import syntax, dependency export shapes, directory
placement, and manifest fields can be essential to coverage. Treat a change to
those characteristics as a change to the experiment, even if the tests stay green.

## Execution and isolation

The checked-in fixtures are miniature packages, outside the repository's workspace
globs. They are not released. The dependency fixtures live in `__fixtures__/node_modules`
so editors can resolve their declarations, following the neighboring transform
tests' convention. These are deliberately checked-in files, not installed dependencies.

Each suite run:

1. Copies the source package into a fresh operating-system temporary directory.
1. Uses `getOutputsForRole` and `buildPackage` to build the role's JavaScript
   outputs once. It omits the declaration output, which needs separate coverage.
1. Uses `productionPack` with a separate target directory to rewrite the manifest
   and select publication files. The test does not manufacture conditional exports.
1. Runs the repository's checked-in Yarn release to create an archive of that
   directory. Network access is disabled and no dependency installation runs.
1. Extracts the archive into an independent consumer's `node_modules` and copies
   the two dependency fixtures there. Deletes the producer and staging directories.
1. Runs `.cjs` and `.mjs` consumers with the test runner's Node executable, clearing
   `NODE_OPTIONS` and `NODE_PATH`. Jest never imports the built package itself.
1. Checks results, verifies resolved entries belong to the extracted package, and
   verifies the two consumers exercised distinct outputs. Removes temporary files
   even after a test failure.

The consumer imports by package name, including `/alpha`. A direct import of a
`dist` filename would bypass the publication contract. Neither source links nor
Backstage loaders are available in the consumer. The harness also checks that the
extracted package is not a symlink and has no `src` directory.

## Coverage and limits

| Surface                                                           | Coverage in this suite                                                       |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Common-library JavaScript output                                  | Real role-based build; CJS and ESM consumption                               |
| Publication entry rewriting                                       | Real `productionPack`, including root and `/alpha`                           |
| Archive contents                                                  | Real Yarn packing of the prepared directory and extraction                   |
| CJS interoperability                                              | Default import from a dependency with dynamically assigned exports           |
| ESM interoperability                                              | Dynamic import of an ESM dependency with top-level await                     |
| Node versions                                                     | The executing Node version; normal repository CI supplies its version matrix |
| Declarations and TypeScript consumer resolution                   | Not covered; fixture dependency declarations only support authoring          |
| CLI prepack/postpack command dispatch and restoration             | Not covered; publication preparation is called directly                      |
| Package-manager installation and workspace protocols              | Not covered; dependencies are copied into an installed layout                |
| Source development, Jest consumers, browser bundles, tree shaking | Not covered; Jest is only the orchestrator here                              |
| Other roles, assets, source maps, Storybook, module federation    | Not covered                                                                  |

The source manifest's `types` field is retained to resemble normal authoring, but
without declaration generation this is deliberately a runtime-only artifact.
Do not describe a passing result as validating all aspects of a publishable package.

## Running and measuring

After `yarn install` in the repository root:

```shell
CI=1 yarn test packages/cli-module-build/src/tests/packageConsumption --runInBand
```

To print separate timings for the build, publication rewrite, Yarn packing,
consumer setup, and each Node process:

```shell
BACKSTAGE_COMPAT_TIMINGS=1 CI=1 yarn test packages/cli-module-build/src/tests/packageConsumption --runInBand
```

Jest's total duration additionally includes test module loading and orchestration.
Compare standalone runs with runs alongside the neighboring transform tests and
with CI measurements. There is no timing assertion: timeouts bound hung operations,
not an accepted performance budget. The producer is built and packed once for both
consumers; adding consumer assertions should not require another build or install.

## Maintaining coverage

For each added scenario, document its adopter-visible guarantee, sensitive fixture
characteristics, expected failure, and exclusions beside its source. Link historical
regressions where available. Keep expected values independent of the implementation
under test, and avoid snapshots of complete manifests or generated JavaScript.

Before claiming a regression is covered, deliberately reintroduce it and confirm
the consumer fails at the expected boundary. The scenario README describes the
negative controls for this slice. Restore the defect and rerun the tests before
committing. A setup error, missing tool, or unrelated type error does not establish
that the intended regression was detected.

The exact filenames and tool APIs used by the harness are replaceable. The
source-to-archive boundary, native consumer isolation, dependency characteristics,
and public entry points are the coverage to preserve. If a design deliberately
changes a characteristic such as dual output, update the experiment and explain
which replacement tests exercise the newly intended contract.
