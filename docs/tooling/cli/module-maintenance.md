---
id: module-maintenance
title: Maintenance Module
description: CLI commands for repository maintenance and deprecation tracking.
---

The maintenance module (`@backstage/cli-module-maintenance`) provides commands
for automatically fixing common issues in packages and tracking deprecations
across the project.

## repo fix

Automatically fix packages in the project. This command scans all packages and
applies automated fixes for common issues such as missing or incorrect
configuration.

```text
Usage: backstage-cli repo fix [options]

Automatically fix packages in the project
```

## repo list-deprecations

List deprecations found across all packages in the project. This is useful for
tracking usage of deprecated APIs and planning migration work.

```text
Usage: backstage-cli repo list-deprecations [options]

List deprecations
```
