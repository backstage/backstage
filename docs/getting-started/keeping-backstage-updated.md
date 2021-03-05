---
id: keeping-backstage-updated
title: Keeping Backstage Updated
description: How to keep your Backstage App updated
---

Backstage is always improving, so it's a good idea to stay in sync with the
latest releases. Backstage is more of a library than an application or service;
similar to `create-react-app`, the `@backstage/create-app` tool gives you a
starting point that's meant to be evolved.

## Updating Backstage versions with backstage-cli

The Backstage CLI has a command to bump all `@backstage` packages you're using
to the latest versions:
[versions:bump](https://backstage.io/docs/cli/commands#versionsbump).

```bash
npx backstage-cli versions:bump
```

The reason for bumping all `@backstage` packages at once is dependency between
Backstage packages. React Context, for example, may not be referentially equal
if multiple versions of `@backstage/core` are loaded.

## Following @backstage/create-app changes

Staying up to date with new releases will keep your app up to date, but there
can also be changes to the `@backstage/create-app` template that may be
beneficial. For that purpose, any changes made to the template are documented
along with upgrade instructions in the
[changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)
of the `@backstage/create-app` package.
