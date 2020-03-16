# Architecture and Terminology

Backstage is constructed out of three parts. We separate Backstage in this way because we see three groups of contributors that work with Backstage in three different ways.

- Core - Base functionality built by core devs in the open source project.
- App - The app is an instance of a Backstage app that is deployed and tweaked. The app ties together core functionality with additional plugins. The app is built and maintained by app developers, usually a productivity team within a company.
- Plugins - Additional functionality to make your Backstage app useful for your company. Plugins can be specific to a company or open sourced and reusable. At Spotify we have over 100 plugins built by over 50 different teams. It has been very powerful to get contributions from various infrastructure teams added into a single unified developer experience.

[Back to Docs](README.md)
