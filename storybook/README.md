# storybook

This package provides a Storybook build for Backstage. See https://backstage.io/storybook/.

## Usage

To run the storybook locally, call `yarn storybook` in repo root. This will show the default set of stories that we publish to https://backstage.io/storybook

If you want to show stories other than the default set, you can pass one or more package paths as an argument when calling storybook, for example:

```sh
yarn storybook plugins/search
```

## Why is this not part of `@backstage/core-components`?

This separate storybook package exists because of dependency conflicts with `@backstage/cli`. It uses `nohoist` to avoid the conflicts, and since you can only use that in private packages it has to be separated out of `@backstage/core-components`.
