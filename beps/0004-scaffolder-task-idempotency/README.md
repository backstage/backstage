---
title: Scaffolder Task Idempotency
status: provisional
authors:
  - 'benjaminl@spotify.com'
  - 'patriko@spotify.com'
  - 'freben@gmail.com'
  - 'bnechyporenko@bol.com'
owners:
project-areas:
  - scaffolder
creation-date: 2024-01-31
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: <!-- Your short, descriptive title -->

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/22590)

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

Scaffolder task idempotency provides the means to make each action of the task idempotent. By default, an action is not considered to be idempotent.
It has to be crafted to a solution when action can be re-run multiple times and giving the same effect as it had been run only once.

## Motivation

The aim is to make task engine more reliable in terms of system crash or redeployment. If the task engine is in process of executing
tasks and system stops, after restart task engine will restore all such tasks and continue their execution.  
Another purpose is to make it possible to manually retry the task from the last failed step.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

- provide a checkpoint functionality which can be used in task actions
- make built-in actions idempotent
- enhance task UI with a possibility to retry the failed task from the last failed step
- preserve a workspace till task succeeded or archived

### Non-Goals

<!--
What is out of scope for this BEP? Listing non-goals helps to focus discussion
and make progress.
-->

## Proposal

<!--
This is where we get down to the specifics of what the proposal actually is.
This should have enough detail that reviewers can understand exactly what
you're proposing, but should not include things like API designs or
implementation.
-->

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
