# TechDocs Documentation

## What is it?

<!-- Intro, backstory, etc.: -->

Wait, what is TechDocs? TechDocs is Spotify’s homegrown docs-like-code solution
built directly into Backstage. Today, it is now one of the core products in
Spotify’s developer experience offering with 2,400+ documentation sites and
1,000+ engineers using it daily.

## Features

- A centralized place to discover documentation.

- A clear end-to-end docs-like-code solution. (_Coming soon in V.1_)

- A tightly coupled feedback loop with the developer workflow. (_Coming soon in
  V.2_)

- A developer ecosystem for creating extensions. (_Coming soon in V.2_)

## Project roadmap

| Version                 | Description                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [TechDocs V.0 ✅][v0]   | Read docs in Backstage - Enable anyone to get a reader experience working in Backstage.                                  |
| [TechDocs V.1 🚧][v1]   | TechDocs end to end - First and minimum release of TechDocs that you can use end to end - and contribute to.             |
| [TechDocs V.2 🔮⌛][v2] | Widget Architecture - TechDocs widget architecture available, so the community can create their own customized features. |

[v0]: https://github.com/spotify/backstage/milestone/15
[v1]: https://github.com/spotify/backstage/milestone/16
[v2]: https://github.com/spotify/backstage/milestone/17

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
[publishing documentation]: writing-and-publishing.md
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
