---
title: Resolving Conflicts in Component Imports from Various Sources
status: provisional
authors:
  - '@nuritizra'
owners:
  - '@backstage/catalog-maintainers'
project-areas:
  - catalog
creation-date: 2024-04-16
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: <!-- Your short, descriptive title -->

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

The proposed BEP aims to enhance the user experience and optimize the import process for components into the catalog from various entity providers. The primary objective is to minimize conflicts and errors caused by duplicate repository imports while ensuring a streamlined workflow. Currently, when a user registers a new component in the catalog, the repository's location URL (e.g., GitHub) is stored in the entity. However, conflicts may arise if the user attempts to import multiple components from different entity providers, such as GitLab, with the same repository. These conflicts can lead to errors, requiring manual resolution by the user. The BEP seeks to address this challenge by implementing measures to automatically manage conflicts and ensure seamless integration of components from different providers, ultimately enhancing the efficiency and reliability of the catalog system.

## Motivation

The motivation behind this BEP stems from the pressing need to enhance the user experience and optimize the import process within the catalog system. Currently, users encounter challenges when importing components from various entity providers, particularly when duplicate repository imports lead to conflicts and errors. This issue not only disrupts the workflow but also places the burden of resolution squarely on the user.

### Goals

- Develop a solution to mitigate conflicts and errors arising from duplicate repository imports within the catalog system.

### Non-Goals

- This BEP does not aim to completely restructure or redesign the import process within the catalog system.

## Proposal

One potential solution is to prioritize trust in manual entries. Since a user invests their time to manually register a component, it's likely to be accurate. For other entity providers not handling manual imports, we can implement a system where the latest import run overrides the location. For instance, if the GitHub entity provider imports a component with a GitHub location URL, and then the next day the GitLab entity provider attempts to import the same component, the location URL of that entity will be overwritten by the GitLab import.

## Design Details

<!--
This section should contain enough information that the specifics of your
change are understandable. This may include API specs or even code snippets.
If there's any ambiguity about HOW your proposal will be implemented, this is the place to discuss them.
-->

## Release Plan

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
