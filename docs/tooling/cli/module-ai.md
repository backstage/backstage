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

- A signed-in session on your Backstage instance, created with [`auth login`](./module-auth.md#auth-login).
- A catalog backend that has the AI model module installed and supports `$contains` predicate queries on entity relations. See [AI in the Catalog](../../ai/ai-in-the-catalog.md).
- Node.js 22.20 or later for `ai skills sync`, because `skills` requires it. The command fails before installing anything on an older version, and `--dry-run` works on any version.
- A git `origin` remote on GitHub or GitLab that matches a catalog component, or the `--entity` option.

## ai resolve

Show which catalog skills apply to the current repository, and why.

```text
Usage: backstage-cli ai resolve [options]

Options:
  --entity <string>    Component to resolve against (skips git remote detection)
  --agent <string>     Target agent, repeatable (default: detected)
  --output <string>    Output format: human (default), json
  --instance <string>  Name of the instance to use
  --allow-file-sources Allow skills whose source location is a local directory (file:)
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
  --entity <string>    Component to resolve against (skips git remote detection)
  --agent <string>     Target agent, repeatable (default: detected)
  --global             Install into the user-level skills directories instead of the project
  --dry-run            Print the skills commands without running them
  --instance <string>  Name of the instance to use
  --allow-file-sources Allow skills whose source location is a local directory (file:)
  --hook               Run safely from an agent session start hook
```

Resolves the applicable skills and runs one `skills add` invocation per skill,
using the skill's own tree URL as the source:

```bash
skills add <skill-tree-url> -a <agent> [-a <agent>...] -y [-g]
```

Without `--global`, skills are installed into the project. The module runs
`skills` from the root of the git repository that contains your current
directory, so the skills do not end up in a subdirectory. Outside a git
repository, for example with `--entity`, it uses the current directory.

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

### Hook mode

`--hook` is meant to be run by an agent hook, which `ai hooks install` sets up
for you. In this mode the command:

- Always exits successfully. Any error, such as a missing login or an unreachable backend, is reported as short messages on standard error.
- Never starts a login. If you are not signed in, it asks you on standard error to run `backstage-cli auth login`.
- Only installs skills that are recorded in `skills-lock.json` with the same repository, ref, and directory and whose folder is missing from the skills directory of the target agent, for example `.claude/skills` for Claude Code. A skill that is only in the lock file, or only installed for another agent, is installed. A normal run installs every applicable skill again.
- Always installs into the project, and cannot be combined with `--global`.
- Discards the output of `skills` and writes at most one line to standard output, such as `Backstage: installed 2 skill(s), 1 up to date.`, because agents add the output of session start hooks to the session context. It prints nothing when no skill was installed.

Claude Code stops a hook after 120 seconds, which is the timeout that
`ai hooks install` sets. A large first install can take longer, so run
`ai skills sync` manually once before you rely on the hook.

Because installed skills are skipped, a skill that changed in its repository is
not updated by the hook. Run `ai skills sync` without `--hook` to update the
installed skills.

## ai hooks install

Install a session start hook that runs `ai skills sync --hook` whenever you
start or resume a session with your coding agent.

```text
Usage: backstage-cli ai hooks install [options]

Options:
  --agent <string>     Agent to install the hook for, repeatable (required)
  --instance <string>  Name of the instance the hook uses
  --allow-file-sources Let the hook install skills whose source location is a local directory (file:)
  --dry-run            Print the resulting hook files without writing them
```

The hook is written to a file in the root of the git repository that contains
your current directory, or in the current directory outside a git repository.
In a linked checkout made with `git worktree`, it is in the root of the main
checkout, because that is where Claude Code reads it from.

| Agent         | File                          | Notes                                                                     |
| ------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `claude-code` | `.claude/settings.local.json` | A personal file that Claude Code does not share with your team.           |
| `codex`       | `.codex/hooks.json`           | Codex asks you to review and trust the hook with `/hooks` before it runs. |

Neither file is meant to be committed, because the hook contains paths that are
specific to your machine. When git does not already ignore the file, the
command adds it to the repository's `.git/info/exclude` and says so, so that the
hook is not committed by accident. It does not change `.gitignore`. Claude Code
only adds `settings.local.json` to your global git excludes when it writes the
file itself. If git already tracks the file, which can be the case for a shared
`.codex/hooks.json`, the command fails without writing anything.

Other agents fail with `hooks are not supported for <agent> yet`, and nothing
is written for any agent in that case. Cursor is not supported, because its
project hooks are meant to be committed and shared within your team.

`--instance` accepts letters, digits, `.`, `_`, and `-`, and cannot start with `-`.

The hook entry runs the same Node.js and CLI binary that ran
`ai hooks install`, by absolute path, with
`ai skills sync --hook --agent <agent>` and the `--instance` you passed. Because
the paths are specific to your machine, do not commit these files, and run
`ai hooks install` again if you move the project's `node_modules`, switch
Node.js versions, or change the CLI location. The command replaces its own entry
when you run it again and keeps all other settings and hooks. It fails without
writing if an existing file is not valid JSON or does not have the expected
shape.

To remove the hook, delete the entry whose command contains
`ai skills sync --hook` from the file.

### Examples

```bash
# Show what would be written
yarn backstage-cli ai hooks install --agent claude-code --dry-run

# Install the hook for Claude Code using a named instance
yarn backstage-cli ai hooks install --agent claude-code --instance production
```

:::warning

A session start hook installs the skills that the catalog selects for you, with
no confirmation, at the start of every session. Everything in
[Security considerations](#security-considerations) applies on every session
instead of only when you run the command. Review the selection with
`ai resolve` first, and only install the hook for catalogs that you trust.

:::

## Local skill sources

A skill can point at a directory on your machine instead of a Git repository,
with a source location of the form `file:<absolute path>`. This lets you write
and test a skill, or run a demo, without publishing the skill first.

```yaml
metadata:
  annotations:
    backstage.io/source-location: file:/home/me/skills/my-skill
```

Local sources are off by default, because anyone who can register catalog
entities can set the annotation, and the path refers to your own machine. Pass
`--allow-file-sources` to `ai resolve`, `ai skills sync`, or `ai hooks install`
to use them. `ai hooks install` adds the flag to the hook command. Without the
flag, `ai resolve` reports these skills as skipped with the reason
`file sources are disabled; pass --allow-file-sources`.

With the flag, the path must be absolute, exist, be a directory, and contain
`SKILL.md` directly. A trailing slash and the `file:///absolute/path` form are
accepted, percent-encoded characters such as `%20` are decoded in both forms, and symlinks are resolved to the real path, which is what `skills add`
receives. Skills that share a directory are installed once. In hook mode, a
local skill is skipped when `skills-lock.json` records it from the same
directory and its folder is present, so edits to the skill are not picked up
by the hook. Run `ai skills sync --allow-file-sources` to install them again.

:::warning

`skills` copies the whole skill directory, including hidden files such as `.env`
(it leaves out only `.git`, `__pycache__`, and `metadata.json`) and follows
symlinks, into `.agents/skills/<name>` or `.claude/skills/<name>` in your
project. A `.env` file, or a symlink to a private key, in the skill directory
therefore ends up in your repository tree, where your agent can read it and
where it can be committed. Keep skill directories free of secrets and add the
installed skills directories to your `.gitignore`.

The catalog also decides which directory is installed. Only use
`--allow-file-sources` on machines where you control the paths that the catalog
entries point at.

:::

## How skills are selected

A skill is selected when all of the following are true:

1. **Scope:** the skill is `partOf` the component's system, or it is `ownedBy` the component's owner, one of your groups, or an ancestor group of either.
2. **Agent:** the skill's `spec.agents` is absent or empty, or it contains at least one target agent.
3. **Installable:** the skill has a `backstage.io/source-location` annotation of the form `url:<git tree URL>`, or `file:<absolute path>` with `--allow-file-sources`, that points at a directory containing `SKILL.md`. See [Making skills installable](../../ai/ai-in-the-catalog.md#making-skills-installable).

Skills that fail a check are reported as skipped, with the reason.

The module also follows `dependsOn` relations from every selected skill and
adds the referenced skills transitively. Dependencies are added even when they
are outside the scope match, but the agent and installable checks still apply
to them.

Each selected skill is installed with its own `skills add` invocation that uses
the skill's source location. A repository with several selected skills is
therefore fetched once per skill. Skills that share the same source location
are installed once.

## Security considerations

`ai skills sync` installs skills without asking for confirmation. Skills are
instructions that your coding agent follows, so treat the catalog as a trusted
source of them:

- Anyone who can register an `AiResource` that is owned by a widely shared group, such as an ancestor group of many teams, or that is `partOf` a system, gets that skill installed for every matching user who runs the command.
- Ownership and system membership are declared in the catalog and are not verified against the skill's source repository.
- Review what would be installed with `ai resolve` or `ai skills sync --dry-run` before you sync.
- Control who can register catalog locations and entities, for example with catalog location allow lists and permissions.

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
dependencies, so the `skills` package itself is not downloaded when you run the
command. Fetching the skills from their repositories is done by `skills`. The module depends on how
the `skills add` command parses GitHub and GitLab tree URLs and on its `-a`,
`-y`, and `-g` flags. Other versions are not supported.

### Telemetry

`skills` can report anonymous usage telemetry, which may include the source
repository path, the skill names, and the target agents. To keep private
repository details out of it, the module runs `skills` with
`DISABLE_TELEMETRY=1` by default. If you already set `DISABLE_TELEMETRY` in your
environment, your value is used instead. To opt in to telemetry, set
`DISABLE_TELEMETRY` to an empty string.

### GitHub Enterprise

`skills` only recognizes tree URLs on a GitHub Enterprise host when the
`GH_HOST` environment variable matches that host. For these sources the module
sets `GH_HOST` for that one invocation only.

## Limitations

- Skills that were synced earlier are never removed, even if they no longer apply. Use `skills remove` to remove them.
- Rules are not handled. Only skills are installed.
- Skills with a ref that contains `/`, GitHub Enterprise hosts with a port, and refs or paths that contain `#`, `?`, or `\` are skipped.
- Source locations without the GitLab `/-/` form must have exactly an `owner/repo` path before `/tree/`. GitLab sources in nested groups need the `/-/tree/` form.
- Only GitHub and GitLab `origin` remotes can be matched to a component automatically. For other hosts, pass `--entity`.
