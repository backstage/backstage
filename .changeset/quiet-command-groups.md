---
'@backstage/cli-node': patch
---

Fixed CLIs created with `runCli` silently exiting when the root or a command group is invoked without a subcommand. They now display help for that level and complete successfully.

Help output now lists groups and commands in separate, alphabetically sorted sections. Groups preview up to five visible children, with an ellipsis for longer lists and a trailing slash for nested groups.
