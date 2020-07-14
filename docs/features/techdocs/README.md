# TechDocs Documentation

## What is it?

Intro, backstory, etc.

## Structure

- [Getting Started]
- [Concepts]
- [Reading Documentation]
- [Writing Documentation]
- [Publishing Documentation]
- [Contributing]
- [Debugging]
- [FAQ]

## Tech Stack

| Stack                                       | Location                                                 |
| ------------------------------------------- | -------------------------------------------------------- |
| Frontend                                    | [`@backstage/plugin-techdocs`][techdocs/frontend]        |
| Backend                                     | [`@backstage/plugin-techdocs-backend`][techdocs/backend] |
| Docker Container (for generating doc sites) | [`packages/techdocs-container`][techdocs/container]      |
| CLI (for local development)                 | [`packages/techdocs-cli`][techdocs/cli]                  |

[getting started]: getting-started.md
[concepts]: concepts.md
[reading documentation]: reading-documentation.md
[writing documentation]: writing-documentation.md
[publishing documentation]: publishing-documentation.md
[contributing]: contributing.md
[debugging]: debugging.md
[faq]: FAQ.md 'Frequently asked questions'
[techdocs/frontend]:
  https://github.com/spotify/backstage/blob/master/plugins/techdocs
[techdocs/backend]:
  https://github.com/spotify/backstage/blob/master/plugins/techdocs-backend
[techdocs/container]:
  https://github.com/spotify/backstage/blob/master/packages/techdocs-container
[techdocs/cli]:
  https://github.com/spotify/backstage/blob/master/packages/techdocs-cli
