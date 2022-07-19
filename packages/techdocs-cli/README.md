# techdocs-cli

[![NPM Version badge](https://img.shields.io/npm/v/@techdocs/cli)](https://www.npmjs.com/package/@techdocs/cli)

## Usage

See [techdocs-cli usage docs](https://backstage.io/docs/features/techdocs/cli).

## Development

NOTE: When we build `techdocs-cli` it copies the output `techdocs-cli-embedded-app`
bundle into the `packages/techdocs-cli/dist` which is then published with the
`@techdocs/cli` npm package.

### Running

```sh
# From the root of this repository run
# NOTE: This will build the techdocs-cli-embedded-app and copy the output into the cli dist directory
yarn workspace @techdocs/cli build

# Now execute the binary
packages/techdocs-cli/bin/techdocs-cli

# ... or as a shell alias in ~/.zshrc or ~/.zprofile or ~/.bashrc or similar
export PATH=/path/to/backstage/packages/techdocs-cli/bin:$PATH
```

If you want to test live test changes to the `packages/techdocs-cli-embedded-app`
you can serve the app and run the CLI using the following commands:

```sh
# Open a shell to the techdocs-cli-embedded-app directory
cd packages/techdocs-cli-embedded-app

# Run the techdocs-cli-embedded-app using dev mode
yarn start

# In another shell use the techdocs-cli from the root of this repo
yarn techdocs-cli:dev [...options]
```

### Using an example docs project

For the purpose of local development, we have created an example documentation project. You are of course also free to create your own local test site - all it takes is a `docs/index.md` and an `mkdocs.yml` in a directory.

```sh

cd packages/techdocs-cli/src/example-docs

# To get a view of your docs in Backstage, use:
techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
techdocs-cli serve:mkdocs
```

### Testing

#### E2E tests

Running unit tests requires mkdocs to be installed locally:

```sh
pip install mkdocs
pip install mkdocs-techdocs-core
```

Then run `yarn test`.

#### Cypress (Integration and Visual regression) tests

Running cypress tests requires you to run the CLI locally against our example docs.

Run the local version of techdocs-cli against the example docs:

```sh
# From the root of this repository run
# NOTE: This will build the techdocs-cli-embedded-app and copy the output into the cli dist directory
yarn build --scope @techdocs/cli

# Navigate to the example project
cd packages/techdocs-cli/src/example-docs

# Now execute the techdocs-cli serve command
../../bin/techdocs-cli serve
```

In another shell, run the cypress tests:

```sh
# From the root of the project, navigate to the techdocs-cli package
cd packages/techdocs-cli

# Run tests
yarn test:cypress
```

This will launch a cypress app where you can run the two different tests:

- `backstage_serve` - will run against the backstage server
- `mkdocs_serve` - will run test against the mkdocs server

> If its the first time you run Cypress, it will run a "Verifying Cypress can run" step. This step can result in a "Cypress verification timed out" error. If that is the case, let the verification step run and then run the command again and it should succeed.
