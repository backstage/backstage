---
title: Backstage AI Skills Publishing and Discovery
status: implementable
authors:
  - '@drodil'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: 2026-03-06
---

# BEP: AI skills for Backstage development

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

This BEP proposes that curated Backstage AI skills are authored in the main Backstage
repository and published separately to a well-known endpoint on `backstage.io`. Instead
of creating a new Backstage-owned repository and custom discovery protocol, Backstage
will publish skills using the well-known layout already supported by [`skills.sh`](https://skills.sh/).

The published output can be released on its own publishing cadence even though the source
content lives in the main monorepo.

The primary consumer workflow becomes:

- `npx skills add https://backstage.io` to discover and install all published Backstage skills.
- `npx skills add https://backstage.io/.well-known/skills/<skill-name>` to install a specific skill.

This keeps Backstage aligned with an existing ecosystem convention, reduces maintenance
surface area, and still gives adopters a clear, official source for reusable AI guidance.
Prompt templates, instructions, and supporting files can still be shipped, but they are
packaged within skill directories instead of through a separate Backstage-specific asset system.

## Motivation

Backstage adopters are increasingly using AI-assisted workflows for plugin development,
migration, maintenance, and documentation. Today, prompt and skill quality varies
significantly across adopters, and there is no common, well-known channel for sharing proven
guidance. A lot of adopters already have assets that help AI-assisted development and
could be shared with the community.

As a result:

- Teams duplicate effort by recreating similar prompts and instructions.
- Effective practices are hard to discover and spread.
- Shared guidance is often published in tool-specific or organization-specific layouts.
- Security and governance concerns are often handled ad hoc.

Backstage should solve this in the simplest interoperable way. Creating a dedicated asset
repository, a Backstage-specific discovery index, and custom install/update tooling would
increase maintenance cost while duplicating functionality that `skills.sh` already provides.

By publishing official Backstage skills through a well-known endpoint on `backstage.io`,
Backstage can provide a reliable baseline for AI-enabled development while preserving local
extension and customization and staying aligned with an existing ecosystem workflow.

### Goals

- Author official Backstage AI skills in the main Backstage repository.
- Publish those skills separately to a well-known endpoint on `backstage.io`.
- Reuse `skills.sh` discovery and installation behavior instead of inventing a Backstage-specific protocol.
- Define a stable source layout and review process for Backstage-authored skills.
- Allow skill directories to include prompts, instructions, and supporting files needed by each skill.
- Publish contributor and review guidelines so assets remain high quality and safe.
- Provide clear docs for adopters on how to install and customize the published skills.

### Non-Goals

- Building or hosting a new LLM inference platform.
- Standardizing model provider APIs across all Backstage AI integrations.
- Automatically executing AI-generated code in adopter repositories.
- Enforcing centralized telemetry collection from adopter environments.
- Replacing existing organization-specific prompt repositories. Local assets remain supported.
- Solving all possible AI governance policy differences between organizations.
- Creating a separate Backstage-owned repository just for AI skills.
- Building a Backstage-specific discovery index, manifest, or asset registry.
- Supporting bundles, lockfiles, version pinning, or custom update flows in this first iteration.

## Proposal

Introduce three deliverables:

1. A Backstage monorepo location that serves as the source of truth for Backstage-authored AI skills.
1. A publishing workflow that exposes approved skills at `https://backstage.io/.well-known/skills/`.
1. Documentation for consuming those skills through `skills.sh`

The Backstage source content will contain:

- Reusable skills for common Backstage engineering tasks.
- Skill definitions, instructions, prompt fragments, and supporting files packaged per skill.
- Lightweight metadata needed for publication and review.
- Validation and quality checks executed in CI.

The primary consumer workflow will use `skills.sh` directly:

- `npx skills add https://backstage.io`
- `npx skills add https://backstage.io/.well-known/skills/<skill-name>`

If Backstage later adds CLI support, it should remain intentionally thin:

- It should default to the Backstage well-known endpoint.
- It should delegate to `skills.sh` semantics rather than defining its own registry or manifest.
- It should not introduce separate bundle, version, or update concepts.

This approach keeps discovery and installation interoperable with the broader ecosystem,
while still letting Backstage publish curated guidance from an official source.

## Design Details

### Source and publishing design

The source of truth for Backstage skills will live in the Backstage monorepo. The exact
directory can be finalized during implementation, but it should provide a predictable layout
for authoring, review, and publication.

Each skill directory should be self-contained and may include:

- `SKILL.md` as the primary skill entry point.
- Supporting prompt or instruction files referenced by the skill.
- Optional metadata files used by Backstage publishing workflows.

Published output on `backstage.io` will follow the `skills.sh` well-known layout:

- `https://backstage.io/.well-known/skills/index.json`
- `https://backstage.io/.well-known/skills/<skill-name>/SKILL.md`
- Additional files under `https://backstage.io/.well-known/skills/<skill-name>/...`

The published index should contain entries with the current `skills.sh` well-known shape:

- `name`: skill identifier, matching the published directory name.
- `description`: short description of the skill.
- `files`: all published files in the skill directory.

Example published layout:

```text
.well-known/skills/index.json
.well-known/skills/plugin-authoring/SKILL.md
.well-known/skills/plugin-authoring/prompts/review.md
```

Example index structure:

```json
{
  "skills": [
    {
      "name": "plugin-authoring",
      "description": "Guidance for creating and reviewing Backstage plugins.",
      "files": ["SKILL.md", "prompts/review.md"]
    }
  ]
}
```

Backstage CI should validate the source skill layout, ensure published file references are
correct, and generate the well-known endpoint contents as part of the publishing workflow.

### Consumer workflow

The main adoption path is documentation, not new tooling:

- Users install Backstage skills with `npx skills add https://backstage.io`.
- Users can install a specific published skill by pointing at its well-known skill URL.
- Any install behavior, target path decisions, or local merge semantics remain the responsibility of `skills.sh`.

### Extensibility

Adopters can:

- Keep local-only skills alongside installed Backstage skills.
- Customize installed files after adding them to their repository.
- Publish their own well-known skills endpoints independently of Backstage.

Backstage should not block these local workflows by requiring a proprietary asset format.

## Release Plan

Phase 1: Repository bootstrap

- Define the Backstage monorepo location and review guidelines for skills.
- Seed the source tree with a small set of high-value Backstage skills.
- Validate contributor workflow and CI checks for source content.

Phase 2: Publishing rollout

- Implement a publishing workflow that generates `/.well-known/skills/` content for `backstage.io`.
- Publish `index.json` and the initial skill directories.
- Validate the published endpoint against `skills.sh` consumption behavior.

Phase 3: General availability

- Publish adoption documentation centered on `npx skills add https://backstage.io`.
- Define support and ownership model for ongoing skill curation and publishing.
- Evaluate whether an optional thin `backstage-cli` wrapper adds enough value to justify maintenance.

## Dependencies

- `skills.sh` continuing to support the current well-known endpoint format.
- A Backstage publishing workflow that can emit static files to `backstage.io/.well-known/skills/`.
- Agreement on long-term ownership and governance model for Backstage-authored skills.
- Documentation updates describing authoring, publishing, and adopter usage patterns.

## Alternatives

1. Keep AI assets fully decentralized in individual adopter repositories.

This preserves autonomy but does not solve discovery, reuse, or consistency. It also increases duplicated maintenance
effort across adopters.

2. Create a separate Backstage-owned repository for AI assets.

This was the original direction, but it adds repository sprawl and still requires a distribution mechanism. Keeping the
source in the main monorepo simplifies governance and keeps the content closer to the Backstage code and docs it
describes.

3. Build a Backstage-specific discovery and installation protocol.

This would duplicate functionality already available through `skills.sh` and create a long-term maintenance burden for
limited short-term benefit.

4. Publish assets only as documentation in the Backstage docs site.

This improves discoverability, but without the well-known `skills.sh` layout it does not provide a direct installation
path for users.
