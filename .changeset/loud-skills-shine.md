---
'@backstage/cli-module-ai': patch
---

Made the output of the AI commands easier to read, and added a way to check what is installed.

- `backstage-cli ai resolve` groups skills into selected and skipped, ends with a summary, and uses colors on a terminal.
- `backstage-cli ai skills sync` prints one line per installed skill and a closing summary.
- `backstage-cli ai hooks install --dry-run` shows only the hook it would add, instead of the whole settings file.
- New `backstage-cli ai skills status` shows which of the applicable skills are installed. Add `--check` to fail when one is missing.
