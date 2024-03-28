---
title: CLI YAML Validation
status: provisional
authors:
  - '@drodil'
project-areas:
  - cli
creation-date: 2024-03-23
---

# BEP: CLI YAML Validation

[**Discussion Issue**](https://github.com/backstage/backstage/issues/23817)

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

This BEP proposes to add a new command to the Backstage CLI that will validate Backstage YAML files in a repository. This command will be useful for contributors to ensure that their changes are valid before submitting a pull request.

## Motivation

Currently, there is no way to validate the YAML files in the repositories containing Backstage entities. This can lead to errors that are only discovered after the changes have been merged and the entity has been imported to the Backstage instance by an entity provider. By adding a validation command to the CLI, contributors can ensure that their changes are valid before submitting a pull request.

Additionally, the validation command can be used in CI/CD pipelines to ensure that the YAML files are valid before merging changes to the main branch.

The main motivation for this BEP is to improve the developer experience and reduce the number of errors that occur when importing entities to the Backstage instance.

### Goals

- Add a new command to the Backstage CLI that can be used to validate the YAML files in the repository.
- The command should validate the YAML files against the JSON schema used by a Backstage instance. Backstage adopters should have possibility to provide their own JSON schema or extend the default Backstage schema to provide support for custom entity types, scaffolder actions, and additional fields.
- The functionality should cover all entity types, including templates and actions used in these templates, including the action parameters.
- The command should be able to validate multiple files at once.
- The command should provide a detailed error message if the validation fails, including the line number and the error message.
- It should be possible to develop IDE extension on top of the validator output.

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
