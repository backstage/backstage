---
id: full-catalog
sidebar_label: 009 - Scale catalog coverage
title: Scale catalog coverage
description: Define and maintain useful Software Catalog coverage as Backstage adoption grows
---

As adoption grows, new software may appear without catalog entries and ownership
data may drift. Treat this as an organizational signal, not merely a missing
file. Catalog coverage should support a clear outcome rather than pursue an
arbitrary 100 percent target.

**Decision prompt:** What coverage and quality expectations support our
outcomes?

## Define what should be represented

A useful catalog does not need every abandoned experiment or archived
repository. Define the software population that matters to the organization's
outcomes. Production deployments, active repositories, supported APIs, and
regulated systems are common starting points.

Agree on the minimum information needed for that population. Ownership and
lifecycle are often more valuable than many incomplete fields. Record exceptions
so that teams can distinguish intentional scope from unknown gaps.

Measure coverage against another source of truth, such as active repositories
or production deployments. Review both the percentage represented and the
quality of the required information.

## Choose an onboarding model

Choose a model that fits how software and ownership are managed:

- **Centralized and automated:** Ingest software from deployment,
  source-control, or inventory systems, then ask teams to enrich missing
  context.
- **Centralized and assisted:** Have the platform team prepare entries or pull
  requests when automation cannot establish enough context.
- **Distributed:** Ask product teams to register and maintain software, supported
  by clear guidance, templates, and follow-up.

Many organizations combine these models. The adoption lead defines the desired
ownership behavior and support model. The technical partner evaluates providers,
automation, and delivery integration.

## Make the standard easy to meet

Before introducing enforcement, provide:

- a shared definition of which software and information are required;
- a reliable way to identify an owner;
- a low-friction registration or correction path;
- a named support channel and accountable platform owner;
- an exception process for software that does not fit the standard;
- a visible measure of coverage and data quality.

This groundwork turns catalog registration into a supported organizational
standard rather than an unexplained build failure.

## Use enforcement deliberately

Delivery checks may help once the expectation is understood and the registration
path works. Start with the software population that matters most, make failures
actionable, and pair requirements with automation and support.

The technical partner can determine whether an
[external catalog provider](../../features/software-catalog/external-integrations.md)
or delivery check establishes data more reliably than asking every team to
maintain the same file manually. Track exceptions and recurring failures; they
often reveal a taxonomy, automation, or ownership problem that enforcement alone
will not fix.

Leadership involvement is appropriate when catalog quality supports a wider
outcome such as incident response, security posture, regulatory evidence, or
software investment decisions. The sponsor should explain the outcome, name
accountable owners, and revisit requirements that create work without improving
it.

## Worked example

The organization decides that every active production service must have a named
owning team, lifecycle, repository, and runbook. It measures coverage against
the deployment inventory and finds that 72 percent of services meet the
standard.

The platform team automatically creates basic entries from deployment data and
asks product teams to confirm ownership and runbook links. Regulated services
receive the first milestone because accurate ownership supports incident and
compliance work. Exceptions are recorded rather than hidden in the coverage
number.

## Before you continue

You should now have a catalog coverage policy tied to an organizational outcome,
with a clear scope, ownership model, source of truth, and path for registration
or correction. Review coverage, quality, exceptions, and support needs often
enough to keep the catalog useful as the organization changes.

Catalog completion is not the finish line. Continue using the
[post-launch operating rhythm](./007-operate-after-launch.md) to determine
whether developers and leaders can make better decisions and whether ownership
remains accurate as the organization changes.

## Learn from adopters

### [The ultimate guide to Backstage Software Catalog completeness](https://roadie.io/blog/3-strategies-for-a-complete-software-catalog/)

_Roadie, 2024_

- Define completeness against the software that matters instead of pursuing a
  noisy 100 percent inventory.
- Choose centralized, distributed, or mixed onboarding based on source systems
  and desired ownership behavior.

### [Growing pains: Taming the post-startup stage with Backstage](https://www.youtube.com/watch?v=T1NSkvus6Mc)

_BackstageCon North America, 2025 · 23:55 video_

- Expect voluntary catalog onboarding to plateau; establish ownership, then
  automate the steady state.
- Pair organizational expectations with a reversible, supported path to
  compliance.
