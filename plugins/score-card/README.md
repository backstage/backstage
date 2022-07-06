# score-card

Welcome to the score-card plugin! Main idea behind it comes from a need to somehow visualize maturity of our services and to establish a process how to improve it (discuss with the teams what to focus on next).

## Components

### ScoreBoardPage

Displays list of systems and their scores.

![Score board](./docs/.assets/score-board.png)

### ScoreCard

Displays detail for one system and it's scoring. You may use it in entity detail page in the catalog.

![Score Card](./docs/.assets/score-card.png)

You may drill down to the details of each score together with explanation why it has such score & also a TODO for the team.

![Score Card Detail](./docs/.assets/score-card-detail.png)

## Scoring process

To find out a `score` for your service we follow this process:

- Scoring introduction
- Team self-assesment
- Review process
- Backstage integration & visualization
- Regular update

### Scoring introduction

We have based the scoring on a set of non-functional requirements in these areas:

- **Code**: coding standards, implementation of proper logging, audits, resiliency patterns etc.
- **Quality**: coverage by unit & automated integration tests, implementation of SonarCloud, performance tests etc.
- **Operations**: readiness for operating the service such as automated ci/cd pipelines, dashboards, alerts, gitops, DRP etc.
- **Documentation**: various documentation e.g. project description, README, wiki (business, technical), road map, etc.
- **Security**: fulfillment of our security standards.

The **main goal of the scoring** is to visualize the maturity of the services (systems). We do not expect each service to have 100 % fulfillment for every area. Primary goal is to identify where we can help the team to improve and where we should help all teams in general.

Also every service is specific and in a different state of implementation. When a team starts building a new service it is absolutely OK to have e.g. low Operations score.

So as a first step the teams need to understand why. Thats why there is an important step to prepare teams for the scoring proces, e.g. with following presentation: [system-scoring.pdf](docs/.assets/system-scoring.pdf).

### Team self-assesment

Team does the self assesment, that is answering a form (e.g. via Sharepoint list) with list of questions. There is a space for comments. Each requirement is described in detail in a wiki.

Example how a form in Sharepoint may look like:

![Sharepoint Form: Editation](docs/.assets/sharepoint-form-editation.png)

### Review process

Answers & comments are reviewed together with the team by an architect. Questions are answered, possible improvements and TODOs discussed and agreed with the team & product owner(s).

### Backstage integration & visualization

There is an [integration pipeline](tools/azure-devops-pipelines/integration-with-sharepoint.yaml) that runs regularly that integrates the Sharepoint list, git repository with the [scoring data](sample-data/) and the storage account that provides JSON scoring data for the Backstage plugin to visualize results.

### Regular update

Every 6 months (it depends) there needs to be a quick update with the team & the architect so we can see whenever we are improving.

## Local environment

You would need the same prerequisites as for backstage (node.js,...). One component you would need is `http-server` that will provide the sample data for the plugin.

Navigate to the plugin directory `/plugins/score-card` and run `yarn start:dev`. Your local DEV environment will start: <http://localhost:3024/>.

## Unit testing

To run unit tests simply execute `yarn test score-card`;

## Integration testing

This is being done as part of the backstage integration tests. See `/cypress/src/integration/score-card`.

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/score-card](http://localhost:3000/score-card).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
