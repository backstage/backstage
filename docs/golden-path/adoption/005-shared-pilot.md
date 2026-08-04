---
id: customize-your-instance
sidebar_label: 005 - Evolve to a shared pilot
title: Evolve the PoC into a shared pilot
description: Turn a focused Backstage PoC into a shared experience for realistic evaluation
---

The shared pilot extends the validated PoC rather than starting over. Keep the
original problem and useful workflow, then add enough realism to learn how the
experience behaves in regular work.

**Decision prompt:** What must improve before a wider rollout?

## Plan the pilot

Define a limited evaluation period and a representative audience. The pilot
should answer questions that a local or guided PoC could not, such as:

- Will developers return without being prompted?
- Can people sign in and access the right information?
- Do source-system integrations remain accurate?
- Can the product and technical teams support the experience?
- Does the workflow still improve the original outcome under regular use?

The adoption lead owns the audience, research, measures, and review. The
technical partner owns the shared environment, integrations, and technical
readiness. The executive sponsor removes organizational blockers, while the
product team owns the resulting experience and decisions.

## Prioritize the experience

For each proposed addition, ask:

- Which user and problem does this serve?
- What evidence shows that it matters to the pilot?
- Could an existing plugin or integration solve enough of the problem?
- Who will own and maintain it?
- How will the pilot show whether it helped?

Favor a small number of coherent workflows over a collection of disconnected
features. Branding can help users recognize the portal, but it should not delay
the integrations, access, support, and data quality needed by the pilot.

## Adopt or build

Start with the [Backstage plugin directory](https://backstage.io/plugins).
Existing plugins can shorten delivery time and provide community maintenance.
Evaluate whether a plugin fits the user journey, security model, experience
standards, and ownership expectations.

Build a custom plugin when the workflow is important, specific to the
organization, and not served well enough by an existing option. Account for
product discovery, design, operation, upgrades, support, and long-term ownership,
not only implementation. If ownership is unclear, record that as a pilot risk
and adjust the scope accordingly.

## Worked example

The product team deploys the ownership-discovery PoC to a shared environment
with company sign-in. It expands the catalog from 20 to 100 production services
and automates ownership data from the source-control system. Fifty on-call
engineers can use it for six weeks, with a visible support channel.

The team tracks successful owner-and-runbook searches, completion time, missing
or stale data, support requests, and direct feedback. It deliberately postpones
a custom theme and additional plugins because they do not help answer the pilot
questions.

## Before you continue

You should now have a shared pilot with a realistic audience, environment, data,
integrations, and a visible support path. The product team and technical partner
should agree on what they will measure, which risks remain, what is out of scope,
and when they will review the evidence.

At the review, record what improved, what remains uncertain, and which risks the
organization is willing to accept or address before launch. When the experience
is ready for a wider audience, [prepare for GA](./006-preparing-for-ga.md).

## Learn from adopters

### [The Lego approach: Leveraging reusability for a seamless user experience](https://www.youtube.com/watch?v=QV40Yz2i3jQ)

_BackstageCon North America, 2024 · 24:30 video_

- Customize through reusable patterns so separate plugins do not become a
  fragmented user experience.
- Treat branding and component contribution as governed system decisions, not
  isolated page-level work.

### [Insights from internal developer portal rollouts in large enterprises](https://www.youtube.com/watch?v=DAjhjS2Xg4Q)

_BackstageCon North America, 2024 · 47:19 video_

- Decide whether to build or adopt from organizational scale, legacy
  constraints, and valuable custom workflows, not from plugin count alone.
- Establish central experience and quality boundaries before inviting
  distributed templates or plugins.
