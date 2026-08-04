---
id: preparing-for-ga
sidebar_label: 006 - Prepare for GA
title: Prepare for general availability
description: Decide whether a Backstage pilot is ready for a wider organizational launch
---

General availability (GA) expands both the audience and the organization's
responsibility for the product. Use pilot evidence and technical sign-off to
make the launch decision explicit.

**Decision prompt:** Are we comfortable launching, or should we address gaps
first?

## Confirm product readiness

Review the pilot with the sponsor, product team, technical partner, and
participating developers. Confirm that:

- the launch workflows solve a validated problem for their intended audiences;
- pilot evidence supports expanding beyond the original cohort;
- documentation, support channels, and escalation owners are visible;
- measures and a review cadence are in place;
- early users can explain the value in their own words;
- the product team has capacity to respond after the announcement.

A launch can proceed with known limitations when decision-makers understand the
risk, name an owner, and agree when it will be revisited. GA should not make an
experimental workflow appear more dependable than it is.

## Request technical readiness sign-off

The adoption lead should not make production-readiness judgments alone. Confirm
that the technical partner has completed the
[Deployment Golden Path](../deployment/index.md) and reviewed the launch against
the organization's requirements for:

- authentication, authorization, and appropriate access;
- security, data sensitivity, and privacy;
- reliability, recovery, monitoring, and incident response;
- upgrades, dependencies, and operational ownership;
- accessibility and supported user environments.

The technical partner should describe important gaps in language the sponsor and
product team can use in the launch decision. Record accepted risks and follow-up
owners rather than hiding uncertainty in technical detail.

## Plan the launch

A launch announcement should explain that Backstage is available and why
developers should care. Lead with the problem it solves, not a list of features.
"Find a service owner and runbook in one place" is stronger than "we launched a
software catalog."

Use communication channels developers already follow, such as an engineering
newsletter, team-lead forum, internal chat, or developer meetup. Tailor the
message to the audience and point people to:

- the workflows included at launch;
- where to get started;
- documentation and support;
- where to report problems or provide feedback;
- known limitations that affect their work.

A short live demo can build trust. Show one or two validated workflows and leave
time for questions. Invite a pilot participant to co-present when possible;
peer experience often carries more weight than a platform-team announcement.

## Worked example

The pilot shows that on-call engineers consistently find ownership information
faster, and source data remains accurate enough for regular use. The technical
partner confirms company sign-in, access controls, monitoring, backups, upgrade
ownership, and support escalation.

Twelve services still lack operational documentation. The sponsor accepts that
missing entries are clearly identified and an accountable team will address
them before the first monthly review. The launch message focuses on ownership
and service-documentation discovery rather than presenting Backstage as a complete portal.

## Before you continue

You should now have an explicit launch decision grounded in pilot evidence and
product and technical readiness. Make support, accepted risks, follow-up owners,
communication, measurement, and the first post-launch review visible to everyone
responsible for the launch.

After launch, move from project delivery to a recurring product rhythm. Continue
with [Operate after launch](./007-operate-after-launch.md).
