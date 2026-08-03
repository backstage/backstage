---
id: full-catalog
sidebar_label: 008 - A Full Catalog
title: Ensuring your catalog stays complete
description: Strategies for maintaining a complete and up-to-date software catalog
---

Along your Backstage journey, voluntary adoption may begin to plateau. New software appears without catalog entries, ownership data drifts, and the teams that already see value continue to carry most of the adoption work. Treat this as an organizational signal, not merely a missing YAML file.

## Define what complete means

A useful catalog does not need every abandoned experiment or archived repository. Define the software population that must be represented based on the outcomes your organization expects from the catalog. Production deployments, active repositories, supported APIs, and regulated systems are common starting points.

Agree on the metadata required for that population. Ownership and lifecycle are often more valuable than a large number of incomplete entries. Record exceptions explicitly so that teams can distinguish intentional scope from unknown gaps.

Measure coverage against another source of truth, such as active repositories or production deployments. Review both the percentage represented and the quality of the required metadata.

## Choose an onboarding model

The right model depends on how software and ownership are managed in your organization:

- **Centralized and automated:** ingest software from deployment, source-control, or existing inventory systems, then ask teams to enrich missing context.
- **Centralized and assisted:** have the platform team prepare entries or pull requests with product teams when automation cannot establish enough context.
- **Distributed:** ask product teams to register and maintain their software, supported by clear guidance, templates, and follow-up.

Many organizations combine these models. Automation can establish broad coverage while product teams confirm ownership and maintain information that only they know.

## Make the standard easy to meet

Before adding an enforcement mechanism, provide:

- a shared definition of which software and metadata are required;
- imported groups or another reliable way to select an owner;
- a low-friction registration path, such as an automated pull request or Software Template;
- a named support channel and accountable platform owner;
- an exception process for software that does not fit the standard;
- a visible measure of progress and data quality.

This groundwork turns catalog registration into an organizational standard with a supported path, rather than an unexplained build failure.

## Enforce catalog metadata in delivery

Introduce delivery checks only after the expectation is understood and the registration path works. A check can verify that in-scope software has a catalog entry and the required metadata before it advances through a delivery process. Avoid forcing every team to author the same file manually when an [external catalog provider](../../features/software-catalog/external-integrations.md) can establish the data more reliably.

Make failures actionable. Point developers to the missing requirement, the [catalog descriptor reference](../../features/software-catalog/descriptor-format.md), the supported registration path, and the team that can help. Track exceptions and recurring failures; they often reveal a taxonomy, automation, or ownership problem that enforcement alone will not fix.

## Leadership initiatives

Leadership action is appropriate when catalog quality supports a wider goal such as incident response, security posture, regulatory evidence, or software investment decisions. The sponsor should explain that outcome, name accountable owners, set a realistic milestone, and review progress on a regular cadence.

Use mandates selectively. Start with the most important software population and pair the requirement with automation and support. Recognize teams that improve shared data, address organizational blockers exposed by the rollout, and revisit requirements that create work without improving the intended outcome.

Catalog completion is not the finish line. Continue measuring whether developers and leaders can make better decisions with the information and whether ownership remains accurate as the organization changes.

## Learn from adopters

### [The ultimate guide to Backstage Software Catalog completeness](https://roadie.io/blog/3-strategies-for-a-complete-software-catalog/)

_Roadie, 2024_

- Define completeness against the software that matters, such as active repositories or production deployments, instead of pursuing a noisy 100 percent inventory.
- Choose centralized, distributed, or mixed onboarding based on your source-of-truth landscape and the ownership behavior you want to create.

### [Growing pains: Taming the post-startup stage with Backstage](https://www.youtube.com/watch?v=T1NSkvus6Mc)

_BackstageCon North America, 2025 · 23:55 video_

- Expect voluntary catalog onboarding to plateau; use targeted manual work to establish ownership, then automate the steady state.
- SpotOn archives repositories that fall out of compliance and provides a reversible, self-service path that restores the repository and registers it in the catalog.
