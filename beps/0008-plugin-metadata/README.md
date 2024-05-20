---
title: Plugin Metadata
status: provisional
authors:
  - '@Rugvip'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: yyyy-mm-dd
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Plugin Metadata

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

## Motivation

All Backstage adopters benefit from it being easy to find, install, configure, and validate the setup of plugins and modules. That's regardless of whether one is only using a minimal set of core plugins, or installing a large number of 3rd party features from the Backstage ecosystem. This proposal aims to build upon our [existing package metadata](https://backstage.io/docs/tooling/cli/build-system#package-roles) to introduce a new set of standardized fields that plugins can use to provide additional information about themselves.

This metadata will be used to improve tooling in an around Backstage, such as providing better validation and more powerful utilities in the Backstage CLI, and the more information to be surfaced in association with plugins for better discoverability.

### Goals

We want to provide a new set of standardized fields that makes it possible to build tooling that improves the following interactions with the Backstage ecosystem:

- Browsing packages related to a plugin, i.e. listing all available library packages and frontend/backend variants of a specific plugin.
- Discoverability of plugin modules. Given a plugin you should be able to identify all of its modules.

Furthermore this proposal should also lay the foundation for how we define additional metadata fields in the future. How they are validate, documented, and surfaced in the Backstage ecosystem.

In relation to the above, this proposal will aim to define what existing `package.json` fields are known in the Backstage ecosystem, and what their purpose is. This will help avoid duplication of fields, and aim to reduce metadata fragmentation.

Where appropriate, this new metadata will be made required for all packages that are published using Backstage's tooling. This will ensure that packages across the ecosystem are consistent in how they provide metadata. This requirement should not be unnecessarily strict, ideally only requiring fields that either have sensible defaults or that can be inferred from workspace content.

These goals must all be reached in a way that does not risk intentional or unintentional disruption of the metadata. For example it should not be possible for an unrelated package to claim to be part of a group of plugin packages that it is not part of.

### Non-Goals

The surfacing of extensive implementation metadata is not in scope for this proposal. This includes for example the extension point and extensions exported by a plugin, what route references a frontend plugin has, or what API endpoints a backend plugin exposes.

This proposal will not aim to standardize any other fields that are not included in the above [goals](#goals). It will provide the foundation for how to define such fields, but not the fields themselves. This includes any informational fields such as package lifecycle or usage, but also fields that provide functional requirements, such as plugin dependencies or environment restrictions.

This proposal does not aim to provide any direct solution for plugin support metadata as proposed in [#10256](https://github.com/backstage/backstage/pull/10256). Many of the fields defined as followups to this proposal may cover the support metadata use-case, but what is also important for such a solution is to be able to provide local overrides for the metadata, which this proposal does not cover. We do however want to make sure that this use-case is taken into consideration when defining new metadata fields.

## Proposal

The proposal is split into separate sections, each contributing to the overall solution in different ways.

### Validation & Automation

The purpose of this section is to define how we make it as simple as possible to populate the metadata fields, and how we ensure that the metadata is present and correct.

Validation and automation is split into two separate phases. The first is phase is manual tooling that is run by the developer and typically validated in CI, for example the `backstage-cli fix` command. The second phase is validation at the time of publishing the package, which is done by the `yarn prepack` command. By splitting the tooling into these two phases we can ensure that a minimal set of metadata is present for all packages published using the Backstage tooling, but at the same time avoid adding unnecessary friction to the development process.

An important aspect to take into consideration is that most Backstage packages are never published to NPM, as they're part of an internal monorepo and get built directly into an internal Backstage application. Defining the full set of metadata for these packages is likely to be wasteful, which means we

### Package Relationships

### Package Metadata Documentation

## Design Details

Light validation done in `yarn prepack` to ensure that metadata is present and correct.

### References & Prior Art

The following resources have been used to inform this proposal:

- [package.json documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [VSCode Extensions](https://code.visualstudio.com/api/references/extension-manifest)

## Release Plan

Assuming that the required fields can be populated with minimal effort

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

## Dependencies

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

<!--
What other approaches did you consider, and why did you rule them out? These do
not need to be as detailed as the proposal, but should include enough
information to express the idea and why it was not acceptable.
-->
