---
id: builtin-actions
title: Builtin actions
description: Documentation describing the built-in template actions.
---

# Built-in Actions

This is the list of built-in template actions

## `fetch:plain`

Downloads content and places it in the workspacePath or optionally in a
subdirectory specified by the `targetPath` input option.

input:

- `url` (required) Relative path or absolute URL pointing to the directory tree
  to fetch.
- `targetPath` Target path within the working directory to download the contents
  to.

output: nothing

## `fetch:cookiecutter`

Downloads template from `url` and templates with cookiecutter

input:

- `url` (required) Relative path or absolute URL pointing to the directory tree
  to fetch.
- `targetPath` Target path within the working directory to download the contents
  to.
- `values` Values to pass on to cookiecutter for templating.

output: nothing

## `catalog:register`

Registers entity in the software catalog.

input:

- `catalogInfoUrl` (required) An absolute URL pointing to the catalog info file
  location.

output:

- `repoContentsUrl` An absolute URL pointing to the root of a repository
  directory tree.
- `catalogInfoPath` A relative path from the repo root pointing to the catalog
  info file, defaults to /catalog-info.yaml

## `publish:github`

Initializes a git repository of contents in workspacePath and publishes to
GitHub.

input:

- `repoUrl` (required) Repository location
- `repoVisibility` (optional, default: 'private') Possible values: 'private',
  'public' or 'internal'.

output:

- `remoteUrl` A URL to the repository with the provider
- `repoContentsUrl` A URL to the root of the repository

## `publish:gitlab`

Initializes a git repository of contents in workspacePath and publishes to
GitLab.

input:

- `repoUrl` (required) Repository location
- `repoVisibility` (optional, default: 'private') Possible values: 'private',
  'public' or 'internal'.

output:

- `remoteUrl` A URL to the repository with the provider
- `repoContentsUrl` A URL to the root of the repository

## `publish:bitbucket`

Initializes a git repository of contents in workspacePath and publishes to
Bitbucket.

input:

- `repoUrl` (required) Repository location
- `repoVisibility` (optional, default: 'private') Possible values: 'private',
  'public'.

output:

- `remoteUrl` A URL to the repository with the provider
- `repoContentsUrl` A URL to the root of the repository

## `publish:azure`

Initializes a git repository of contents in workspacePath and publishes to
Azure.

input:

- `repoUrl` (required) Repository location

output:

- `remoteUrl` A URL to the repository with the provider
- `repoContentsUrl` A URL to the root of the repository
