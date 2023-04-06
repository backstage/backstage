# Cypress Tests for Backstage

Hey 👋 Welcome to the Cypress tests for Backstage. They're designed to be run against the `packages/app` folder in the main repo, and be some form of smoke tests to make sure that we don't break any core functionality.

### Running Locally

In order to make typescript happy, this `cypress` package is separate from all the Jest dependencies in the monorepo workspaces setup.

You can run the e2e tests locally pointing at your local running version like so:

```sh
cd cypress
yarn install
yarn cypress run
```

Note that the tests expect to run against a built application, so you'll want to
run a Docker image and either create an `app-config.cypress.yaml` or pass the
necessary environment variables:

```sh
yarn tsc
yarn build:backend
yarn workspace example-backend build-image
docker run -p 7007:7007 example-backend
```

You can open up the `cypress` console by using `yarn cypress open`.

You can also run towards any Backstage installation by using the Cypress Environment Variable overrides.

```sh
CYPRESS_baseUrl="http://demo.backstage.io" yarn cypress run
```
