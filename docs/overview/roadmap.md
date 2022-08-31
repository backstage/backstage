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
the ongoing quarter from July through September 2022. With "future" we mean
features on the radar, but not yet scheduled.

| [What's next](#whats-next)                                                                                                                                                                                                                                          | [Future work](#future-work)                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Backend Services (MVP)](#backend-services-mvp) <br/> [Backstage Security Audit](#backstage-security-audit) <br/> [Backstage Threat Model](#backstage-threat-model) <br/> [Software Catalog pagination](#software-catalog-pagination) <br/> [More SIGs](#more-sigs) | Ease of onboarding <br/> Composable Homepage 1.0 <br/> Creator experience <br/> GraphQL <br/> Telemetry |

The long-term roadmap (12 - 36 months) is not detailed in the public roadmap.
Third-party contributions are also not currently included in the roadmap. Let us
know about any ongoing developments and we're happy to include them here as
well.

## What's next

The feature set below is planned for the ongoing quarter, and grouped by theme.
The list order doesn't necessarily reflect priority, and the development/release
cycle will vary based on maintainer schedules.

### Backend Services (MVP)

To better scale and maintain the Backstage instances, a backend services system
is planned to be introduced as part of the software architecture. This layer of
backend services will help in decoupling the various modules (e.g. Catalog and
Scaffolder) from the frontend experience.

After the experimentation and design happened in the past quarter, soon we plan to release a first version to start providing the first benefits to adopters and developers.

### Backstage Security Audit

This is the continuation of the initiative started in the previous quarters. This
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

### Backstage Threat Model

This is another (relevant) initiative planned to make Backstage a secure product for the adopters. The goals of this initiative are:

1. Understand where security investment and attention is needed.
2. Guide the upcoming security audit.
3. Communicate expectations to Backstage adopters and inform and attract security researchers.

The planned artifacts are:

- Concise high level threat model that will be included as part of the Backstage security documentation.
- Granular threat model created in conjunction with the security audit to inform further security investment areas for Backstage.

### Software Catalog pagination

Today adopters with a big catalog (with several thousands of software components) might not have an ideal end-user experience when viewing the `/catalog` page. The issue is related to how the entities are fetched by the frontend. In order to provide a better end-user experience the pagination of the catalog’s entities needs to be enforced. Some experimentation is already completed but in this quarter we plan to continue, and hopefully complete, this relevant enhancement.

### More SIGs

In the last quarter we launched the [Catalog SIG (Special Interest Group)](https://github.com/backstage/community/tree/main/sigs/sig-catalog) to better coordinate the increasing number of contributions to the project. We think that this is the proper path to follow to engage more with the contributors. For this reason we will launch other SIGs dedicated to the most interesting topics for the community.

## Future work

The following feature list doesn't represent a commitment to develop, and the
list order doesn't reflect any priority or importance, but these features are on
the maintainers' radar, with clear interest expressed by the community.

- **Ease of onboarding:** A faster (with less development) and easier setup of
  Backstage and the most relevant/adopted plugins.
- **Composable Homepage 1.0:** Driving this to 1.0 by adding some composable
  components.
- **Creator experience:** Provide a better Backstage user experience through
  visual guidelines and templates, especially navigation across plug-ins and
  portal functionalities.
- **[GraphQL](https://graphql.org/) support:** Introduce the ability to query
  Backstage backend services with a standard query language for APIs.
- **Telemetry:** To efficiently generate logging and metrics in such a way that
  adopters can get insights so that Backstage can be monitored and improved.

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
[Discord](https://discord.gg/qxsEfa8Vq8), or [book time](https://info.backstage.spotify.com/office-hours) with the Spotify team.
