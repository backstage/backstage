# storybook

This package provides a storybook build for Backstage. See [storybook.backstage.io](http://storybook.backstage.io)

## Why is this not part of `@backstage/core`?

This separate storybook package exists because of dependency conflicts with `@backstage/cli`. It uses nohoist to avoid the conflicts, and since you can only use that in private packages it has to be separated out of `@backstage/core`.
