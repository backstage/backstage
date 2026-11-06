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
common-library policy; packages without local configs inherit it. If neither
the package nor any parent directory up to the repository root has an Oxlint
config, the lint commands fail instead of running Oxlint's built-in defaults,
which would skip every Backstage rule. The factory
does not enumerate the workspace or aggregate package roles. The package
directory anchors the config's role and file scopes, so put each config in the
directory passed to the factory.

The default `backstage` preset enables selected correctness and Backstage
rules. Frontend configs load React and JSX accessibility plugins at top level;
backend and CLI configs load Node rules at top level. Those role checks apply to
JavaScript and TypeScript, while Jest is added only in test-file overrides with
the full role plugin list. TypeScript AST rules also live at top level. TypeScript
files under `src/**/generated/` also require a blank line after imports, and
`--fix` removes their unused imports, which code generators such as
`backstage-repo-tools package schema openapi generate` rely on. Like ESLint,
unused arguments and `_` prefixed variables are allowed in these files. Each
check follows the package's top-level setting for its rule and stays off when
the package turns that rule off. When the package doesn't set
`no-unused-vars`, it uses the severity of the `correctness` category. They apply
after package `overrides`, so set them in top-level `rules`. Pass
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

## Strict preset

Select `strict` for stricter linting:

```javascript
module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(
  __dirname,
  { preset: 'strict' },
);
```

The preset turns enabled rules and override rules into errors, enables
`typeAware` and `typeCheck`, and reports unused disable directives as errors.
It uses native Oxlint restrictions to reject `.toLowerCase` and `.toUpperCase`
property access and default or namespace imports from React and Winston. The
Backstage `__dirname` check still applies in `src`. The preset collects files
selected by Oxlint and has the Backstage CLI validate final source comments
after fixes, before returning. The audit runs only through the Backstage CLI;
loading a strict config in an editor or with raw Oxlint lints without the
audit. Use narrow, explained directives with
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
`package lint` script, without executing custom lint scripts. Warning
thresholds apply across the whole run rather than per config group, and
`repo lint` honors a `--max-warnings` value declared in a package's own lint
script. `--max-warnings=-1`
allows warnings, matching the ESLint module. Relative output paths resolve from
the package directory for `package lint` and repository root for `repo lint`.
Supported formats are `default`, `checkstyle`,
`github`, `gitlab`, `json`, `junit`, `sarif`, `stylish`, and `unix`. JSON, SARIF,
and GitLab Code Quality reports are merged across config groups. Checkstyle and
JUnit are rejected before linting when a command selects multiple config
groups, and a run with no groups writes an empty report. `repo lint` accepts
`--success-cache` and `--success-cache-dir` for
script compatibility, but Oxlint always checks selected packages and does not
read or write a success cache. Config groups lint concurrently, the complete
report is written, and a nonzero exit status is returned if any group or
suppression audit fails.

Oxlint applies `--fix` in one pass. Automatic fixes that generate dependency
directives for ordinary imports are disabled; diagnostics retain manual Yarn
guidance. Other safe fixes, including unrelated import additions, remain
enabled. Existing explicit dependency directives can still run their suggested
Yarn command without `--fix`. A fix pass can expose new violations
while exiting successfully, so run plain lint after every `--fix`. The CLI does
not repeat fixes automatically.

## Copyright headers

The `backstage/notice` rule requires the Apache 2.0 copyright header used in
the Backstage repository, and `--fix` inserts it. The rule is off by default.
With `--fix`, the header replaces a leading empty `//` comment, which code
generators such as `backstage-repo-tools package schema openapi generate` write
as a placeholder, together with any license header that follows it. An empty
`//` line followed by a line comment with text is kept. The factory builds each package configuration on its own, so
enable the rule in every package's `.oxlintrc.js`:

```javascript
module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(
  __dirname,
  { rules: { 'backstage/notice': 'error' } },
);
```
