---
'@backstage/cli-module-actions': minor
---

Added improved CLI output formatting and UX for the actions module. The `list` command now groups actions by plugin source with colored headers and action titles. The `execute --help` command renders full action details including markdown descriptions. Complex schema types like objects, arrays, and union types are now accepted as JSON flags. Error messages from the server are now surfaced directly. The `sources add` and `sources remove` commands accept multiple plugin IDs at once.
