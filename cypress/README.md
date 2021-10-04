# Cypress Tests for Backstage

Hey 👋 Welcome to the Cypress tests for Backstage. They're designed to be run against the `packages/app` folder in the main repo, and be some form of smoke tests to make sure that we don't break any core functionality.

They run part of the PR build, and are triggered from the `.github/workflows/tugboat.yml` file.

The main app gets built up part of a [Tugboat Build](https://tugboat.qa), which when complete, sends a `deployment event` to the PR triggering the aforementioned workflow.

### Running Locally

In order to make typescript happy, this `cypress` package is separate from all the Jest dependencies in the monorepo workspaces setup.

You can run the e2e tests locally pointing at your local running version like so:

```sh
cd cypress
yarn install
yarn cypress run
```

You can open up the `cypress` console by using `yarn cypress open`.

You can also run towards any Backstage installation by using the Cypress Environment Variable overrides.

```sh
CYPRESS_baseUrl="http://demo.backstage.io" yarn cypress run
```
