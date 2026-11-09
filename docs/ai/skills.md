---
id: skills
title: Published skills
description: Reusable AI skills for common Backstage development tasks.
---

Backstage publishes a set of curated _AI skills_ — self-contained guidance files that teach an AI coding assistant how to perform common Backstage engineering tasks. Skills are published to a [well-known endpoint](https://backstage.io/.well-known/skills/) on `backstage.io` and can be installed into your repository with the [`skills.sh`](https://skills.sh/) tool.

## Installing Skills

You need [Node.js](https://nodejs.org/) to run `npx`.

```bash
npx skills add https://backstage.io
```

This command reads the published index from `https://backstage.io/.well-known/skills/index.json` and allows you to select which of the available skills you want to install into your repository.

### Where skills are installed

`skills.sh` installs skills into your project for the coding agents you choose, in the folder each agent reads skills from. For example, Claude Code reads `.claude/skills/`, and Codex, Cursor, and GitHub Copilot read `.agents/skills/`. Add `-g` to install them for all your projects instead. See the [list of supported agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) for every agent's path.

Run `npx skills check` to see whether installed skills have updates, and `npx skills update` to install them. If you changed an installed skill to fit your project's conventions, review those changes after updating.

### Using Skills with Your AI Assistant

Agents that support skills read the description of each installed skill and load the skill when a task matches it, so you don't need to point the agent at a `SKILL.md` file. To make sure a specific skill is used, name it in your request.

For example, when migrating a plugin from Material-UI to Backstage UI with the
`mui-to-bui-migration` skill, choose between running the official codemod recipe
and finishing its leftovers, or migrating directly with standalone guidance. The
skill recommends the codemod for mechanical changes, but supports either path.
State your preference in the request; otherwise, the assistant asks before
starting. For example: "Migrate this plugin to Backstage UI using the standalone
guidance without running a codemod."

## Contributing New Skills

Skills are authored in the Backstage monorepo at `.agents/skills/`. Each skill lives in its own subdirectory and must include a `SKILL.md` file as the primary entry point. AI assistants working in the Backstage repository load every skill in this folder. `.claude/skills/` links to the same folder for Claude Code. On Windows, Claude Code only sees these skills if Git checks out symbolic links, which requires Developer Mode and `git config core.symlinks true`.

### Skill directory layout

```text
.agents/skills/
  index.json                        # Skills published to backstage.io
  <skill-name>/
    SKILL.md                        # Primary skill entry point (required)
    <optional-supporting-files>
```

### Writing a SKILL.md

A `SKILL.md` file must include a YAML front matter block with the following fields:

```markdown
---
name: <skill-name>
description: <short description used in the published index>
---

# Skill Title

Introductory paragraph explaining when and why to use this skill.

...
```

The `name` must match the directory name. The `description` is shown to users when they browse or install skills and should be one to two sentences describing the task the skill covers.

Keep skills focused on a single, well-defined task. A skill that tries to cover too many scenarios is harder to use effectively. Prefer concrete, step-by-step guidance, working code examples, and explicit notes about common pitfalls.

### Publishing the skill

Only the skills listed in `.agents/skills/index.json` are published to `backstage.io` and can be installed with `npx skills add`. Leave a skill out of the index if it is only useful for working on the Backstage repository itself, such as release tooling.

To publish a skill, add an entry with its name to the index:

```json
{
  "skills": [{ "name": "<skill-name>" }]
}
```

Then fill in its description and files from the skill folder:

```bash
node scripts/verify-skills.js --fix
```

Run the same command after renaming or removing a published skill, or changing its description or files. CI runs the script without `--fix` and fails if the index is out of date.

Also list the skill on the [well-known skills](./well-known-skills.md) page, under the section that fits it, and keep its entry there in line with what the skill covers. The script fails if the page lists a skill that isn't published, or leaves out one that is, but it can't tell when an entry's wording is out of date.

### Review process

All changes to skills go through the standard Backstage pull request process. When authoring or reviewing a skill, consider:

- **Accuracy** — Does the skill reflect current Backstage APIs and conventions?
- **Completeness** — Does it cover the most common cases a developer will encounter?
- **Safety** — Does it avoid patterns that could introduce security or correctness issues?
- **Scope** — Is the skill focused on a single task, or should it be split?

Skills are part of the published Backstage documentation surface, so they follow the same contribution guidelines as the rest of the docs. See [CONTRIBUTING.md](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) for the full contribution process.
