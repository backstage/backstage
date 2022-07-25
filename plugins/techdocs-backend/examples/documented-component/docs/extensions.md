# Plugins & Extensions

Just by including the TechDocs Core Plugin to your MkDocs site included with Backstage,
you gain the immediate use of a variety of popular plugins and extensions to MkDocs.

For more information and full details of the available features, see the
[`mkdocs-techdocs-core` repository](https://github.com/backstage/mkdocs-techdocs-core#mkdocs-plugins-and-extensions).

This page provides a demonstration of some of the available features.

## Admonitions

Admonitions are call outs that help catch a users attention.

To define an admonition simply put the following Markdown into your content:

```markdown
:::note{severity="error"}
Defining admonitions can be addicting.
:::
```

And they end up looking like this:

:::note{severity="error"}
This is an error alert — check it out!
:::

:::note{severity="warning"}
This is a warning alert — check it out!
:::

:::note{severity="info"}
This is an info alert — check it out!
:::

:::note{severity="success"}
This is a success alert — check it out!
:::

## PlantUML

You can create dynamic UML diagrams on the fly by just specifying flow via text,
using [PlantUML](https://pypi.org/project/plantuml-markdown/).

```plantuml format="svg" classes="uml myDiagram" alt="Backstage sample PlantUML" title="Backstage sample PlantUML" width="500px" height="250px"
User -> SCMProvider: stores
TechDocs -> SCMProvider: prepares
TechDocs -> TechDocs: generates
TechDocs -> CloudStorage: publishes
CloudStorage -> Backstage: displays
```

## Task Lists

Automatic rendering of Markdown task lists.

- [x] Phase 1
- [x] Phase 2
- [ ] Phase 3

## Math

Lift($L$) can be determined by Lift Coefficient ($C_L$) like the following
equation.

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

## Emojis

Very nice job on documentation! :thumbsup:

I've read a lot of documentation, but I love :heart: this document.

Weather: :sunny: :umbrella: :cloud: :snowflake:

Animals: :tiger: :horse: :turtle: :wolf: :frog:

## MDX truly sane lists

- attributes

- customer
  - first_name
    - test
  - family_name
  - email
- person
  - first_name
  - family_name
  - birth_date
- subscription_id

- request
