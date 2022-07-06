---
id: versioning-policy
title: Release & Versioning Policy
description:
---

The Backstage project is comprised of a set of software components that together
form the Backstage platform. These components are both plugins as well as core
platform libraries and tools. Each component is distributed as a collection of
[packages](<https://en.wikipedia.org/wiki/Npm_(software)>), which in the end is
what you end up consuming as an adopter of Backstage.

The number of Backstage packages that build up an application can be quite
large, in the order of hundreds, with just the core platform packages being
counted in the dozen. This creates a challenge for the integrators of a
Backstage project, as there are a lot of moving parts and pieces to keep up to
date.

Our solution to this is collecting our most used components and their packages
into an umbrella version that we call a Backstage release. Each release is a
collection of packages at specific versions that have been verified to work
together. Think of it as a toolbox that comes with batteries included, but you
can always add more plugins and libraries from the open source ecosystem as well
as build your own.

## Release Lines

The Backstage project is structured around two different release lines, a
primary "main" release line, and a "next" release line that serves as a preview
and pre-release of the next main-line release. Each of these release lines have
their own release cadence and versioning policy.

## Main Release Line

Release cadence: Monthly

The main release line in versioned with a major, minor and patch version but
does **not** adhere to [semver](https://semver.org). The version format is
`<major>.<minor>.<patch>`, for example `1.3.0`.

An increment of the major version denotes a significant improvement or change to
the Backstage platform. It may come with a large new set of features, or a
switch in the product direction. These will be few and far between, and do not
have any set cadence. Policy-wise they are no different than a minor release.

Each regularly scheduled release will bring an increment to the minor version,
as long as it is not a major release. Each new minor version can contain new
functionality, breaking changes, and bug fixes, according the
[versioning policy](#release-versioning-policy).

Patch versions will only be released to address critical bug fixes. They are not
bound to the regular cadence and are instead releases whenever needed.

## Next Release Line

Release cadence: Weekly

The next release line is a weekly release of the project. Consuming these
releases gives you early access to upcoming functionality in Backstage. There
are however fewer guarantees around breaking changes in these releases, where
moving from one release to the next may introduce significant breaking changes.

## Release Versioning Policy

The following versioning policy applies to the main-line releases only.

- Breaking changes in Packages that have reached version `>=1.0.0` will only be
  done when necessary and with the goal of having minimal impact. When possible,
  there will always be a deprecation path for a breaking change.
- Security fixes **may** be backported to older releases based on the simplicity
  of the upgrade path, and the severity of the vulnerability.
- Bug reports are valid only if reproducible in the most recent release, and bug
  fixes are only applied to the next release.
- We will do our best to adhere to this policy.

### Skew Policy

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

For packages at version `1.0.0` or above, the following policy also applies:

- All exports are marked with a [release stage](#release-stages).
- Breaking changes to stable exports include a deprecation phase if possible.
  The deprecation must have been released for at least one mainline release
  before it can be removed.
- The release of breaking changes document a clear upgrade path in the
  changelog, both when deprecations are introduced and when they are removed.
- Exports that have been marked as `@alpha` or `@beta` may receive breaking
  changes without a deprecation period, but the changes must still adhere to
  semver.

### Release Stages

The release stages(`@alpha`, `@beta` `@public`) refers to the
[TSDoc](https://tsdoc.org/) documentation tag of the export, and are also
visible in the API report of each package.

Backstage uses three stages to indicate the stability for each individual
package export.

- `@public` - considered stable and are available in the main package entry
  point.
- `@beta` - Not visible in the main package entry point, beta exports must be
  accessed via `<package-name>/beta` or `<package-name>/alpha` imports.
- `@alpha` - here be dragons. Not visible in the main package entry point, alpha
  exports must be accessed via `<package-name>/alpha` imports.

## Node.js Releases

The Backstage project uses [Node.js](https://nodejs.org/) for both its development
tooling and backend runtime. In order for expectations to be clear we use the
following schedule for determining the [Node.js releases](https://nodejs.org/en/about/releases/) that we support:

- At any given point in time we support exactly two adjacent even-numbered
  releases of Node.js, for example v12 and v14.
- Three months before a Node.js release becomes _Active LTS_ we switch support
  to that release and the previous one. This is halfway through the _Current LTS_
  cycle for that release and occurs at the end of July every year.

When we say _Supporting_ a Node.js release, that means the following:

- The CI pipeline in the main Backstage repo tests towards the supported releases, and we encourage any other Backstage related projects to do the same.
- New Backstage projects created with `@backstage/create-app` will have their `engines.node` version set accordingly.
- Dropping compatibility with unsupported releases is not considered a breaking change. This includes using new syntax or APIs, as well as bumping dependencies that drop support for these versions.
