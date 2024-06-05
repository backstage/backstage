---
title: Plugin Metadata
status: provisional
authors:
  - '@Rugvip'
owners:
  - '@backstage/maintainers'
project-areas:
  - core
creation-date: yyyy-mm-dd
---

<!--
**Note:** When your BEP is complete, all these pre-existing comments should be removed

When editing BEPs, aim for tightly-scoped, single-topic PRs to keep discussions focused. If you disagree with what is already in a document, open a new PR with suggested changes.
-->

# BEP: Plugin Metadata

<!-- Before merging the initial BEP PR, create a feature issue and update the below link. You can wait with this step until the BEP is ready to be merged. -->

[**Discussion Issue**](https://github.com/backstage/backstage/issues/NNNNN)

- [Summary](#summary)
- [Motivation](#motivation)
  - [Goals](#goals)
  - [Non-Goals](#non-goals)
- [Proposal](#proposal)
- [Design Details](#design-details)
- [Release Plan](#release-plan)
- [Dependencies](#dependencies)
- [Alternatives](#alternatives)

## Summary

<!--
The summary of the BEP is a few paragraphs long and give a high-level overview of the features to be implemented. It should be possible to read *only* the summary and understand what the BEP is proposing to accomplish and what impact it has for users.
-->

## Motivation

All Backstage adopters benefit from it being easy to find, install, configure, and validate the setup of plugins and modules. That's regardless of whether one is only using a minimal set of core plugins, or installing a large number of 3rd party features from the Backstage ecosystem. This proposal aims to build upon our [existing package metadata](https://backstage.io/docs/tooling/cli/build-system#package-roles) to introduce a new set of standardized fields that plugins can use to provide additional information about themselves.

This metadata will be used to improve tooling in and around Backstage, such as providing better validation and more powerful utilities in the Backstage CLI, and more information to be surfaced in association with plugins for better discoverability.

### Goals

We want to provide a new set of standardized fields that makes it possible to build tooling that improves the following interactions with the Backstage ecosystem:

- Browsing packages related to a plugin, i.e. listing all available library packages and frontend/backend variants of a specific plugin.
- Discoverability of plugin modules. Given a plugin you should be able to identify all of its modules.

Furthermore this proposal should also lay the foundation for how we define additional metadata fields in the future. How they are validated, documented, and surfaced in the Backstage ecosystem.

In relation to the above, this proposal will aim to define what existing `package.json` fields are known in the Backstage ecosystem, and what their purpose is. This will help avoid duplication of fields, and aim to reduce metadata fragmentation.

Where appropriate, this new metadata will be made required for all packages that are published using Backstage's tooling. This will ensure that packages across the ecosystem are consistent in how they provide metadata. This requirement should not be unnecessarily strict, ideally only requiring fields that either have sensible defaults or that can be inferred from workspace content.

These goals must all be reached in a way that does not risk intentional or unintentional disruption of the metadata. For example it should not be possible for an unrelated package to claim to be part of a group of plugin packages that it is not part of.

### Non-Goals

The surfacing of extensive implementation metadata is not in scope for this proposal. This includes for example the extension point and extensions exported by a plugin, what route references a frontend plugin has, or what API endpoints a backend plugin exposes.

This proposal will not aim to standardize any other fields that are not included in the above [goals](#goals). It will provide the foundation for how to define such fields, but not the fields themselves. This includes any informational fields such as package lifecycle or usage, but also fields that provide functional requirements, such as plugin dependencies or environment restrictions.

This proposal does not aim to provide any direct solution for plugin support metadata as proposed in [#10256](https://github.com/backstage/backstage/pull/10256). Many of the fields defined as followups to this proposal may cover the support metadata use-case, but what is also important for such a solution is to be able to provide local overrides for the metadata, which this proposal does not cover. We do however want to make sure that this use-case is taken into consideration when defining new metadata fields.

## Proposal

The proposal is split into separate sections, each contributing to the overall solution in different ways.

### Validation & Automation

The purpose of this section is to define how we make it as simple as possible to populate the metadata fields, and how we ensure that the metadata is present and correct.

Validation and automation is split into two separate phases. The first is phase is manual tooling that is run by the developer and typically validated in CI, for example the `backstage-cli fix` command. The second phase is validation at the time of publishing the package, which is done by the `yarn prepack` command. By splitting the tooling into these two phases we can ensure that a minimal set of metadata is present for all packages published using the Backstage tooling, but at the same time avoid adding unnecessary friction to the development process.

An important aspect to take into consideration is that most Backstage packages are never published to NPM, as they're part of an internal monorepo and get built directly into an internal Backstage application. Defining the full set of metadata for these packages is likely to be wasteful, which means we should avoid building too many requirements for that path.

### Package Metadata and Documentation

This section defines our strategy for defining new metadata fields, and how they are documented.

To the furthest extent possible we will rely on established standards for `package.json` fields, but we will do so within the bounds of the intended usage of these fields. This means that we will only use existing fields for their intended purpose, and instead define new fields if no existing field is suitable. An index of existing fields is found in the [NPM documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json), but we are not limited to this list. Any fields that we can find within the NPM ecosystem may be used, as long as they are well established, for example if there could be a use for the `prettier` field [defined by prettier](https://prettier.io/docs/en/configuration.html#sharing-configurations).

In the case of new fields we always define them to be part of the top-level `"backstage"` field. The assumption is that any field that we define will always be tied to the Backstage ecosystem, even in the case of general fields such as "lifecycle". The only exception to this is if we believe that a field is generic enough that it could genuinely become part of the broader NPM ecosystem.

All fields must be documented in a new section of the "Tooling" documentation on backstage.io. This documentation should include a description of the field, what it is used for, and what the expected values are. The documentation must also mention whether the field is expected to be filled in manually, or if it will be generated by tooling. Changes to this documentation must be approved by the Backstage core maintainers, it is not owned by individual project area maintainers.

### Package Relationships

This section defines how we associate packages from the same plugin with each other.

Packages that are part of the same plugin should always be managed within the same monorepo and workspace. This does not apply to modules for a plugin, which may be hosted separately, but may still need to refer to the plugin that it is a module for.

Each plugin package must define a `backstage.pluginId` field, which is the same identifier as is used in the implementation of the plugin. This field is inferred from the package name by the `backstage-cli repo fix` command if it is not present. It should only be defined for plugin package, for example `@backstage/errors` should not define a plugin ID. The `backstage.pluginId` field is required when publishing a package with a plugin or module role, or a library role with "plugin" in its name.

The package relationships are defined in the `backstage.pluginPackages` field. The value of the field is an object where each key is the role of the package as defined by the `backstage.role` field, and the value is the package name. For example:

```json
{
  "name": "@backstage/plugin-catalog",
  "backstage": {
    "role": "frontend-plugin",
    "pluginId": "catalog",
    "pluginPackages": {
      "frontend-plugin": "@backstage/plugin-catalog",
      "backend-plugin": "@backstage/plugin-catalog-backend",
      "web-library": "@backstage/plugin-catalog-react",
      "node-library": "@backstage/plugin-catalog-node",
      "common-library": "@backstage/plugin-catalog-common"
    }
  }
}
```

The `backstage.pluginPackages` field is generated and updated by the `backstage-cli repo fix` command based on the packages that are present in the workspace and their `backstage.pluginId` and `backstage.role` fields. There can only be a single package of each role with a given plugin ID. The `backstage.pluginPackages` field is required when publishing a package with a `backstage.pluginId` field that is not using a module role.

Module packages define their target plugin both via the `backstage.pluginId` field, as well as via `backstage.pluginPackage`. For example:

```json
{
  "name": "@backstage/plugin-catalog-backend-module-github",
  "backstage": {
    "role": "backend-plugin-module",
    "pluginId": "catalog",
    "pluginPackage": "@backstage/plugin-catalog-backend"
  }
}
```

The `backstage.pluginPackage` field is required when publishing a package with a module role.

## Design Details

_-_

### References & Prior Art

The following resources have been used to inform this proposal:

- [package.json documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [VSCode Extensions](https://code.visualstudio.com/api/references/extension-manifest)

## Release Plan

TBD

<!--
This section should describe the rollout process for any new features. It must take our version policies into account and plan for a phased rollout if this change affects any existing stable APIs.

If there is any particular feedback to be gathered during the rollout, this should be described here as well.
-->

## Dependencies

None

<!--
List any dependencies that this work has on other BEPs or features.
-->

## Alternatives

### Separate Metadata File

This proposal suggests that we keep metadata in the `package.json` file. An alternative would be to define a separate metadata file, for example `backstage.json` or `backstage.yaml`.

A benefit of this approach is that we do not pollute the `package.json` file with additional metadata, which can help keep overall metadata easier to browse and understand. It also allows us to use our own format, such as allowing comments in JSON, or using YAML for easier readability.

A downside of this approach is that it introduces a bit more complexity and friction in the tooling and package publishing, because we need to make sure that the metadata file is always included in the published package. We also end up with additional logic for finding and parsing this file, whereas resolving and parsing `package.json` is already a solved problem.

One of the larger benefits of keeping package metadata `package.json` is that it makes the data immediately available in registry APIs. It avoids the need to download and parse additional files to get the metadata for a package. For this reason we believe that we should stick to using `package.json` for metadata for the time being. If we for some reason in the future find that we need to use a separate file, for example because the metadata becomes too large, we can always evolve the `backstage` field in a couple of different ways:

```json
{
  // Moving all data to a separate file
  "backstage": "backstage.json"
}
{
  // Moving some data to a separate file
  "backstage": {
    "role": "frontend-plugin",
    "metadata": "backstage.json"
  }
}
```
