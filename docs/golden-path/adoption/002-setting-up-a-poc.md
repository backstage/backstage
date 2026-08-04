---
id: setting-up-a-poc
sidebar_label: 002 - Build a focused PoC
title: Build a focused PoC
description: Create a small Backstage experiment that can produce useful evidence
---

A proof of concept (PoC) tests whether Backstage can improve the problem defined
in the previous stage. It is not a production launch or a demonstration of
every Backstage feature.

**Decision prompt:** Can this experiment produce useful evidence?

## Define the experiment

Before implementation starts, agree on:

- **Problem:** The developer or platform-team problem being tested.
- **Cohort:** A small group that experiences the problem and can participate in
  the review.
- **Baseline:** What happens today, measured through time, completion, support
  demand, observation, or repeated feedback.
- **Expected result:** The change that would make the experiment informative.
- **Scope:** The smallest catalog content, integration, or workflow needed to
  test the idea.
- **Review date:** When the group will compare the result with the baseline.

Choose participants who will challenge the idea constructively. Early
enthusiasts make collaboration easier, but the cohort should still represent
constraints that a wider group would face.

## Separate product and technical responsibilities

The adoption lead defines the problem, cohort, evidence, and review process. The
technical partner decides how to implement the smallest useful experiment.

For the technical work, follow the
[Create App Golden Path](../create-app/index.md). Add only the organizational
data and integrations needed by the experiment. A few catalog entries may be
enough to test ownership discovery; a service-creation problem may require one
Software Template and its essential integrations.

Run the PoC locally when the cohort can evaluate it through a guided session.
Use a shared environment only when participants must return independently or
when the experiment depends on shared access. Production authentication,
reliability, broad data migration, branding, and a plugin program belong in
later stages unless they are essential to the hypothesis.

## Worked example

The adoption group chooses ten on-call developers and 20 production services.
The technical partner creates a local Backstage app and registers each service
with its owner and runbook. During a guided session, each participant will try
to find both pieces of information for an unfamiliar service.

The baseline is three of ten participants succeeding in under five minutes,
with a median time of 15 minutes. The group would consider eight of ten
participants succeeding in under five minutes a useful result. It schedules the
review for the end of the week.

## Before you continue

You should now have a small cohort, a measurable baseline and expected result,
and a scope that is safe to change or discard. The adoption lead and technical
partner should agree on what is out of scope and when they will review the
evidence.

Next, [evaluate the PoC](./003-evaluate-poc.md).

## Learn from adopters

### [Growing pains: Taming the post-startup stage with Backstage](https://www.youtube.com/watch?v=T1NSkvus6Mc)

_BackstageCon North America, 2025 · 23:55 video_

- Make catalog quality the first objective instead of starting with themes,
  custom plugins, or a broad integration program.
- Use Software Templates to make an initial standard accessible, then let
  subject-matter experts own the parts they understand.

### [Backstage adoption deep dive: Navigating the pitfalls](https://www.youtube.com/watch?v=FACtDHQvNf0)

_BackstageCon North America, 2024 · 30:54 video_

- Sequence the first month deliberately instead of importing everything or
  integrating every system at once.
- Use known success patterns and failure signals to decide what the PoC should
  demonstrate before it expands.
