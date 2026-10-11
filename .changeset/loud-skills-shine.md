---
'@backstage/cli-module-ai': patch
---

Improved the output of the AI module commands. `ai resolve` now groups skills into selected and skipped with a summary and colors on a terminal, `ai skills sync` shows one line per installed skill and a closing summary, and `ai hooks install --dry-run` shows only the hook it would add instead of the whole settings file. Added `ai skills status` to check which of the applicable skills are installed, with `--check` to fail when one is missing.
