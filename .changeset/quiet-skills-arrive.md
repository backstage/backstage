---
'@backstage/cli-module-ai': minor
---

Added a new CLI module, `@backstage/cli-module-ai`, that installs AI skills from your Backstage catalog into your coding agents. It is not part of the default CLI modules, so add it to your root `package.json` to use it.

- `backstage-cli ai resolve` shows which `AiResource` skills apply to the component you are working on, and why each skill was or was not selected. The component is found from your git `origin` repository and current folder, using the nearest `backstage.io/source-location`, or otherwise the nearest catalog file. Skills are matched on the component's system and owner, and on your groups.
- `backstage-cli ai skills sync` installs the applicable skills into agents such as Claude Code, Codex, and Cursor, using skills.sh. It requires Node.js 22.20 or later. Telemetry from skills.sh is turned off by default; set `DISABLE_TELEMETRY` yourself to change that.
- `backstage-cli ai hooks install` adds a session start hook for Claude Code or Codex that keeps your skills in sync, without interrupting your session or asking you to log in again.
- A skill can point at a directory on your machine with a `file:` source location, so you can develop and test skills before publishing them. These local sources are only used when you pass `--allow-file-sources`.
