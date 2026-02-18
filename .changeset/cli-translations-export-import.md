---
'@backstage/cli': patch
---

Added `translations export` and `translations import` commands for managing translation files.

The `translations export` command discovers all `TranslationRef` definitions across frontend plugin dependencies and exports their default messages as JSON files. The `translations import` command generates `TranslationResource` wiring code from translated JSON files, ready to be plugged into the app.

Both commands support a `--pattern` option for controlling the message file layout, for example `--pattern '{lang}/{id}.json'` for language-based directory grouping.
