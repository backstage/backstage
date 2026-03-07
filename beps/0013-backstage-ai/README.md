---
title: Backstage AI Shared Skills and Prompts Repository and CLI Installation
status: implementable
authors:
  - '@drodil'
owners:
  - '@backstage/maintainers'
creation-date: 2026-03-06
---

# BEP: Backstage AI asset repository & tooling

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

This BEP proposes a new official Backstage repository that contains curated, reusable AI
assets for adopters, contributors, and plugin developers. The repository will include
shared skills, prompts, agent instructions, templates, and documentation that are designed specifically for Backstage use cases.

This BEP also proposes `backstage-cli` support for discovering and installing these shared
AI assets into adopter repositories. The installation flow will allow adopters to pull
individual assets or bundles, pin versions, and receive updates in a controlled way. It also
introduces out-of-the-box install targets for popular AI tooling (for example GitHub Copilot
and Claude), while allowing custom install paths for adopters with different folder layouts.

The primary outcome is a standardized and maintainable distribution model for AI best
practices across Backstage users. Instead of each organization inventing its own prompt
and skill setup, users can start from vetted defaults and customize locally while
staying aligned with upstream guidance.

## Motivation

Backstage adopters are increasingly using AI-assisted workflows for plugin development,
migration, maintenance, and documentation. Today, prompt and skill quality varies
significantly across adopters, and there is no common, versioned channel for sharing proven
guidance. A lot of adopters already have assets that help AI-assisted development and
could be shared with the community.

As a result:

- Teams duplicate effort by recreating similar prompts and instructions.
- Effective practices are hard to discover and spread.
- There is no consistent mechanism to keep AI assets up to date.
- Security and governance concerns are often handled ad hoc.

By introducing an official shared repository and integrated CLI installation flow,
Backstage can provide a reliable baseline for AI-enabled development while still preserving
local extension and customization.

### Goals

- Create a dedicated, versioned Backstage repository for shared AI skills, prompts, and agent-oriented guidance.
- Define a stable asset format and folder conventions so assets are easy to consume and validate.
- Add `backstage-cli` commands that let adopters discover, install, and update shared AI assets.
- Support install modes for individual assets and curated bundles (for example: "plugin authoring", "new frontend system migration", "docs writing", "template creation").
- Provide built-in install targets for GitHub Copilot, Claude prompt/skill or other tool folder conventions.
- Provide a custom target/path option for adopters that use other AI tooling or internal conventions.
- Enable version pinning and predictable updates for reproducible developer experience.
- Publish contributor and review guidelines so assets remain high quality and safe.
- Provide clear docs for adopters on how to customize installed assets while preserving ability to upgrade.

### Non-Goals

- Building or hosting a new LLM inference platform.
- Standardizing model provider APIs across all Backstage AI integrations.
- Automatically executing AI-generated code in adopter repositories.
- Enforcing centralized telemetry collection from adopter environments.
- Replacing existing organization-specific prompt repositories. Local assets remain supported.
- Solving all possible AI governance policy differences between organizations.

## Proposal

Introduce two deliverables:

1. A new Backstage-managed repository (working name: `backstage-ai`) that publishes shared AI assets.
1. New `backstage-cli` capabilities to consume these assets from adopter repositories.

The shared repository will contain:

- Reusable prompts for common Backstage engineering tasks.
- Skill definitions and instruction files for agent-driven workflows.
- Curated bundles combining multiple assets for end-to-end use cases.
- Metadata for each asset, including owner, version compatibility, and tags.
- Validation and quality checks executed in CI.

`backstage-cli` will provide a simple consumer workflow:

- Search/list available assets and bundles for specific target.
- Install selected assets into a repository.
- Pin an installed asset to a version or track a release channel.
- Check for updates and apply them with safe file merge behavior.

The installation workflow will support target-aware output locations:

- `--target copilot` installs to GitHub Copilot-oriented folder conventions.
- `--target claude` installs to Claude-oriented folder conventions.
- `--target custom --path <directory>` installs to an adopter-defined location.

Installation will target a conventional folder in the adopter repository (for example
`.backstage/ai/`) when no tool-specific target is selected. The CLI will avoid overwriting
modified files silently and will provide clear conflict guidance.

## Design Details

### Shared repository design

The repository will use a predictable layout:

