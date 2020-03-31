# Structure of a newly created plugin

Nice, you have a new plugin! We'll soon see how we can develop it into doing great things. But first off, let's look at what we get out of the box.

## Folder structure

The new plugin should look something like:

```
new-plugin/
    dist/
    node_modules/
    src/
        components/
            ExampleComponent/
                ExampleComponent.test.tsx
                ExampleComponent.tsx
                index.ts
            ExampleFetchComponent/
                ExampleFetchComponent.test.tsx
                ExampleFetchComponent.tsx
                index.ts
        index.ts
        plugin.test.ts
        plugin.ts
    jest.config.js
    jest.setup.ts
    package.json
    README.md
    tsconfig.json
```

You might note a thing or two. Yes, a plugin looks like a mini project on it's own with a `package.json` and a `src` folder. And this is because we want plugins to be separate packages. This makes it possible to ship plugins on npm and it lets you work on a plugin in isolation, without loading all the other plugins in a potentially big Backstage app.

The `index.ts` files are there to let us import from the folder path and not specific files. It's a way to have control over the exports in one file per folder.

## Base files

In the root folder you have some configuration for typescript and jest, the test runner. You get a readme to populate with info about your plugin and a package.json to declare the plugin dependencies, metadata and scripts.

## The plugin file

In the `src` folder we get to the interesting bits. Check out the `plugin.ts`:

```jsx
import { createPlugin } from '@backstage/core';
import ExampleComponent from './components/ExampleComponent';

export default createPlugin({
  id: 'new-plugin',
  register({ router }) {
    router.registerRoute('/new-plugin', ExampleComponent);
  },
});
```

This is where the plugin is created and where it hooks into the app by declaring what component should be shown on what url. See reference docs for [createPlugin(coming soon)](http://github.com/spotify/backstage/) or [router(coming soon)](http://github.com/spotify/backstage/).

## Components

The generated plugin includes two example components to showcase how we structure our plugins. There are usually one or multiple page components and next to them you can split up the UI in as many components as you feel like.

We have the `ExamplePage` to show an example Backstage page component. The `ExampleFetchComponent` show cases the common task of making an async request to a public API and plot the response data in a table using Material-UI components.

You may tweak these components, rename them and/or replace them completely.

## Connecting the plugin to the Backstage app

There are two things needed for a Backstage app to start making use of a plugin.

1. Add plugin as dependency in `app/package.json`
2. `import` plugin in `app/src/plugins.ts`

Luckily these two steps happen automatically when you create a plugin with the Backstage CLI.

[Back to Getting Started](README.md)
