# score-card

Welcome to the score-card plugin!

## Components

### ScoreCard

Displays detail for one system and it's scoring. You may use it in entity detail page in the catalog.

### ScoreBoardPage

Displays list of systems and their scores.

## Local environment

You would need the same prerequisites as for backstage (node.js,...). One component you would need is `http-server` that will provide the sample data for the plugin.

Navigate to the plugin directory `/plugins/score-card` and run `yarn start:dev`. Your local DEV environment will start: <http://localhost:3024/>.

## Unit testing

TBD

## Integration testing

This is being done as part of the backstage integration tests. See `/cypress/src/integration/score-card`.

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/score-card](http://localhost:3000/score-card).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
