---
id: roadmap
title: Roadmap
description: Roadmap of Backstage
---

## The Backstage Roadmap

Backstage is still under rapid development, and this page details the project's
public roadmap. This not a complete list of all work happening in and around the
project, it only highlights the highest priority initiatives worked on by the
core maintainers.

## 2024 Fall Roadmap

The initiatives listed below are planned for release within the next half-year, starting in May 2024. The roadmap is updated every 6 months, and the next update is planned for November 2024.

### Backend System 1.0

The goal of this initiative is the stable 1.0 release of the [new backend system](../backend-system/index.md).
This includes ensuring that all documentation is up to date, and includes API
reviews and refactoring efforts to ensure that what is released is both stable
and evolvable. You can follow along with this work in the [meta issue](https://github.com/backstage/backstage/issues/24493).

As part of this initiative, there will also be an exploration on how to
simplify extension of backend services. It is not currently possible to augment
backend services through declarative integration, they are instead only
customizable through complete replacement. This also limits the ability to
modularize services and scale ownership of the implementations. The goal is to
provide a more flexible and scalable way to extend backend services.

### New Frontend System - Ready for Adoption

The [new fronted system](../frontend-system/index.md) still needs more work, and
the next milestone is to improve it to the point where there is enough
confidence in the design to start encouraging adoption in the community. You can
follow along with this work in the [meta issue](https://github.com/backstage/backstage/issues/19545).
This milestone also includes reaching and executing [rollout phase 2](https://github.com/backstage/backstage/issues/19545#issuecomment-1766069146).

Once the initial milestone is reached, the goal is to also build out broader
support for the new frontend system in the core plugins.

### Backstage Security Audit

This is the second security audit of the Backstage project. It is done together,
and with the support of the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/).
This time the audit will in particular focus on the recently introduced
[authentication system](https://github.com/backstage/backstage/tree/master/beps/0003-auth-architecture-evolution),
but also cover other parts of the project.

### Plugin Metadata

The goal of this initiative is to provide better machine readable metadata for
Backstage packages, available both at runtime, at build-time and as part of
package registries. We want to surface information such as what packages make up
a particular plugin, what features it provides, and more generally laying the
foundation for an evolvable plugin metadata system.

### MUI v5 Green-light

Material-UI v4 is still the officially supported version of MUI in Backstage.
While we have heard that adopters have had success using MUI 5, this is still an
untested path with known bugs. The goal of this initiative is to iron out any
remaining issues or gaps, and then provide a green light for migration to MUI 5.

### Configuration Improvements

This initiative aims to improve the configuration experience and reliability in
Backstage. Areas for improvement include the way that configuration schema is
loaded, the way that plugins access configuration that is not owned by them, how
plugins read configuration, and how configuration visibility is handled.

### Versioned Documentation

The goal of this initiative is to provide versioned documentation at
[backstage.io](https://backstage.io). This lets us provide documentation that is
both up-to-date while at the same time not ahead of the latest release.

### Rework Pull Request & Issue Process

Our current review and issue triage process is centered around either core- or
project area maintainers. The goal of this initiative is to make it simpler for
more members of the community to be involved and contribute to this process.

### Catalog Observability

The goal of this initiative is to provide better tools for debugging catalog
ingestion issues and to more generally reduce friction for setting up and
maintaining the software catalog.

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
[Discord](https://discord.gg/backstage-687207715902193673), or [book time](https://info.backstage.spotify.com/office-hours) with the Spotify team.
