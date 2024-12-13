# example-backend

This package is an EXAMPLE of a Backstage backend using the [new backend system](https://backstage.io/docs/backend-system/).

The main purpose of this package is to provide a test bed for Backstage split deployment work. You can deploy both this package and the main `packages/backend` together by running the `start:split` command in both packages. This will run the following backends:

1. `packages/backend` running on `:7007` with the default plugins installed.
2. `packages/backend-split` running on `:7008` with a subset of plugins installed for testing.
