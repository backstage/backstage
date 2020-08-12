# Extending the model

Backstage natively supports tracking of the following component
[`type`](descriptor-format.md)'s:

- Services
- Websites
- Libraries
- Documentation
- Other

![](bsc-extend.png)

Since these types are likely not the only kind of software you will want to
track in Backstage, it is possible to

It is possible to add your own software types that fits your organization's data
model. Inside Spotify our model has grown significantly over the years, and now
includes ML models, Apps, data pipelines and many more.

## Adding a new type

TODO: Describe what changes are needed to add a new type that shows up in the
catalog.

## The Other type

It might be tempting to put software that doesn't fit into any of the existing
types into Other. There are a few reasons why we advice against this; firstly,
we have found that it is preferred to match the conceptual model that your
engineers have when describing your sofware. Secondly, Backstage helps your
engineers manage their software by integrating the infratrucure tooling through
plugins. Different plugins are used for managing different types of components.

For example, the
[Lighthouse plugin](https://github.com/spotify/backstage/tree/master/plugins/lighthouse)
only makes sense for Websites. The more specific you can be in how you model
your software, the easier it is to provide plugins that are contextual.
