---
title: Supporting templating syntax in `parameters` schema
status: provisional
authors:
  - '@benjdlambert'
owners:
  - '@benjdlambert'
  - '@backstage/scaffolder-maintainers'
project-areas:
  - scaffolder
creation-date: 2024-03-26
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Supporting templating syntax in `parameters` schema

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/16275)

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

This BEP proposes to add support for templating syntax in the `parameters` schema of a scaffolder template.
This will allow users to define properties in the JSON Schema which are templated from current values that have been collected from the user already.
This can be useful when you want to use a value that has already been collected as a default value in another field.

For example:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: my-template
spec:
  parameters:
    - title: Some input
      description: Get some info from the user
      properties:
        name:
          type: string
          default: Test
        description:
          type: string
          default: ${{ parameters.name or "unknown" }}-description
```

## Motivation

<!--
This section is for explicitly listing the motivation, goals, and non-goals of
this BEP. Describe why the change is important and the benefits to users.
-->

Inclusive of the initial RFC there's been a swarm of issues that are requesting this feature, and we want to align on the implementation and design of this feature.

See the following:

- https://github.com/backstage/backstage/issues/16275
- https://github.com/backstage/backstage/pull/23283
- https://github.com/backstage/backstage/issues/19597
- https://github.com/backstage/backstage/issues/20533
- https://github.com/backstage/backstage/pull/17746

There's some ideas for introducing a templating syntax for both templating into the `parameters` schema, and also being able to pass through some templating strings to underlying field extensions that can use those templating strings.
We want to align here so that we're not going to have those conflict or compete, and create a standard for how to achieve templating in both circumstances.

### Goals

<!--
List the specific goals of the BEP. What is it trying to achieve? How will we
know that this has succeeded?
-->

- This BEP will settle the implementation for the templating of fields into the JSON Schema in the `parameters` section in the scaffolder templates.
- This BEP will settle how to pass through templating strings to underlying field extensions in a non-conflicting way.

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
