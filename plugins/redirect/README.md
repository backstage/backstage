# Redirects

This plugin allows you to define basic, client-side redirects for your
Backstage instance via app config. Redirects merely require a `from` and a `to`
value, and values may contain route parameters as well as `*`.

## Installation

1. Use `yarn` or `npm` to install this plugin `@backstage/plugin-redirects`
2. Import the `<Redirects />` component from this plugin in your `App.tsx` file
   like so: `import { Redirects } from '@backstage/plugin-redirect';`
3. Add the `<Redirects />` component as a child of `<AppRouter>`, and a sibling
   of `<Root>`.
4. Add redirect configurations to your `app-config.yaml`, like so:

```yaml
redirects:
  patterns:
    - from: '/old/path'
      to: '/new/path'
```

## Usage

For simple, single-page redirects, just set `from` and `to` as the exact paths
you wish to redirect from/to:

```yaml
redirects:
  patterns:
    - from: '/old-path'
      to: '/new-path'
```

If you wish to redirect all sub-paths from a given path, you can use the `*`
character at the end of both your `from` and `to` keys, like so:

```yaml
redirects:
  patterns:
    - from: '/docs/default/Component/solr-searcher/*'
      to: '/docs/default/Component/elastic-searcher/*'
```

You may also use route parameters in your redirect definition if, for example,
you wish to redirect a single view for all instances of a given set of
parameters.

```yaml
redirects:
  patterns:
    - from: '/catalog/:namespace/:kind/:name/diy-ci'
      to: '/catalog/:namespace/:kind/:name/circle-ci'
```