- `skills/` for reusable skill packages.
- `prompts/` for prompt templates.
- `bundles/` for opinionated collections of skills and prompts.
- `schemas/` for metadata validation.
- `docs/` for authoring and consumption guidance.

Each asset will include metadata fields such as:

- Unique identifier.
- Semantic version.
- Description and tags.
- Compatibility hints (for example minimum Backstage version, CLI version).
- Target compatibility hints (for example `copilot`, `claude`, or `generic`).
- Maintainer/owner.
- Optional security or compliance notes.

Repository CI will validate metadata schema, lint content, and verify bundle references.

### CLI

Proposed command surface (naming subject to implementation review):

- `backstage-cli ai assets list`
- `backstage-cli ai assets install <asset-or-bundle>`
- `backstage-cli ai assets update [<asset-or-bundle>]`
- `backstage-cli ai assets status`

Proposed target flags and options:

- `--target <copilot|claude|custom>`
- `--path <directory>` (required when target is `custom`, optional override for others)
- `--dry-run` to preview file operations and target paths

Installation behavior:

- Resolve install destination from selected target (`copilot`, `claude`, or `custom`).
- Create or update files under the target path (defaulting to `.backstage/ai/` for generic installs).
- Generate a lock/manifest file recording installed assets and versions.
- Record selected target and install path in the manifest for safe future updates.
- Preserve local edits by default; prompt user when conflicts exist.
- Support non-interactive mode for CI usage.

Update behavior:

- Compare installed versions with upstream index.
- Show changelog summary before applying updates.
- Offer per-asset update and full-bundle update paths.
- Reuse recorded target/path unless explicitly overridden by the user.

Manifest format:

- File path: `.backstage/ai-manifest.json`.
- Purpose: Track installed assets, selected targets, install paths, and pinned versions.
- Schema versioning: Include a top-level `schemaVersion` so future CLI releases can migrate format safely.

Example structure:

```json
{
  "schemaVersion": 1,
  "source": {
    "repository": "backstage-ai",
    "indexVersion": "2026-03-06"
  },
  "assets": [
    {
      "id": "bundle.plugin-authoring",
      "type": "bundle",
      "version": "1.2.0",
      "target": "copilot",
      "path": ".github/prompts",
      "channel": "stable",
      "pinned": true,
      "installedAt": "2026-03-06T12:00:00Z"
    }
  ]
}
```

The CLI should validate this file against a schema and fail with actionable guidance if the file is malformed.

### Extensibility

Adopters can:

- Keep local-only assets alongside upstream-installed assets.
- Override installed prompts or skills with local variants.
- Opt out of update tracking for selected assets.

The CLI should preserve this extensibility without requiring users to fork the shared repository.

## Release Plan

Phase 1: Repository bootstrap

- Create the new shared repository and publish initial content guidelines.
- Seed with a small set of high-value skills/prompts and one or two bundles.
- Validate contributor workflow and CI checks.

Phase 2: CLI implementation and stability rollout

- Implement `backstage-cli ai assets` commands and target-aware installation behavior.
- Ship the initial CLI command group with explicit stability labeling (`alpha` then `beta`) before final stabilization.
- Validate version policy alignment for CLI changes, including command/flag compatibility guarantees before stable status.
- Collect and address adopter feedback on command UX, target-specific folder mapping, install layout, and update flows.

Phase 3: General availability

- Finalize CLI command names and target/path behavior.
- Publish migration and adoption documentation.
- Define support and ownership model for ongoing content curation.

## Dependencies

- Backstage CLI extensibility for new `ai assets` command group.
- Agreement on long-term ownership and governance model for shared AI assets.
- Documentation updates describing adopter usage patterns and contribution workflows.

## Alternatives

1. Keep AI assets fully decentralized in individual adopter repositories.

This preserves autonomy but does not solve discovery, reuse, or consistency. It also increases duplicated maintenance effort across adopters.

2. Publish assets only as documentation in the Backstage docs site.

This improves discoverability but provides no versioned install/update mechanism and no ergonomic CLI integration.

3. Ship shared assets directly in the Backstage monorepo.

This couples fast-moving AI content to core release cadence and governance. A dedicated repository provides cleaner ownership and iteration speed.

4. Rely on third-party package registries as the only distribution channel.

Possible, but it adds complexity and does not inherently provide the repository-level conventions and contributor workflow needed for prompt/skill quality.
