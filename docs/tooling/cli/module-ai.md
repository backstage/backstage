---
id: module-ai
title: AI Module
description: CLI commands for installing the AI skills from your Backstage catalog.
---

The AI module (`@backstage/cli-module-ai`) resolves which `AiResource` skills
apply to the repository you are working in and installs them into your coding
agents using [`skills.sh`](https://github.com/vercel-labs/skills).

## Installation

This module is not part of `@backstage/cli-defaults`. Add it to your root
`package.json` and the CLI discovers it automatically:

```bash title="From your root directory"
yarn add --dev @backstage/cli-module-ai
```

## Prerequisites

Before using the AI commands you need:

- To sign in to your Backstage instance using [`auth login`](./module-auth.md#auth-login).
- A catalog backend with the AI model module installed. See [AI in the Catalog](../../ai/ai-in-the-catalog.md).
- Node.js 22.20 or later, which is required by `skills`. The `ai skills sync` command needs this Node.js version.
- A git `origin` remote on GitHub or GitLab that matches a catalog component. Alternatively, pass `--entity`.

## ai resolve

Show which catalog skills apply to the current repository, and why.

```text
Usage: backstage-cli ai resolve [options]

Options:
  --entity <ref>      Component to resolve against (skips git remote detection)
  --agent <id>        Target agent, repeatable (default: detected from environment)
  --output <format>   human (default) or json
  --instance <name>   Backstage instance to use
```

Prints the resolved component, its owner and system, your groups and their
ancestor groups, and every candidate skill with whether it was selected and
why. Use it to debug skill selection and as the dry run for `ai skills sync`.

### Examples

```bash
# Resolve against the component that matches the git origin remote
yarn backstage-cli ai resolve

# Machine-readable output
yarn backstage-cli ai resolve --output json
```

## ai skills sync

Install the applicable skills into your coding agents.

```text
Usage: backstage-cli ai skills sync [options]

Options:
  --entity <ref>      Component to resolve against (skips git remote detection)
  --agent <id>        Target agent, repeatable (default: detected from environment)
  --global            Install into the user-level skills directories instead of the project
  --dry-run           Print the skills commands without running them
  --instance <name>   Backstage instance to use
```

Resolves the applicable skills and runs one `skills add` invocation per skill,
using the skill's own tree URL as the source:

```bash
skills add <skill-tree-url> -a <agent> [-a <agent>...] -y [-g]
```

Skills that cannot be installed are reported on standard error with the reason.
If no skill can be installed, the command prints a message and exits
successfully without running `skills`.

### Examples

```bash
# Print the skills commands without running them
yarn backstage-cli ai skills sync --dry-run

# Install for specific agents into your user-level directories
yarn backstage-cli ai skills sync --agent claude-code --agent cursor --global

# Install for a specific component instead of detecting it from git
yarn backstage-cli ai skills sync --entity component:default/my-service
```

## How skills are selected

A skill is selected when all of the following are true:

1. **Scope:** the skill is `partOf` the component's system, or it is `ownedBy` the component's owner, one of your groups, or an ancestor group of either.
2. **Agent:** the skill's `spec.agents` is absent or empty, or it contains at least one target agent.
3. **Installable:** the skill has a `backstage.io/source-location` annotation of the form `url:<git tree URL>` that points at a directory containing `SKILL.md`. See [Making skills installable](../../ai/ai-in-the-catalog.md#making-skills-installable).

Skills that fail a check are reported as skipped, with the reason.

The module also follows `dependsOn` relations from every selected skill and
adds the referenced skills transitively. Dependencies are added even when they
are outside the scope match, but the agent and installable checks still apply
to them.

Each selected skill is installed with its own `skills add` invocation that uses
the skill's source location. A repository with several selected skills is
therefore fetched once per skill. Skills that share the same source location
are installed once.

## Agent IDs

The module uses `skills` agent IDs, such as `claude-code`, `codex`, and
`cursor`, both for `--agent` and as the values of `spec.agents` in `AiResource`
entities.

When you do not pass `--agent`, the module detects the current agent from
environment variables that the agent vendors document:

- `CLAUDECODE` for Claude Code
- `CURSOR_AGENT` for Cursor

Codex does not set a documented variable, so pass `--agent codex`. If no agent
is detected, the command fails and asks you to pass `--agent`.

## Errors

- If you are not logged in, or the token was rejected, the command fails with a message pointing to `backstage-cli auth login`.
- If there is no git remote or no matching component, the command fails with a message suggesting `--entity`.
- If more than one component matches the repository, the command fails and lists the candidates. Pass `--entity` to choose one.
- A skill that cannot be installed is reported as skipped with the reason. This never fails the command on its own.
- If `skills add` exits with a non-zero code, the command reports which skill failed, continues with the remaining skills, and exits with a non-zero code at the end.

## Supported `skills` version

This module pins `skills` to version 1.7.0 and runs it from its own
dependencies, so nothing is fetched when you run the command. It depends on how
the `skills add` command parses GitHub and GitLab tree URLs and on its `-a`,
`-y`, and `-g` flags. Other versions are not supported.

`skills` only recognizes tree URLs on a GitHub Enterprise host when the
`GH_HOST` environment variable matches that host. For these sources the module
sets `GH_HOST` for that one invocation only.

## Limitations

- Skills that were synced earlier are never removed, even if they no longer apply. Use `skills remove` to remove them.
- Rules and hooks are not handled. Only skills are installed.
- Skills with a ref that contains `/`, and GitHub Enterprise hosts with a port, are skipped.
- Only GitHub and GitLab `origin` remotes can be matched to a component automatically. For other hosts, pass `--entity`.
