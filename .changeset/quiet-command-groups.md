---
'@backstage/cli-node': patch
---

Fixed CLIs created with `runCli` silently exiting when the root or a command group is invoked without a subcommand. They now display help for that level and complete successfully.

Command groups in help output now have descriptions such as "Command group for repo" instead of repeating the group name.
