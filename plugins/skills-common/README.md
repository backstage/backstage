# @backstage/plugin-skills-common

Common types, validation utilities, and client for the Backstage Skills plugin.

This package provides shared interfaces and utilities used by the skills backend, frontend, and node registration service.

## Installation

```bash
yarn --cwd packages/backend add @backstage/plugin-skills-common
```

## Contents

- **Types**: `Skill`, `SkillFile`, `SkillInput`, `RegisterSkillsRequest`, `SkillsListRequest`, `SkillsListResponse`, `WellKnownSkillEntry`, `WellKnownIndex`, `SkillsApi`, `SkillsRequestOptions`
- **Validation**: `validateSkillName`, `parseSkillFrontmatter`
- **Client**: `SkillsClient` — an HTTP client implementing the `SkillsApi` interface, with optional per-request bearer tokens

## Skills Format

Skills follow the [Agent Skills specification](https://agentskills.io). Each skill is defined by a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill
description: A short description of the skill.
license: Apache-2.0
compatibility: copilot
metadata:
  author: my-team
allowed-tools: Read Bash(git:*)
---

# My Skill

Detailed instructions for the agent...
```
