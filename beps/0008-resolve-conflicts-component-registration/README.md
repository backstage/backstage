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

The catalog discovery feature is not functioning correctly, resulting in users updating their catalog-info.yaml file without any effect. This issue may arise due to conflicts between old and new providers, providers sourced from different origins, or a manually registered location that is no longer being processed conflicting with a provider.

Where is this in the code: 

Starting point for entity provider mutations in the catalog codebase is [applyMutation](https://github.com/backstage/backstage/blob/89035a0f58c50d4ae540fd7ced43fbfb383c1015/plugins/catalog-backend/src/processing/connectEntityProviders.ts#L40), then [replaceUnprocessedEntities](https://github.com/backstage/backstage/blob/d5a1fe189b6a8a7471935ccf5f5ed7be650fe649/plugins/catalog-backend/src/database/DefaultProviderDatabase.ts#L75), with conflicts being detected [here](https://github.com/backstage/backstage/blob/d5a1fe189b6a8a7471935ccf5f5ed7be650fe649/plugins/catalog-backend/src/database/DefaultProviderDatabase.ts#L182-L186), but the DB logic for not writing on conflict being in [updateUnprocessedEntity](https://github.com/backstage/backstage/blob/f9f4f87a78f0b4ab6d6d0a4080f9cc00dda00ef8/plugins/catalog-backend/src/database/operations/refreshState/updateUnprocessedEntity.ts#L51-L56) and [insertUnprocessedEntity](https://github.com/backstage/backstage/blob/d5a1fe189b6a8a7471935ccf5f5ed7be650fe649/plugins/catalog-backend/src/database/operations/refreshState/insertUnprocessedEntity.ts#L57).

Some possible solutions:

* Users have the option to set various priorities for individual entity providers.
* We can implement functionality enabling users to perform manual conflict resolution. Specifically, we can establish a rule prioritizing trust in manual entries, ensuring that once a manual entry exists, its location cannot be overridden regardless of when it was made.
* Furthermore, we can integrate logic to remove entities from unknown providers. For instance, if a company decides to migrate and no longer utilize EntityProvider X, we can remove entities associated with that provider before migrating to the new one.

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
