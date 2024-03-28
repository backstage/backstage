# Stack Overflow Search Backend Module

A plugin that provides stack overflow specific functionality that can be used in different ways (e.g. for search) to compose your Backstage App.

## Getting started

Before we begin, make sure:

- You have created your own standalone Backstage app using @backstage/create-app and not using a fork of the backstage repository. If you haven't setup Backstage already, start [here](https://backstage.io/docs/getting-started/).

To use any of the functionality this plugin provides, you need to start by configuring your App with the following config:

```yaml
stackoverflow:
  baseUrl: https://api.stackexchange.com/2.2 # alternative: your internal stack overflow instance
```

### Stack Overflow for Teams

If you have a private Stack Overflow instance and/or a private Stack Overflow Team you will need to supply an API key or Personal Access Token. You can read more about how to set this up by going to [Stack Overflow's Help Page](https://stackoverflow.help/en/articles/4385859-stack-overflow-for-teams-api).

The existing API key approach remains the default, to support the new v2.3 API and PAT authentication model you need to pass the team name and the new PAT into the existing apiAccessToken parameter to the new URL. See [15770](https://github.com/backstage/backstage/issues/15770) for more details.

```yaml
stackoverflow:
  baseUrl: https://api.stackexchange.com/2.2 # alternative: your internal stack overflow instance
  apiKey: $STACK_OVERFLOW_API_KEY
  apiAccessToken: $STACK_OVERFLOW_API_ACCESS_TOKEN
```

```yaml
stackoverflow:
  baseUrl: https://api.stackoverflowteams.com/2.3 # alternative: your internal stack overflow instance
  teamName: $STACK_OVERFLOW_TEAM_NAME
  apiAccessToken: $STACK_OVERFLOW_API_ACCESS_TOKEN
```

## Areas of Responsibility

This stack overflow backend plugin is primarily responsible for the following:

- Provides a `StackOverflowQuestionsCollatorFactory`, which can be used in the search backend to index stack overflow questions to your Backstage Search.

### Index Stack Overflow Questions to search

Before you are able to start index stack overflow questions to search, you need to go through the [search getting started guide](https://backstage.io/docs/features/search/getting-started).

When you have your `packages/backend/src/plugins/search.ts` file ready to make modifications, add the following code snippet to add the `StackOverflowQuestionsCollatorFactory`. Note that you can optionally modify the `requestParams`, otherwise it will defaults to `{ order: 'desc', sort: 'activity', site: 'stackoverflow' }` as done in the `Try It` section on the [official Stack Overflow API documentation](https://api.stackexchange.com/docs/questions).

> Note: if your `baseUrl` is set to the external stack overflow api `https://api.stackexchange.com/2.2`, you can find optional and required parameters under the official API documentation under [`Usage of /questions GET`](https://api.stackexchange.com/docs/questions)

```ts
indexBuilder.addCollator({
  schedule,
  factory: StackOverflowQuestionsCollatorFactory.fromConfig(env.config, {
    logger: env.logger,
    requestParams: {
      tagged: ['backstage'],
      site: 'stackoverflow',
      pagesize: 100,
    },
  }),
});
```

## New Backend System

This package exports a module that extends the search backend to also indexing the questions exposed by the [`Stack Overflow` API](https://api.stackexchange.com/docs/questions).

### Installation

Add the module package as a dependency:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-stack-overflow-collator
```

Add the collator to your backend instance, along with the search plugin itself:

```tsx
// packages/backend/src/index.ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();
backend.add(import('@backstage/plugin-search-backend/alpha'));
backend.add(
  import('@backstage/plugin-search-backend-module-stack-overflow-collator'),
);
backend.start();
```

You may also want to add configuration parameters to your app-config, for example for controlling the scheduled indexing interval. These parameters should be placed under the `stackoverflow` key. See [the config definition file](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-stack-overflow-collator/config.d.ts) for more details.
