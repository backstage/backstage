---
title: Scaffolder Action Rollback
status: provisional
authors:
  - 'bnechyporenko@bol.com'
  - 'benjaminl@spotify.com'
owners:
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2024-03-13
---

# BEP: <!-- Your short, descriptive title -->

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

Introducing the rollback to scaffolder actions provides the mean to come back to the initial state.

## Motivation

The aim is to help to mitigate the issue of manual clean up the partially created resources.

### Goals

- We will extend action's API to be able to run rollback for failed tasks
- Rollback will be optional

### Non-Goals

We will not cover all built-in actions with a rollback functionality

## Proposal

Rollback is going to be performed:

- when user manually decide to perform this action.
- task has to be recovered and TaskRecoverStrategy set to 'rollback'

## Design Details

We are going to introduce an extra function in action API which will look like:

```typescript
const createPublishGitHubAction = createTemplateAction({
  id: 'publish:github',
  async handler() {},
  async rollback() {},
});
```

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
