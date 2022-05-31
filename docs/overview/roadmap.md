---
id: roadmap
title: Roadmap
description: Roadmap of Backstage
---

## The Backstage Roadmap

Backstage is currently under rapid development. This page details the project's
public roadmap, the result of ongoing collaboration between the core maintainers
and the broader Backstage community.

The Backstage roadmap lays out both [“what's next”](#whats-next) and ["future
work"](#future-work). With "next" we mean features planned for release within
the ongoing quarter from April through June 2022. With "future" we mean
features on the radar, but not yet scheduled.

| [What's next](#whats-next)                                                                                                                                                                                                                                                                                                      | [Future work](#future-work)                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Ease of onboarding](#ease-of-onboarding) <br/> [Backstage Search 1.0](#search-1.0) <br/> [TechDocs Addon Framework](#techdocs-addon-framework) <br/> [Backend Services (initial)](#backend-services-initial) <br/> [Backstage Security Audit](#backstage-security-audit) <br/> [SIGs for contributors](#sigs-for-contributors) | Security Plan (and Strategy) <br/> Composable Homepage 1.0 <br/> GraphQL <br/> Telemetry <br/> Improved UX design |

The long-term roadmap (12 - 36 months) is not detailed in the public roadmap.
Third-party contributions are also not currently included in the roadmap. Let us
know about any ongoing developments and we're happy to include them here as
well.

## What's next

The feature set below is planned for the ongoing quarter, and grouped by theme.
The list order doesn't necessarily reflect priority, and the development/release
cycle will vary based on maintainer schedules.

### Ease of onboarding

A faster (with less development) and easier setup of a proof-of-concept
deployment, as part of the onboarding experience, has been a common and loud
suggestion from new adopters as well as analysts looking at Backstage.

With this initiative we plan to start facing this important topic with the most
commonly used and challenging tasks. More in particular we plan to reduce the
effort required to go from zero to production in installing and customizing
Backstage, as well as reducing the effort required to populate the Software
Catalog.

More iterations will be required in the following quarters, but this will be a
good improvement in the onboarding experience, especially for the benefit of new
adopters.

### Backstage Search 1.0

Fix the few remaining issues to get Backstage Search platform up to 1.0. For more information, see the [Backstage Search documentation and roadmap page](https://backstage.io/docs/features/search/search-overview).

### TechDocs Addon Framework

Addons are TechDocs features that are added on top of the base docs-like-code experience. An example would be a feature that showed comments on the page. We plan to add an Addon framework and open source a selection of the Addons that we use internally at Spotify. We encourage the Backstage community to add further Addons.

For more information about the TechDocs Addon Framework, see the documentation page [here](https://backstage.io/docs/features/techdocs/addons)

For general information about TechDocs including roadmap, see [here](https://backstage.io/docs/features/techdocs/techdocs-overview).

### Backend Services (initial)

To better scale and maintain the Backstage instances, a backend services system
is planned to be introduced as part of the software architecture. This layer of
backend services will help in decoupling the various modules (e.g. Catalog and
Scaffolder) from the frontend experience.

In this quarter we plan to start designing the new architecture, together with
the first experimentation and development of the software components.

### Backstage Security Audit

This is the continuation of the initiative started in the previous quarter. This
quarter will see the publication of the report describing the outcome of the
audit, together the first fixes and the development of some of the changes
required to address the vulnerabilities.

This initiative is the first of a broader Security Strategy for Backstage. The
purpose of the Security Audit is to involve third-party companies in auditing
the platform. The benefit for the adopters is clear: we want Backstage to be as
secure as possible, and we want to make it reliable through a specific
initiative.

This initiative is done together with, and with the support of, the [Cloud
Native Computing Foundation (CNCF)](https://www.cncf.io/).

### SIGs for contributors

The request to better coordinate the increasing number of contributions coming
from the various adopters' developers is loud and clear. We think that the
community is mature enough to start launching the SIGs (Special Interest Groups)
following the successful model of Kubernetes.

## Future work

The following feature list doesn't represent a commitment to develop, and the
list order doesn't reflect any priority or importance, but these features are on
the maintainers' radar, with clear interest expressed by the community.

- **Security Plan (and Strategy):** The purpose of the Security Strategy is to
  move another step along the path to maturing the platform, setting the
  expectations of any adopters from a security standpoint.
- **Composable Homepage 1.0:** Driving this to 1.0 by adding some composable
  components.
- **[GraphQL](https://graphql.org/) support:** Introduce the ability to query
  Backstage backend services with a standard query language for APIs.
- **Telemetry:** To efficiently generate logging and metrics in such a way that
  adopters can get insights so that Backstage can be monitored and improved.
- **Improved UX design:** Provide a better Backstage user experience through
  visual guidelines and templates, especially navigation across plug-ins and
  portal functionalities.

## How to influence the roadmap

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
[Discord](https://discord.gg/qxsEfa8Vq8), or [book
time](http://calendly.com/spotify-backstage) with the Spotify team.
