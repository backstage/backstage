# Stack Overflow

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

If you have a private Stack Overflow instance and/or a private Stack Overflow Team you will need to supply an API key. You can read more about how to set this up by going to [Stack Overflow's Help Page](https://stackoverflow.help/en/articles/4385859-stack-overflow-for-teams-api).

A private Stack Overflow Team requires both an API key and an API Access Token. Step 3 ("Generate an Access Token via OAuth") from the previously mentioned Help Page explains the process for generating an API Access Token with no expiration.

```yaml
stackoverflow:
  baseUrl: https://api.stackexchange.com/2.2 # alternative: your internal stack overflow instance
  apiKey: $STACK_OVERFLOW_API_KEY
  apiAccessToken: $STACK_OVERFLOW_API_ACCESS_TOKEN
```

## Areas of Responsibility

This stack overflow backend plugin is primarily responsible for the following:

- Provides a `StackOverflowQuestionsCollatorFactory`, which can be used in the search backend to index stack overflow questions to your Backstage Search.

### Index Stack Overflow Questions to search

Before you are able to start index stack overflow questions to search, you need to go through the [search getting started guide](https://backstage.io/docs/features/search/getting-started).

When you have your `packages/backend/src/plugins/search.ts` file ready to make modifications, add the following code snippet to add the `StackOverflowQuestionsCollatorFactory`. Note that you can modify the `requestParams`.

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
