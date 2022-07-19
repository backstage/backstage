# Stack Overflow

A plugin that provides stack overflow specific functionality that can be used in different ways (e.g. for homepage and search) to compose your Backstage App.

## Getting started

Before we begin, make sure:

- You have created your own standalone Backstage app using @backstage/create-app and not using a fork of the backstage repository. If you haven't setup Backstage already, start [here](https://backstage.io/docs/getting-started/).

To use any of the functionality this plugin provides, you need to start by configuring your App with the following config:

```yaml
stackoverflow:
  baseUrl: https://api.stackexchange.com/2.2 # alternative: your internal stack overflow instance
```

## Areas of Responsibility

This stack overflow frontend plugin is primarily responsible for the following:

- Exposing various stack-overflow related components like `<StackOverflowSearchResultListItem />` which can be used for composing the search page, and `<HomePageStackOverflowQuestions/>` which can be used for composing the homepage.

#### Use specific search result list item for Stack Overflow Question

> Note: For Stack Overflow specific search results to be returned, it needs to be indexed. Use the [stack-overflow-backend plugin](https://github.com/backstage/backstage/blob/master/plugins/stack-overflow-backend/README.md) to index Stack Overflow Questions to search.

When you have your `packages/app/src/components/search/SearchPage.tsx` file ready to make modifications, add the following code snippet to add the `StackOverflowSearchResultListItem` when the type of the search results are `stack-overflow`.

```tsx
 case 'stack-overflow':
  return (
    <StackOverflowSearchResultListItem
      key={document.location}
      result={document}
    />
  );
```

#### Use Stack Overflow Questions on your homepage

Before you are able to add the stack overflow question component to your homepage, you need to go through the [homepage getting started guide](https://backstage.io/docs/getting-started/homepage). When its ready, add the following code snippet to your `packages/app/src/components/home/HomePage.tsx` file.

```tsx
<Grid item xs={12} md={6}>
  <HomePageStackOverflowQuestions
    requestParams={{
      tagged: 'backstage',
      site: 'stackoverflow',
      pagesize: 5,
    }}
  />
</Grid>
```
