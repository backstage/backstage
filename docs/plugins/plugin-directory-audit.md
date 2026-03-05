---
id: plugin-directory-audit
title: Plugin Directory Audit
description: Details about the process for auditing plugins in the directory
---

## Audit Process

We have a simple process in place to audit the plugins in the Plugin Directory:

1. On a quarterly basis we run the following script: `node ./scripts/plugin-directory-audit.js --audit`
2. This script will flag any plugin as `inactive` that has not been updated on NPM in more than 365 days if it was `active`.
3. It will also flag any plugin that has not been updated on NPM in more than 365 days as `archived` if it was `inactive`.
4. For any plugin flagged as `inactive` or `archived` and has been updated on NPM in less than 365 days they will be flagged as `active` again.
5. These changes will then be submitted as a PR, approved and merged.

The impact of a plugin being set to `inactive` means they will show in the inactive section at the bottom of the Plugin Directory. A plugin that is set to `archived` will **not** show up in the Plugin Directory at all.

:::tip

If your plugin moved to `inactive` or `archived` and you update it, please submit a PR to update the status to `active`!

:::
