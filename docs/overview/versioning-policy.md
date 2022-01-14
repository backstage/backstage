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

## Versioning Policy

The following versioning policy applies to the main release line. The next
release line provides no guarantees.

<!-- We will do our best to adhere to this policy. -->

- Each release may contain breaking changes, see the package versioning policy
  below for more details.
- Breaking changes in Packages that have reached version `>=1.0.0` will only be
  done when necessary and with as low impact as possible. When possible, there
  will always be a deprecation path for a breaking change.
- Security fixes **may** be backported to older releases based on the simplicity
  of the upgrade path and severity of the vulnerability.

### Version Skew Policy

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

## Package Versioning Policy

### Release Stages

The release stages(`@alpha`, `@beta` `@public`) refers to the
[TSDoc](https://tsdoc.org/) documentation tag of the export, and are also
visible in the API report of each package.

Backstage uses three stages to indicate the stability for each individual
package export.

- `@public` is considered stable.
- `@beta` exports will not be publicly visible in the package release.
- `@alpha` here be dragons. Exports will not be publicly visible in the package
  release.

### Package Versioning

Every individual package is versioned according to [semver](https://semver.org).
This versioning is completely decoupled from the Backstage release versioning,
meaning you might for example have `@backstage/core-plugin-api` version `3.1.4`
be part of the `1.12` Backstage release.

Following versioning policy applies to all packages:

- Breaking changes are noted in the changelog, and documentation is updated.
- Breaking changes are prefixed with `**BREAKING**: ` in the changelog.
- All public exports are considered stable and will have an entry in the
  changelog
- Breaking changes are recommended to document a clear upgrade path in the
  changelog. This may be omitted for newly introduced or unstable packages.

In addition, this applies to packages that have reached 1.0.0 or above:

- All exports are marked with a release stage.
- Breaking changes to stable exports include a deprecation phase if possible.
  The deprecation must have been released for at least one mainline release
  before it can be removed.
- The release of breaking changes document a clear upgrade path in the
  changelog, both when deprecations are introduced and when they are removed.
- Exports that have been marked as `@alpha` or `@beta` may receive breaking
  changes without a deprecation period, but the changes must still adhere to
  semver.

For mainline releases: Whether alpha and beta tagged exports need changesets
depends on how we end up releasing them, for example is it a separate version or
separate import? `@backstage/core-plugin-api/alpha`?

|--------|--------------------------------------------| | | 0.x | >=1.0 |
|--------|--------------------------------------------| | Alpha | changeset -
release | changeset - release | | Beta | changeset - release | changeset -
release | | Public | changeset + guide | deprecation |
|--------|--------------------------------------------|
