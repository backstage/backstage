---
id: versioning-policy
title: Versioning Policy
description:
---

## The Purpose <!-- of this doc - for us - the authors - when writing it - delete after -->

- Release cadence and naming 1.0, 1.1, 1.2, etc.
  - does not map to semver
  - Backstage 1.2 is a manifest of multiple versions of packages.
- X need to be greater then Y or there will be dragons
- X is supported for N versions

<!--

- https://kubernetes.io/releases/version-skew-policy/
- https://kubernetes.io/docs/reference/using-api/deprecation-policy/

 -->

## Backstage releases

<!-- Less technical introduction -->

A Backstage release is a manifest of several packages and plugins that work well
together. The overarching version of this manifest is decoupled from the
individual package versions.

There are two different release lines, each with their own versioning policy and
release cadence. The first one is the main release line, which provides
regularly scheduled and releases with high stability. On top of that there is a
Next release line which provides early access to changes in the upcoming main
release.

## Release Lines

### Main Release Line

Current release cadence: Once every 1 months

The main release line in versioned with a major and minor version and does not
adhere to [semver](https://semver.org).

The major release if there ever is one, will denote a significant improvement or
change to the Backstage platform. It may come with a large new set of features,
or a switch in the product direction, but other than that it is not different
than a minor release.

Minor releases are the most common type of release and the one that is used by
default. Each new minor version can contain new functionality, breaking changes,
and bug fixes.

Both major and minor releases are governed by the
[versioning policy](#versioning-policy) in the same way, both of them being
treated as one incremental release.

### Next Release Line

Release cadence: Weekly

The next release is a weekly snapshot of the project. This is the quickest way
to get access to new functionality in Backstage but there is no guarantees
around breaking changes in these releases.

## Package versioning

Every individual package is versioned according to [semver](https://semver.org).
This versioning is completely decoupled from the Backstage release versioning,
meaning you might for example have `@backstage/core-plugin-api` version `3.1.4`
be part of the `1.12` Backstage release.

## Versioning policy

The following versioning policy applies to the main release line. The next
release line provides no guarantees.

The versioning policy applies to all packages that are part of the main release
line, i.e. on version 1.0 or above.

- Each release may contain breaking changes, but they will only be done when
  necessary and with as low impact as possible. When possible, there will always
  be a deprecation path for a breaking change.
- Breaking changes are introduced with a clear upgrade path.
- Deprecations are valid for the duration of a single release, after which they
  may be completely removed.
- Security fixes **may** be backported to older releases based on the simplicity
  of the upgrade path and severity of the vulnerability.
- We will do our best to adhere to this policy.

The purpose of the Backstage Stability Index is to communicate the stability of
various parts of the project. It is tracked using a scoring system where a
higher score indicates a higher level of stability and is a commitment to
smoother transitions between breaking changes. Importantly, the Stability Index
does not supersede [semver](https://semver.org/), meaning we will still adhere
to semver and only do breaking changes in minor releases as long as we are on
`0.x`.

Each package or section is assigned a stability score between 0 and 3, with each
point building on top of the previous one:

- **0** - Breaking changes are noted in the changelog, and documentation is
  updated.
- **1** - The changelog entry includes a clearly documented upgrade path,
  providing guidance for how to migrate previous usage patterns to the new
  version.
- **2** - Breaking changes always include a deprecation phase where both the old
  and the new APIs can be used in parallel. This deprecation must have been
  released for at least two weeks before the deprecated API is removed in a
  minor version bump.
- **3** - The time limit for the deprecation is 3 months instead of two weeks.

## Version Skew Policy

In order for Backstage to function properly the following versioning rules must
be followed. The rules are referring to the
[Package Architecture](https://backstage.io/docs/overview/architecture-overview#package-architecture).

- The versions of all the packages in the `Frontend App Core` must be from the
  same release, and it is recommended to keep `Common Tooling` on that release
  too.
- The Backstage dependencies of any given plugin should be from the same
  release. This includes the packages from `Common Libraries`,
  `Frontend Plugin Core`, and `Frontend Libraries`, or alternatively the
  `Backend Libraries`.
- There must be no package that is from a newer release than the
  `Frontend App Core` packages in the app.
- Frontend plugins with a corresponding backend plugin should be from the same
  release. The update to the backend plugin **MUST** be deployed before or
  together with the update to the frontend plugin.
