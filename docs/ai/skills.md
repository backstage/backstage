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

`skills.sh` copies skill files into your repository under a directory it manages (typically `.github/skills/` or a similar location depending on your configuration). Refer to the [`skills.sh` documentation](https://skills.sh/) for details on target paths and how to customize them.

After installation, you can modify the installed files to adapt them to your project's conventions. Subsequent updates from `npx skills add` will offer to merge upstream changes.

### Using Skills with Your AI Assistant

Once a skill is installed in your repository, attach or reference the relevant `SKILL.md` file when starting a task with your AI coding assistant. Most AI assistants in editors such as VS Code will automatically pick up instruction files that are committed to your repository.

For example, when migrating a plugin from Material-UI to Backstage UI, include the
`mui-to-bui-migration` skill. Choose between running the official codemod recipe
and finishing its leftovers, or migrating directly with standalone guidance. The
skill recommends the codemod for mechanical changes, but supports either path.
State your preference in the request; otherwise, the assistant asks before
starting. For example: "Migrate this plugin to Backstage UI using the standalone
guidance without running a codemod."

## Contributing New Skills

Skills are authored in the Backstage monorepo at `.agents/skills/`. Each skill lives in its own subdirectory and must include a `SKILL.md` file as the primary entry point. AI assistants working in the Backstage repository load every skill in this folder. `.claude/skills/` links to the same folder for Claude Code.

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

### Review process

All changes to skills go through the standard Backstage pull request process. When authoring or reviewing a skill, consider:

- **Accuracy** — Does the skill reflect current Backstage APIs and conventions?
- **Completeness** — Does it cover the most common cases a developer will encounter?
- **Safety** — Does it avoid patterns that could introduce security or correctness issues?
- **Scope** — Is the skill focused on a single task, or should it be split?

Skills are part of the published Backstage documentation surface, so they follow the same contribution guidelines as the rest of the docs. See [CONTRIBUTING.md](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) for the full contribution process.
