---
id: module-maintenance
title: Maintenance Module
description: CLI commands for repository maintenance and deprecation tracking.
---

The maintenance module (`@backstage/cli-module-maintenance`) fixes common
package issues and tracks deprecations across the project.

## repo fix

Automatically fix packages in the project. This command scans all packages and
applies automated fixes for common issues such as missing or incorrect
configuration.

```text
Usage: backstage-cli repo fix [options]

Automatically fix packages in the project
```

## repo list-deprecations

List deprecations found across all packages in the project. Use the output to
track deprecated API usage and plan migration work.

```text
Usage: backstage-cli repo list-deprecations [options]

List deprecations
```
