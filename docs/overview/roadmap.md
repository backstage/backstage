---
id: roadmap
title: Roadmap
description: Roadmap of Backstage
---

## The Backstage Roadmap

Backstage is currently under rapid development. This page details the project’s
public roadmap, the result of ongoing collaboration between the core maintainers
and the broader Backstage community. Treat the roadmap as an ever-evolving guide
to keep us aligned as a community on:

- Upcoming enhancements and benefits,
- Planning contributions and support,
- Planning the project’s adoption,
- Understanding what things are coming soon,
- Avoiding duplication of work

### How to influence the roadmap

As we evolve Backstage, we want you to contribute actively in the journey to
define the most effective developer experience in the world.

A roadmap is only useful if it captures real needs. If you have success stories,
feedback, or ideas, we want to hear from you! If you plan to work (or are
already working) on a new or existing feature, please let us know, so that we
can update the roadmap accordingly. We are also happy to share knowledge and
context that will help your feature land successfully.

You can also head over to the
[CONTRIBUTING](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)
guidelines to get started.

If you have specific questions about the roadmap, please create an
[issue](https://github.com/backstage/backstage/issues/new/choose), ping us on
[Discord](https://discord.gg/awD6SxgQ), or
[book time](http://calendly.com/spotify-backstage) with the Spotify team.

### How to read the roadmap

The Backstage roadmap lays out both [“what’s next”](#whats-next) and
[“future work”](#future-work). With "next" we mean features planned for release
within the ongoing quarter starting in July until September 2021 included. With
"future" we mean features in the radar, but not yet scheduled.

The long-term roadmap (12 - 36 months) is not detailed in the public roadmap.
Third-party contributions are also not currently included in the roadmap. Let us
know about any ongoing developments and we’re happy to include it here as well.

### Roadmap evolution

Will this roadmap change? Obviously!

Roadmap are always evolving and ours is no different; you can expect to see this
updated roughly every month.

## What’s next

The feature set below is planned for the ongoing quarter, and grouped by theme.
The list order doesn’t necessarily reflect priority, and the development/release
cycle will vary based on maintainer schedules.

### Backstage Core

The following features are planned for release:

- **Composable homepage:** We’re seeing lots of interest from the community in
  reusable components to build a homepage experience where users can easily
  surface what they might find useful to start their tasks. Check out the
  [milestone](https://github.com/backstage/backstage/milestone/34) for further
  details.
- **Improved responsiveness:** Check out the
  [RFC here](https://github.com/backstage/backstage/issues/6318) for further
  details on how to improve the responsiveness for Backstage's UI.

### Software Templates

The following features are planned for release::

- **Re-creation/resubmission in case of failure:** Speed up productivity by
  allowing developers to relaunch a project after a failure or any unexpected
  problem. In the current version, this task requires retyping and a full
  re-creation from scratch.
- **Performance and usability improvements for contributors:** Reach a relevant
  improvement in templating's performance through the replacement of
  [handlebars](https://handlebarsjs.com/). Other replacements will be considered
  as part of this task (possibly
  [cookiecutter](https://cookiecutter.readthedocs.io/)) for easier software
  template creation, allowing more contributors to reach their goals without
  having to learn new tooling.
- **Improved extensibility through inclusion:** Make software templates more
  maintainable and extensible by adding `$include` support for parameters.
- **Authenticated job creation:** Created jobs will be able to run with an
  authenticated user with all actions tracked for future consumption and
  evidence. Track users creating jobs and make “jobs created by me” reporting
  available.

### Software Catalog

The following features are planned for release:

- **Request For Comments (RFC) for composability improvements (routing):**
  Enable plugins to be auto-added and make plugin installation and upgrades
  easier for all Backstage users. This includes information card layouts, entity
  pages containing content and hooking the external header, considering the
  support of a separate deployment, and configuration for plugins.
- **Removing duplicated entities in catalog:** As any adopter knows, a software
  catalog can contain thousands or more entities and it is very important to
  avoid duplications in naming to prevent failures. With this development task,
  two entities with the same name won't be allowed as described
  [here](https://github.com/backstage/backstage/issues/4760).
- **Connecting identity to ownership to prepare for role-based access control
  ([RBAC](https://en.wikipedia.org/wiki/Role-based_access_control)):** This is a
  first step to supporting RBAC for the software catalog (see the
  [future work section](#future-work) for further details). Provide each entity
  within the software catalog with a recognized owner.
- **Catalog performance improvements through improved caching:** Fix the
  performance gaps in the catalog processor, which currently doesn’t have a
  strong caching mechanism. The current version often requires fetching a
  relevant amount of data, especially at scale.

### Search

The following features are planned for release:

- ElasticSearch integration: Add ElasticSearch to the Search Platform as the
  underlying search engine. Check out the
  [milestone here](https://github.com/backstage/backstage/milestone/27) for
  further details.

### TechDocs

The following features are planned for release:

- **TechDocs beta release:** Fix remaining bugs to get TechDocs to Beta. Check
  out the [milestone here](https://github.com/backstage/backstage/milestone/29)
  for further details.

## Future work

The following feature list doesn’t represent a commitment to develop and the
list order doesn’t reflect any priority or importance. But these features are on
the maintainers’ radar, with clear interest expressed by the community.

- **Improved UX design:** Provide a better Backstage user experience through
  visual guidelines and templates, especially navigation across plug-ins and
  portal functionalities.
- **Catalog composability (routing):** Follow up development after the RFC
  planned for the ongoing quarter (see [what’s next](#whats-next) for further
  details).
- **Catalog-import improvements:** Provide a faster (scalability) and better
  (more features like move/rename) way to import entities into the Software
  Catalog. Importing items in the Software Catalog is crucial for creating a
  Backstage proof-of-concept or testing/planning for broader organizational
  adoption. This enhancement better supports getting developers to use Backstage
  with less effort and customization.
- **Catalog improvements:** Add pagination and sourcing to Software Catalog.
- **[GraphQL](https://graphql.org/) support:** Introduce the ability to query
  Backstage backend services with a standard query language for APIs.
- **Software templates performance improvements through decoupling a separate
  worker:** Improve performance through decoupling resource-consuming services
  and making them asynchronous. In the current version, project auto-creation
  through the Software Templating system can consume a lot of resources and
  bottleneck many concurrent projects created simultaneously.
- **API discovery and documentation:** Add better support for the
  [gRPC](https://grpc.io/).
- **Adding TechDocs search to the Search Platform:** Having this capability in
  place will provide a better and new major version of the Search Platform
  (v3.0). You can refer to the
  [milestone here](https://github.com/backstage/backstage/milestone/28) for
  further details.
- **TechDocs GA release:** Work toward enhancements necessary to get TechDocs to
  general availability. Check out the
  [milestone here](https://github.com/backstage/backstage/milestone/30) for
  further details.

## Completed milestones

Read more about the completed (and released) features for reference.

- [[Search] Out-of-the-Box Implementation (Alpha)](https://github.com/backstage/backstage/milestone/26)
- [Deploy a product demo at `demo.backstage.io`](https://demo.backstage.io)
- [Kubernetes plugin - v1](https://github.com/backstage/backstage/tree/master/plugins/kubernetes)
- [Helm charts](https://github.com/backstage/backstage/tree/master/contrib/chart/backstage)
- [Backstage Design System 💅](https://backstage.io/blog/2020/09/30/backstage-design-system)
- [Cost Insights plugin 💸](https://engineering.atspotify.com/2020/09/29/managing-clouds-from-the-ground-up-cost-engineering-at-spotify/)
- [Donate Backstage to the CNCF 🎉](https://backstage.io/blog/2020/09/23/backstage-cncf-sandbox)
- [TechDocs v1](https://backstage.io/blog/2020/09/08/announcing-tech-docs)
- [Plugin marketplace](https://backstage.io/plugins)
- [Improved and move documentation to backstage.io](https://backstage.io/docs/overview/what-is-backstage)
- [Backstage Software Catalog (alpha)](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)
- [Backstage Software Templates (alpha)](https://backstage.io/blog/2020/08/05/announcing-backstage-software-templates)
- [Make it possible to add custom auth providers](https://backstage.io/blog/2020/07/01/how-to-enable-authentication-in-backstage-using-passport)
- [TechDocs v0](https://github.com/backstage/backstage/milestone/15)
- CI plugins: CircleCI, Jenkins, GitHub Actions and TravisCI
- [Service API documentation](https://github.com/backstage/backstage/pull/1737)
- Backstage Software Catalog can read from: GitHub, GitLab,
  [Bitbucket](https://github.com/backstage/backstage/pull/1938)
- Support auth providers: Google, Okta, GitHub, GitLab,
  [auth0](https://github.com/backstage/backstage/pull/1611),
  [AWS](https://github.com/backstage/backstage/pull/1990)
