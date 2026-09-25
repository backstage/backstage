---
id: getting-started
sidebar_label: 001 - Define the problem
title: Define the problem
description: Identify an organizational problem and decide whether it is worth exploring with Backstage
---

This stage helps an adoption lead frame a problem before anyone starts building.
You do not need technical expertise, but you should involve a technical partner
who can explain what Backstage can and cannot do.

**Decision prompt:** Is this worth exploring with Backstage?

## Start with an organizational problem

Backstage is a framework for building developer portals. It can centralize
software ownership and documentation, provide one entry point to development
tools, and offer reusable paths through common tasks. Those capabilities are
useful only when they address a problem that developers and leaders recognize.

Describe the behavior or outcome you want to change, not the Backstage feature
you want to install. For example:

- Developers cannot reliably find who owns a service or where its documentation
  lives.
- Creating a service or environment requires handoffs across several teams and
  tools.
- Platform teams repeatedly help developers through the same error-prone
  process.
- Teams struggle to discover and reuse tools or practices that already exist.

"Reduce the time needed to create a production-ready service" is a stronger
starting point than "launch Software Templates."

## Check whether Backstage is worth exploring

Backstage may be worth a small experiment when the problem affects several
teams, depends on information or workflows spread across systems, and could be
improved through a shared developer experience. A technical partner can help
identify the systems, data, and organizational changes that an experiment would
need.

Consider a different first step when the problem belongs to one team and one
tool, the underlying information has no reliable owner, or a simpler process
change could solve the problem. You do not need to prove that Backstage is the
right answer yet. You need a problem that is specific enough to test.

## Form an initial group

Bring together the smallest group that can explore the problem:

- an adoption lead who records the problem and coordinates the work;
- a technical partner who can evaluate and configure Backstage;
- developers who experience the problem in their regular work;
- the team that may eventually own Backstage as an internal product.

This group needs permission to run a small proof of concept (PoC), not a
commitment to fund a production platform. Formal sponsorship and continued
investment come later if the PoC produces useful evidence.

## Explore the experience

Visit the [Backstage demo site](https://demo.backstage.io/) with the problem in
mind. Walk through one scenario that is difficult in your organization today.
Do not review every feature. Ask what information, integration, automation, or
governance would need to exist for that scenario to become meaningfully easier.

## Worked example

A platform PM hears that on-call engineers lose time finding the owner and
runbook for unfamiliar services. Ten developers try a recent example. Only
three find both pieces of information in under five minutes, and the median time
is 15 minutes. The adoption group decides this is specific, recurring, and
measurable enough to explore with Backstage.

## Before you continue

You should now be able to explain who is affected, what they do today, what the
evidence shows, and what outcome would be better. Make sure the adoption lead
and technical partner agree on what a small PoC should teach and when they will
review the result.

Next, [build a focused PoC](./002-setting-up-a-poc.md).

## Learn from adopters

### [Backstage: From Spreadsheet to Standard](https://www.youtube.com/watch?v=gJHYTlO0VwA)

_CNCF, 2026 · 28:01 video_

- See how a portal built for Spotify's internal scaling problem became a shared
  framework rather than a fixed product.
- Use the adopter and practitioner perspectives to identify which parts of the
  Backstage story resemble your organization's problem.

### [What do cars, clothes, wardrobes, and MRI machines have in common?](https://www.youtube.com/watch?v=h6BgF9dQDNo)

_BackstageCon Europe, 2025 · 39:58 video_

- Compare why organizations outside software-first industries invested in
  developer portals.
- Listen for the legacy, organizational, and developer experience constraints
  that shaped each adopter's starting point.
