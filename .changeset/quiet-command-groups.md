---
'@backstage/cli-node': patch
---

Fixed CLIs created with `runCli` silently exiting when the root or a command group is invoked without a subcommand. They now display help for that level and complete successfully.

Help output now lists groups and commands in separate, alphabetically sorted sections. Group previews adapt to the terminal width, using 80 columns when unavailable. Nested groups expand breadth-first when space permits; unexpanded groups retain a trailing slash and truncated previews end in an ellipsis.
