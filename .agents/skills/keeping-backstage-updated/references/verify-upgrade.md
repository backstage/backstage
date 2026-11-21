# Verify the Upgrade

Run the checks in order and stop at the first failure.

## Use the repository's own commands

Prefer the scripts the repository defines for type checking, building, linting,
and testing — they encode that repository's expectations. A fresh
`create-backstage-app` repository defines `yarn tsc` and `yarn tsc:full` at the
root, `yarn lint` and `yarn test` across the repo, and `yarn build` in each
package. Run the tests with `CI=true`, using `test:all` for the full suite:
plain `yarn test` starts jest in watch mode when it doesn't detect CI, which
never exits and is useless outside an interactive terminal.

```bash
yarn tsc
yarn build
yarn lint
CI=true yarn test:all
```

In monorepos the root commands usually cover every workspace package.

## Triage failures

- **Type errors on renamed or removed APIs** — fix per
  `fix-breaking-changes.md`.
- **Snapshot mismatches** — review and update: `yarn test -u`.
- **Errors about moved packages** — rerun `versions:migrate`.
- **Package configuration errors** — see the migrate subcommands in
  `migrate-packages.md`.

## Import validation

Check that no deprecated or moved imports remain:

```bash
git grep '@backstage/plugin-' -- '*.ts' '*.tsx'
```

Cross-reference the hits against the community plugins repository before
changing them; many `@backstage/*` names are still canonical.

## Version consistency

Confirm that every `@backstage/*` dependency is on the target release and that
the dependency range style matches what was recorded before the bump:

```bash
git grep '"@backstage/' -- 'package.json' '**/package.json'
```

If any package is out of sync, rerun `versions:bump`; if the range style
drifted, normalize it and refresh the lockfile.

## Runtime check

If the repository has a runnable app, start it and check that it boots, the
frontend loads, and the browser console is free of errors:

```bash
yarn dev
```

## Report

Report the version the repository was on and the target it reached, the commands
run, the breaking changes fixed and the files they touched, every resolutions
and overrides decision from the bump, and anything left misaligned, with a
reason.
