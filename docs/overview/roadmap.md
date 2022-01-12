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
within the ongoing quarter from January through March 2022. With
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

### Backstage 1.0 (and following versions)

During the first quarter of 2022 we plan to be finalize and release
version 1.0 of the Backstage platform (defined by the Core,
[Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview),
[Scaffolder](https://backstage.io/docs/features/software-templates/software-templates-index)
and [TechDocs](https://backstage.io/docs/features/techdocs/techdocs-overview)).
Included as part of this milestone:

- The cadence of minor/weekly/daily releases to provide clarity on the frequency
  and expectations for future versions of the platform and its defining modules.
- The support model to set the expectations from the adopters in their
  respective use cases.

### Backstage Security Audit

This initiative is the first of a broader Security Strategy for Backstage. The
purpose of the Security Audit is to involve third party companies in auditing
the platform and highlighting potential vulnerabilities (if there are any). The
benefit for the adopters is clear: we want Backstage to be as much secure as
possible and we want to make it reliable through a specific initiative. This
initiative in particular is done together (and with the support of) the
[Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/).

### Moving to Incubation in CNCF

The progress of the request can be seen
[here](https://github.com/cncf/toc/pull/717).

## Future work

The following feature list doesn’t represent a commitment to develop and the
list order doesn’t reflect any priority or importance. But these features are on
the maintainers’ radar, with clear interest expressed by the community.

- **Backend Services:** To better scale and maintain the Backstage instances, a
  backend layer of services is planned to be introduced as part of the software
  architecture. This layer of backend services will help in decoupling the
  various modules (Catalog and Scaffolder just to quote some) from the front-end
  experience.
- **Security Plan (and Strategy):** The purpose of the Security Strategy is to
  move another step ahead along the path of the maturity of the platform,
  setting the expectations of any adopters from a security point.
- **Search GA:**.
- **[GraphQL](https://graphql.org/) support:** Introduce the ability to query
  Backstage backend services with a standard query language for APIs.
- **Telemetry:** To efficiently collect, store and analyse system and
  application log data so that Backstage can be monitored and improved.
- **Improved UX design:** Provide a better Backstage user experience through
  visual guidelines and templates, especially navigation across plug-ins and
  portal functionalities.

## Completed milestones

Read more about the completed (and released) features for reference.

- [[Search] ElasticSearch integration](https://backstage.io/docs/features/search/search-engines#elasticsearch)
- [[Search] TechDocs search capabilities](https://backstage.io/docs/features/search/how-to-guides#how-to-index-techdocs-documents)
- [TechDocs Beta](https://backstage.spotify.com/blog/product-updates/techdocs-beta-has-landed)
- [[Home] Composable homepage](https://github.com/backstage/backstage/milestone/34)
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

- [Donate Backstage to the CNCF 🎉](https://backstage.io/blog/2020/09/23/backstage-cncf-sandbox)
- [TechDocs v1](https://backstage.io/blog/2020/09/08/announcing-tech-docs)
- [Plugin marketplace](https://backstage.io/plugins)
- [Improved and move documentation to backstage.io](https://backstage.io/docs/overview/what-is-backstage)
- [Backstage Software Catalog (alpha)](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)
- [Backstage Software Templates (beta)](https://backstage.io/blog/2021/07/26/software-templates-are-now-in-beta)
- [Make it possible to add custom auth providers](https://backstage.io/blog/2020/07/01/how-to-enable-authentication-in-backstage-using-passport)
- [TechDocs v0](https://github.com/backstage/backstage/milestone/15)
- CI plugins: CircleCI, Jenkins, GitHub Actions and TravisCI
- [Service API documentation](https://github.com/backstage/backstage/pull/1737)
- Backstage Software Catalog can read from: GitHub, GitLab,
  [Bitbucket](https://github.com/backstage/backstage/pull/1938)
- Support auth providers: Google, Okta, GitHub, GitLab,
  [auth0](https://github.com/backstage/backstage/pull/1611),
  [AWS](https://github.com/backstage/backstage/pull/1990)
