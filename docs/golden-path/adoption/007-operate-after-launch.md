---
id: operate-after-launch
sidebar_label: 007 - Operate after launch
title: Operate after launch
description: Establish a product rhythm for feedback, measurement, prioritization, and stakeholder communication
---

GA is not the finish line. After launch, the product team must learn where the
experience helps, where developers still struggle, and which changes deserve
investment.

**Decision prompt:** How will evidence influence priorities?

## Listen early and often

Make a feedback channel visible from launch. This might be an internal chat
channel, form, support queue, recurring office hours session, or a combination
that fits the organization.

Pay attention to struggles, not only feature requests. A request for another
integration may reveal missing context, confusing navigation, or a workflow that
still requires another tool. Schedule direct conversations with developers who
use Backstage regularly and those who rarely return. Analytics show what
happened; conversations help explain why.

## Measure the outcome

Compare post-launch signals with the baseline and outcome defined before the
PoC. Reach and usage matter, but they do not prove that the original experience
improved. Combine signals such as:

- completion time and success rate for the validated workflow;
- support demand and repeated sources of confusion;
- missing, stale, or inaccurate information;
- direct feedback from different user groups;
- whether developers return without reminders;
- use of the specific catalog pages, search results, templates, or plugins that
  support the workflow.

Backstage does not include a usage analytics provider by default. The technical
partner can evaluate an integration using the
[Analytics documentation](../../plugins/analytics.md). Agree on what the team
needs to learn before collecting additional data.

## Turn evidence into priorities

Group feedback and usage patterns around user problems. Favor work that removes
a repeated barrier or strengthens an important workflow. When evidence is mixed,
return to users before committing to a larger solution.

Not every problem requires a product feature. Stale catalog ownership may need a
better source process; repeated support questions may need clearer guidance;
low use may reflect discoverability or an audience mismatch. Document decisions
and their reasoning so that the roadmap does not become an unstructured list of
requests.

## Keep stakeholders informed

Report progress in terms of the outcomes leaders and developers care about:
reduced toil, faster onboarding, clearer ownership, more reliable workflows, or
better operational decisions. Share what is working, what is not, what the team
will try next, and what it has chosen not to pursue.

Choose a review cadence that fits the organization and maturity of the product.
The important part is that measures, feedback, roadmap decisions, and risks are
revisited together.

## Worked example

After launch, successful owner-and-runbook searches remain high, but support
messages show that developers do not know when catalog information was last
updated. The product team prioritizes visible freshness information and an
ownership correction path instead of adding another dashboard.

At the monthly review, the team shares completion data, repeated feedback, stale
data trends, and the decision rationale with the sponsor. The original outcome
remains the anchor for the next iteration.

## Before you continue

You should now have a visible way to collect feedback and a recurring review
where the product team examines outcomes, usage, user feedback, priorities, and
risks together. Keep decisions in the planning system your team already uses so
owners and reasoning remain visible.

As more teams contribute capabilities, define how ownership and product
coherence will be protected. Continue with
[Govern ownership and contributions](./008-govern-ownership.md).

## Learn from adopters

### [Lego bricks for developers: Turning insights into golden paths at Neo4j](https://www.youtube.com/watch?v=IdLXeK8motg)

_BackstageCon North America, 2025 · 27:54 video_

- Combine page analytics with qualitative feedback to learn what developers use
  and what they still need.
- Preserve the parts users value while turning broad guidance into focused,
  team-owned paths that can improve independently.

### [How Ericsson scaled developer experience with Backstage](https://www.youtube.com/watch?v=1mDEkiN4NTs)

_BackstageCon North America, 2025 · 25:08 video_

- Connect scale with automation, standardization, and collaboration rather than
  treating launch as a one-time announcement.
- Use recurring engagement data alongside evidence of efficiency and developer
  outcomes.
