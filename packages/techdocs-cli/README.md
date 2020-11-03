# TechDocs CLI

Check out the [TechDocs README](https://github.com/backstage/backstage/blob/master/plugins/techdocs/README.md) to learn more.

**WIP: This cli is a work in progress. It is not ready for use yet. Follow our progress on [the Backstage Discord](https://discord.gg/MUpMjP2) under #docs-like-code or on [our GitHub Milestone](https://github.com/backstage/backstage/milestone/15).**

## Prerequisities

Run the following command from the project root:

```bash
yarn install
```

## Run TechDocs CLI

You'll need Docker installed and running to use this.

```bash
cd packages/techdocs-container/mock-docs

# To get a view of your docs in Backstage, use:
npx techdocs-cli serve

# To view the raw mkdocs site (without Backstage), use:
npx techdocs-cli serve:mkdocs
```

If you run `npx techdocs-cli serve` you should have a `localhost:3000` serving TechDocs in Backstage, as well as `localhost:8000` serving Mkdocs (which won't open up and be exposed to the user).

If running `npx techdocs-cli serve:mkdocs` you will have `localhost:8000` exposed, serving Mkdocs.

Happy hacking!

## Deploying a new version

Deploying the Node packages to NPM happens automatically on merge to `master` through GitHub Actions. The deployment happens through Lerna which determines which packages throughout the Backstage project have changed. In our case, the package is called `techdocs-cli` in the repository but `@techdocs/cli` in the NPM registry.

> Note: Once a package is published under a version, any subsequent changes will not override that version. You will need to bump up the version across the entire Backstage repository, which can be done through Lerna (see the command below).

In order to bump up all packages, go to the root of the Backstage repository. To see the current version see the `lerna.json` under the `version` key. To then update all the versions (locally on your machine), run the following:

```bash
git checkout -b bump-up-version
yarn lerna version --no-push --allow-branch --yes
```

Upon being merged to master, Lerna will then automatically publish these packages as configured by the Backstage core team.
