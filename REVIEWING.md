# Introduction

This file provides pointers for reviewing pull requests. While the main audience are reviewers, this can also be useful if you are contributing to the repository as well.

## Code Style

See [STYLE.md](./STYLE.md).

## Secure Coding Practices

Be sure to familiarize yourself with our [secure coding practices](./SECURITY.md#coding-practices).

## Changesets

We use changesets to track the changes in all published packages. Changesets both define what should go into the changelog of each package, but also what kind of version bump should be done for the next release.
An introduction to changesets can be found in our [contribution guidelines](./CONTRIBUTING.md#creating-changesets).

When reviewing a changeset, the most important things to look for are the bump level, i.e. `major` / `minor` / `patch`, and whether the content is accurate and if it's written in a way that makes sense when reading it in the changelog for each package.

### Reviewing Changeset Bump Levels

### Reviewing Changeset Content

Each changeset should be written in a way that describes the impact of the change for the end user of each package. The changesets end up in the changelog of each package, for example [@backstage/core-plugin-api](./packages/core-plugin-api/CHANGELOG.md). The changelogs are intended to provide both a summary of the new features as well as guidance in the case of breaking changes or deprecations.

Some things that changeset should NOT contain are:

- Internal architecture details - these are generally not interesting to end users, focus on the impact towards end users instead.
- Information related to a different package.
- A large amount of content, consider for example a separate migration guide instead, either in the package README or [./docs/](./docs/), and then link to that instead.
- Documentation - changesets can describe new features, but it should not be relied on for documenting them. Documentation should either be placed in [TSDoc](https://tsdoc.org) comments, package README, or [./docs/](./docs/).

### When is a changeset needed?

In general our changeset feedback bot will take care of informing whether a changeset is needed or not, but there are some edge cases. Whether a changeset is needed depends mostly on what files have been changed, but sometimes also

Changes that do NOT need a new changeset:

- Changes to any test, storybook, or other local development files, for example, `MyComponent.test.tsx`, `MyComponent.stories.tsx, `**mocks**/MyMock.ts`, `.eslintrc.js`, `setupTests.ts`, or `api-report.md`. Explained differently, it is only files that affect the published package that need changesets, such as source files and additional resources like `package.json`, `README.md`, `config.d.ts`, etc.
- When tweaking a change that has not yet been released, you can rely on and potentially modify the existing changeset.
- Changes that do not belong to a published packages, either because it's not a package at all, such as `docs/`, or because the package is private, such as `packages/app`.
- Changes that do not end up having an effect on the published package can be skipped, such as whitespace fixes or code formatting changes. It is also alright to include a short changeset for these kind of changes too.

### Changeset Examples

**Example 1**

A new `EntityList` component has been added to `plugins/catalog-react`.

#### GOOD

```md
---
'@backstage/plugin-catalog-react': minor
---

Added a new `EntityList` component that can be used to display detailed information about a list of entities.
```

The Catalog React library has reached version `1.x`, which means that feature additions that aren't breaking should be a `minor` change. We don't bother with too much documentation, keeping it short and sweet. The main purpose is to inform users that this new component exists and to give them an idea of how they can use it.

#### BAD

```md
---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added `EntityList` component.
Fixed a bug in the catalog index page.
```

This changeset is too short, it's best to give users an idea of how they can benefit from the new addition.

It also includes changes affecting both the Catalog and Catalog React library. It should be split into two separate changeset for each of the two packages, otherwise we'll end up with redundant and unrelated information in both changelogs.

```md
---
'@backstage/plugin-catalog-react': major
---

Added a new `EntityList` component that can be used to display detailed information about a list of entities. The component looks like this:

![EntityList screenshot](./screenshot.png)

It accepts the following properties:

- entities - The entities that should be listed.
- title - An optional formatting function for the list titles.
- dialog - An optional component that overrides the default details dialog.
```

This changeset is getting too detailed. It's not always bad to get this much into the weeds, but keep in mind that changesets are not easy to browse when search for information about specific APIs. It's better to document things like this separately and keep the changeset more lean. Also avoid linking to assets in changesets, keep them text-only.

The change is also marked as a breaking `major` change. This should be changed to `minor` since adding new APIs is never a breaking change.

## Review Checklist

- [ ] API Reports
  - [ ] Naming
  - [ ] Breaking changes
- [ ] Changesets
  - [ ] Content
  - [ ] Bump level
- [ ] Have tests been added for new features bug fixes?
- [ ] Has documentation been added?
