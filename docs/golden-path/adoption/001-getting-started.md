---
id: getting-started
sidebar_label: 001 - Getting started
title: Getting started with Backstage
description: An introduction to the Backstage adoption journey and what to expect
---

This guide prepares you to lead the organizational side of adopting Backstage. You do not need a technical understanding of Backstage, but you should work with the team that will own your Backstage instance.

## Start with an organizational problem

Backstage is a framework for building developer portals. It can centralize software ownership and documentation, provide one entry point to development tools, and offer reusable paths through common tasks. Those capabilities are useful only when they address a problem that developers and leaders recognize.

Start by writing down the problem you want to explore. For example:

- Developers cannot reliably find who owns a service or where its documentation lives.
- Creating a service or environment requires handoffs across several teams and tools.
- Platform teams repeatedly help developers through the same error-prone process.
- Teams struggle to discover and reuse the tools or practices that already exist.

Describe the behavior or outcome you want to change, not the Backstage feature you want to install. "Reduce the time needed to create a production-ready service" is a stronger starting point than "launch Software Templates".

## Form an initial coalition

Bring together a small group that can test the problem from different perspectives:

- a technical partner who can evaluate and configure Backstage;
- developers who experience the problem in their regular work;
- the team that would own Backstage as an internal product;
- a leader who can connect the work to wider platform goals and remove organizational blockers.

This is not yet a company-wide steering group. It is the smallest group that can decide whether the problem is real, whether Backstage is a credible response, and what evidence would justify further investment.

## Test your hypothesis in the demo

Explore the [Backstage demo site](https://demo.backstage.io/) with your problem in mind. Use the Software Catalog to see how ownership, documentation, dependencies, and integrations can be organized around a software component. See the [Software Catalog system model](../../features/software-catalog/system-model.md) if you want more background.

Then visit [Software Templates in the demo](https://demo.backstage.io/create). Instead of reviewing every feature, walk through one scenario that is difficult in your organization today. Ask your coalition what would need to be integrated, automated, or governed for that scenario to become meaningfully easier.

## Understand the adoption journey

A durable adoption usually progresses through these decisions:

1. Agree on the problem and the outcome you want to change.
2. Secure a sponsor and an accountable product team.
3. Run a focused proof of concept (PoC) with representative users.
4. Use stakeholder feedback to choose what to invest in.
5. Launch with communication, support, and measures in place.
6. Establish contribution, ownership, and catalog governance as adoption grows.

The rest of this guide follows that sequence. The goal is not to make Backstage available as quickly as possible. It is to build an internal product that developers choose to use and that leaders can continue to support.

## Learn from adopters

### [Backstage: From Spreadsheet to Standard](https://www.youtube.com/watch?v=gJHYTlO0VwA)

_CNCF, 2026 · 28:01 video_

- See how a portal built for Spotify's internal scaling problem became a shared framework rather than a fixed product.
- Use the adopter and practitioner perspectives to identify which parts of the Backstage story resemble your organization's problem.

### [What do cars, clothes, wardrobes, and MRI machines have in common?](https://www.youtube.com/watch?v=h6BgF9dQDNo)

_BackstageCon Europe, 2025 · 39:58 video_

- Compare why organizations outside software-first industries invested in developer portals.
- Listen for the legacy, organizational, and developer experience constraints that shaped each adopter's starting point.
