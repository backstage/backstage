---
id: setting-up-a-poc
sidebar_label: 003 - Setting up a PoC
title: Setting up a PoC
description: How to set up a proof of concept Backstage instance for your organization
---

If you're non-technical, complete this section with your technical partner. The goal of a proof of concept (PoC) is not to demonstrate every Backstage feature. It is to learn whether Backstage can improve one important experience in your organization.

## Define the experiment

Write down the following before implementation starts:

- **Problem:** the specific developer or platform-team problem you are testing.
- **Cohort:** a small, representative group that experiences the problem and can give regular feedback.
- **Sponsor:** the person accountable for removing blockers and deciding what follows the PoC.
- **Evidence:** the baseline and result you will compare, such as elapsed time, support requests, completion rate, or repeated interview feedback.
- **Scope:** the smallest catalog content, integration, or workflow needed to test the hypothesis.

Choose a cohort that will challenge the idea constructively. A friendly team can make collaboration easier, but the PoC should still reflect the constraints that a wider rollout will face.

## Keep implementation narrow

Follow the [golden path for creating an app](../create-app/index.md). Add a few `catalog-info.yaml` files for software owned by the participating teams and, if relevant to your test, configure the [GitHub catalog provider](../../integrations/github/discovery.md).

Run the instance locally unless a shared environment is necessary for the cohort to participate. Avoid spending the PoC on a polished theme, a broad plugin program, or organization-wide catalog migration. Those investments are difficult to evaluate before you have evidence from the initial use case.

## Decide what happens next

Review the evidence with the cohort and sponsor. Continue only when you can explain what improved, what remained difficult, and what the next investment is expected to change. A PoC that disproves the initial approach is still useful if it prevents a larger unsupported rollout.

## Learn from adopters

### [Growing pains: Taming the post-startup stage with Backstage](https://www.youtube.com/watch?v=T1NSkvus6Mc)

_BackstageCon North America, 2025 · 23:55 video_

- Make catalog quality the first objective instead of starting with themes, custom plugins, or a broad integration program.
- Use Software Templates to make the initial standard explicit and accessible, then decompose the workflow so subject-matter experts can own their part.

### [Backstage adoption deep dive: Navigating the pitfalls](https://www.youtube.com/watch?v=FACtDHQvNf0)

_BackstageCon North America, 2024 · 30:54 video_

- Sequence the first month deliberately instead of importing everything or integrating every system at once.
- Use known success patterns and failure signals to decide what the PoC must demonstrate before it expands.
