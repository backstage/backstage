# Plugins & Extensions

Just by including the TechDocs Core Plugin to your MkDocs site included with Backstage,
you gain the immediate use of a variety of popular plugins and extensions to MkDocs.

For more information and full details of the available features, see the
[`mkdocs-techdocs-core` repository](https://github.com/backstage/mkdocs-techdocs-core#mkdocs-plugins-and-extensions).

This page provides a demonstration of some of the available features.

## Admonitions

Admonitions are call outs that help catch a users attention.

To define an admonition simply put the following Markdown into your content:

```
!!! warn
    Defining admonitions can be addicting.
```

And they end up looking like this:

<!-- prettier-ignore -->
!!! warn
    Defining admonitions can be addicting.

<!-- prettier-ignore -->
!!! note
    You can learn a lot about TechDocs by just visiting the Backstage web site at
    https://backstage.io/docs.

<!-- prettier-ignore -->
!!! info
    TechDocs is the core feature that supports documentation as code in Backstage.

<!-- prettier-ignore -->
!!! tip
    Don't forget to spell check your documentation.

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

## Pymdownx Extensions

Pymdownx (Python Markdown extensions) are a variety of smaller additions.

### Details

<!-- prettier-ignore -->
??? note "What is the answer to life, the universe, and everything? (click me for the answer)"
    The answer is 42.

<!-- prettier-ignore -->
??? note "What is 4 plus 4?"
    The answer is 8.

<!-- prettier-ignore -->
???+ note "How do I get support?"
    You can get support by opening an issue in this repository. This detail is open by default
    so it's more easily visible without requiring the user to click to open it.

### Task Lists

Automatic rendering of Markdown task lists.

- [x] Phase 1
- [x] Phase 2
- [ ] Phase 3

### Emojis

Very nice job on documentation! :thumbsup:

I've read a lot of documentation, but I love :heart: this document.

Weather: :sunny: :umbrella: :cloud: :snowflake:

Animals: :tiger: :horse: :turtle: :wolf: :frog:

### MDX truly sane lists

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
