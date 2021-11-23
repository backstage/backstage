# techdocs-cli

[![NPM Version badge](https://img.shields.io/npm/v/@techdocs/cli)](https://www.npmjs.com/package/@techdocs/cli)

## Usage

See [techdocs-cli usage docs](https://backstage.io/docs/features/techdocs/cli).

## Development

NOTE: When we build `techdocs-cli` it copies the output `embedded-techdocs-app`
bundle into the `packages/techdocs-cli/dist` which is then published with the
`@techdocs/cli` npm package.

### Running

```sh
# From the root of this repository run
# NOTE: This will build the embedded-techdocs-app and copy the output into the cli dist directory
yarn build --scope @techdocs/cli

# Now execute the binary
packages/techdocs-cli/bin/techdocs-cli

# ... or as a shell alias in ~/.zshrc or ~/.zprofile or ~/.bashrc or similar
export PATH=/path/to/backstage/packages/techdocs-cli/bin:$PATH
```

If you want to test live test changes to the `packages/embedded-techdocs-app`
you can serve the app and run the CLI using the following commands:

```sh
# Open a shell to the embedded-techdocs-app directory
cd packages/embedded-techdocs-app

# Run the embedded-techdocs-app using dev mode
yarn start

# In another shell use the techdocs-cli from the root of this repo
yarn techdocs-cli:dev [...options]
```

### Testing

Running unit tests requires mkdocs to be installed locally:

```sh
pip install mkdocs
pip install mkdocs-techdocs-core
```

Then run `yarn test`.

### Use an example docs project

We have created an [example documentation project](https://github.com/backstage/techdocs-container/tree/main/mock-docs) and it's shipped with [techdocs-container](https://github.com/backstage/techdocs-container) repository, for the purpose of local development. But you are free to create your own local test site. All it takes is a `docs/index.md` and `mkdocs.yml` in a directory.

```sh
git clone https://github.com/backstage/techdocs-container.git

cd techdocs-container/mock-docs

# To get a view of your docs in Backstage, use:
techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
techdocs-cli serve:mkdocs
```
