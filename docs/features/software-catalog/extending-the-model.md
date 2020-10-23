---
id: extending-the-model
title: Extending the model
description: Documentation on Extending the model
---

Backstage natively supports tracking of the following component
[`type`](descriptor-format.md)'s:

- Services
- Websites
- Libraries
- Documentation
- Other

![](../../assets/software-catalog/bsc-extend.png)

Since these types are likely not the only kind of software you will want to
track in Backstage, it is possible to add your own software types that fit your
organization's data model. Inside Spotify our model has grown significantly over
the years, and now includes ML models, Apps, data pipelines and many more.

## Adding a new type

To add a new type to the catalog, you need to:

1. Modify the component interface
2. Set the new type in your component (e.g., modify your `catalog-info.yaml`)

For example, to add a new type of iOS Application, first modify the `const tabs`
variable in `plugins/catalog/src/components/CatalogPage/CatalogPage.tsx` like
so:

```js
const tabs = useMemo<LabeledComponentType[]>(
    () => [
      {
        id: 'service',
        label: 'Services',
      },
      {
        id: 'website',
        label: 'Websites',
      },
      {
        id: 'library',
        label: 'Libraries',
      },
      {
        id: 'documentation',
        label: 'Documentation',
      },
      {
        id: 'other',
        label: 'Other',
      },
      {
        id: 'ios',
        label: 'iOS Applications'
      },
    ],
    [],
  );
```

Then in your `catalog-info.yaml`, you will define your type:

```yaml
spec:
  type: ios
```

## The Other type

It might be tempting to put software that doesn't fit into any of the existing
types into Other. There are a few reasons why we advise against this; firstly,
we have found that it is preferred to match the conceptual model that your
engineers have when describing your software. Secondly, Backstage helps your
engineers manage their software by integrating the infrastructure tooling
through plugins. Different plugins are used for managing different types of
components.

For example, the
[Lighthouse plugin](https://github.com/spotify/backstage/tree/master/plugins/lighthouse)
only makes sense for Websites. The more specific you can be in how you model
your software, the easier it is to provide plugins that are contextual.
