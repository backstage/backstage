---
'@backstage/cli': patch
---

Added a new `repo start` command to replace the existing pattern of using `yarn dev` scripts. The `repo start` command runs the app and/or backend package in the repo by default, but will also fall back to running other individual frontend or backend packages or even plugin dev entry points if the can be uniquely selected.

The goal of this change is to reduce the number of different necessary scripts and align on `yarn start` being the only command needed for local development, similar to how `repo test` handles testing in the repo. It also opens up for more powerful options, like the `--plugin <pluginId>` flag that runs the dev entry point of the selected plugin.

The new script is installed as follows, replacing the existing `yarn start` script:

```json
{
  "scripts": {
    "start": "backstage-cli repo start"
  }
}
```

In order to help users migrate in existing projects, it is recommended to add the following scripts to the root `package.json`:

```json
{
  "scripts": {
    "dev": "echo \"Use 'yarn start' instead\"",
    "start-backend": "echo \"Use 'yarn start backend' instead\""
  }
}
```

For more information, run `yarn start --help` once the new command is installed.
