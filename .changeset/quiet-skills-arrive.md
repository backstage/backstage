---
'@backstage/cli-module-ai': minor
---

Added a new CLI module for installing AI skills from your Backstage catalog. `backstage-cli ai resolve` shows which `AiResource` skills apply to the repository you are working in, based on its catalog system and owner and on your groups, and explains why each skill was or was not selected. `backstage-cli ai skills sync` installs those skills into your coding agents, such as Claude Code, Codex, and Cursor, using skills.sh, and requires Node.js 22.20 or later. Telemetry in skills.sh is disabled by default; set `DISABLE_TELEMETRY` yourself to change that. `backstage-cli ai hooks install` adds a session start hook for Claude Code that keeps those skills in sync automatically, without interrupting your session or asking you to log in again. The module is not part of the default CLI modules; add `@backstage/cli-module-ai` to your root `package.json` to use it.
