# @backstage/cli-module-oxlint

Oxlint-powered lint commands for the Backstage CLI. Requires Node.js 22.12 or
later in the supported Node 22 or 24 release lines.

## Commands

| Command        | Description                              |
| :------------- | :--------------------------------------- |
| `package lint` | Lint selected package files with Oxlint. |
| `repo lint`    | Lint repository packages with Oxlint.    |

Add the module as a development dependency to opt the project into its
`package lint` and `repo lint` commands:

```shell
yarn add --dev @backstage/cli-module-oxlint
```

Keep ESLint configuration and lint commands until you choose to switch the
project. The module does not migrate source comments or ESLint configuration
for you.

## Configuration

Create a CommonJS `.oxlintrc.js` beside each package's `package.json`:

```javascript
module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(
  __dirname,
  {
    ignorePatterns: ['templates/**'],
    rules: { 'no-console': 'off' },
  },
);
```

The `/oxlint-factory` entry point reads `backstage.role` from the package
manifest and returns native Oxlint configuration. It exports the same callable as
`createPackageConfig`, plus named `createConfig` and `createConfigForRole`
methods. Use `createConfig` for a workspace root without a package role and
`createConfigForRole` when the role is supplied directly. The root config uses
common-library policy; packages without local configs inherit it. The factory
does not enumerate the workspace or aggregate package roles. The package
directory anchors the config's role and file scopes, so put each config in the
directory passed to the factory.

The default `backstage` preset enables selected correctness and Backstage
rules. Frontend configs load React and JSX accessibility plugins at top level;
backend and CLI configs load Node rules at top level. Those role checks apply to
JavaScript and TypeScript, while Jest is added only in test-file overrides with
the full role plugin list. TypeScript AST rules also live at top level. Pass
native Oxlint options such as `plugins`, `rules`, `overrides`, `ignorePatterns`,
`categories`, and `options` to customize the returned config; explicit `rules`
override factory defaults. Unknown preset names are rejected; `preset` is
consumed by the factory and is not passed to Oxlint.

This is a native Oxlint policy, not an ESLint configuration translator or a
promise of complete ESLint parity. Backstage rules use Oxlint's `createOnce`
lifecycle and per-file context; the module does not load ESLint or change the
ESLint plugin. Only deliberately selected native plugins
and Backstage rules are enabled. Repository-specific rules and exceptions
belong in the repository's `.oxlintrc.js`; arbitrary `.eslintrc` extensions are
not loaded or executed.

## Agentic preset

Select `agentic` for stricter linting:

```javascript
module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(
  __dirname,
  { preset: 'agentic' },
);
```

The preset turns enabled rules and override rules into errors, enables
`typeAware` and `typeCheck`, and reports unused disable directives as errors.
It also enables existing Backstage checks for bare identifier casing, React and
Winston default imports, and `__dirname` in `src`. The preset collects files
selected by Oxlint and has the Backstage CLI validate final source comments
after fixes, before returning. This audit requires
`BACKSTAGE_OXLINT_AUDIT_DIR`, which the CLI provides; an agentic config cannot
be run directly with raw Oxlint. Use narrow, explained directives with
configured Oxlint rule IDs, for example:

```javascript
// oxlint-disable-next-line backstage/no-forbidden-package-imports -- This package must use the public API.
```

Blanket and self-suppressions, missing or placeholder explanations, and stale
unused directives fail linting. Use configured rule IDs, not diagnostic codes:
`eqeqeq` works; `eslint(eqeqeq)` is a diagnostic code and cannot be used in a
directive. Selecting Oxlint is an explicit migration: legacy ESLint rule IDs do
not have an alias bridge.

## Reports and fixes

Both commands accept `--fix`, `--format`, `--output-file`, and `--max-warnings`;
`repo lint` also accepts `--since` and selects packages with a Backstage
`package lint` script, without executing custom lint scripts. `--max-warnings=-1`
allows warnings, matching the ESLint module. Relative output paths resolve from
the package directory for `package lint` and repository root for `repo lint`.
Supported formats are `default`, `checkstyle`,
`github`, `gitlab`, `json`, `junit`, `sarif`, `stylish`, and `unix`. JSON, SARIF,
and GitLab Code Quality reports are merged across config groups. Checkstyle and
JUnit are rejected before linting when a command selects multiple config
groups. `repo lint` accepts `--success-cache` and `--success-cache-dir` for
script compatibility, but Oxlint always checks selected packages and does not
read or write a success cache. Linting continues across groups, writes the
complete report, and then returns a nonzero exit status if any group or
suppression audit fails.

Oxlint applies `--fix` in one pass. Autofixes that generate dependency
directives for ordinary imports are disabled; diagnostics retain manual Yarn
guidance. Other safe fixes, including unrelated import additions, remain
enabled. Existing explicit dependency directives can still run their suggested
Yarn command without `--fix`. A fix pass can expose new violations
while exiting successfully, so run plain lint after every `--fix`. The CLI does
not repeat fixes automatically.

## Development

Dogfood the module with `yarn workspace @backstage/cli-module-oxlint lint`.
