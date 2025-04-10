---
'@backstage/create-app': patch
---

Updated the root `package.json` in the template to use the new `backstage-cli repo start` command.

The `yarn dev` command is now redundant and has been removed from the template. We recommend existing projects to add these or similar scripts to help redirect users:

```json
{
  "scripts": {
    "dev": "echo \"Use 'yarn start' instead\"",
    "start-backend": "echo \"Use 'yarn start backend' instead\""
  }
}
```
