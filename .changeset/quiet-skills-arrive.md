---
'@backstage/cli-module-ai': minor
---

Added a new CLI module, `@backstage/cli-module-ai`, that installs AI skills from your Backstage catalog into your coding agents. It is not part of the default CLI modules, so add it to your root `package.json` to use it.

- `backstage-cli ai resolve` shows which `AiResource` skills apply to the component you are working on, and why each was or was not selected.
- `backstage-cli ai skills sync` installs the applicable skills into agents such as Claude Code, Codex, and Cursor, using skills.sh. It requires Node.js 22.20 or later, and turns skills.sh telemetry off unless you set `DISABLE_TELEMETRY`.
- `backstage-cli ai skills status` shows which of those skills are installed, and `--check` fails when one is missing.
- `backstage-cli ai hooks install` adds a session start hook for Claude Code or Codex that keeps your skills in sync without interrupting your session.
- A skill can point at a directory on your machine with a `file:` source location, to develop and test it before publishing. These are only used with `--allow-file-sources`.
