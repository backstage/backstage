---
id: versioning-policy
title: Release & Versioning Policy
description: The process and policy for releasing and versioning Backstage
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

Release cadence: Monthly, specifically on the Tuesday before the third Wednesday of each month. The first release took place in March 2022.

The main release line is versioned with a major, minor and patch version but
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
bound to the regular cadence and are instead released whenever needed.

## Next Release Line

Release cadence: Weekly, specifically on Tuesdays.

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
  of the upgrade path, and the severity of the vulnerability. Vulnerabilities
  with a severity of `high` or `critical` will always be backported to releases
  for the last 6 months if feasible.
- Bug reports are valid only if reproducible in the most recent release, and bug
  fixes are only applied to the next release.
- We will do our best to adhere to this policy.

### Skew Policy

In order for Backstage to function properly the following versioning rules must
be followed. The rules are referring to the
[Package Architecture](https://backstage.io/docs/overview/architecture-overview#package-architecture).

- The versions of all packages for each of the "App Core" groups must be from the
  same Backstage release.
- For each frontend and backend setup, the "App Core" packages must be ahead of or on the same Backstage release as the "Plugin Core" packages, including transitive dependencies of all installed plugins and modules.
- For any given plugin, the versions of all packages from the "Plugin Core" and
  "Library" groups must be from the same Backstage release.
- Frontend plugins with a corresponding backend plugin should be from the same
  release. The update to the backend plugin **MUST** be deployed before or
  together with the update to the frontend plugin.

It is allowed and often expected that the "Plugin Core" and "Library" packages
are from older releases than the "App Core" packages. It is also allowed to have
duplicate installations of the "Plugin Core" and "Library" packages. This is all
to make sure that upgrading Backstage is as smooth as possible and allows for
more flexibility across the entire plugin ecosystem.

## Package Versioning Policy

Every individual package is versioned according to [semver](https://semver.org).
This versioning is completely decoupled from the Backstage release versioning,
meaning you might for example have `@backstage/core-plugin-api` version `3.1.4`
be part of the `1.12` Backstage release.

The following versioning policy applies to all packages:

- Breaking changes are noted in the changelog, and documentation is updated.
- Breaking changes are prefixed with `**BREAKING**:` in the changelog.
- All public exports are considered stable and will have an entry in the
  changelog.
- Breaking changes are recommended to document a clear upgrade path in the
  changelog. This may be omitted for newly introduced or unstable packages.

For packages at version `1.0.0` or above, the following policy also applies:

- All exports are marked with a [release stage](#release-stages).
- Breaking changes to stable exports include a deprecation phase if possible.
  The deprecation must have been released for at least one mainline release
  before it can be removed.
- The release of breaking changes document a clear upgrade path in the
  changelog, both when deprecations are introduced and when they are removed.
- Breaking changes to `@alpha` or `@beta` exports must result in at least a minor
  version bump, and may be done without a deprecation period.

### Changes that are Not Considered Breaking

There are a few changes that would typically be considered breaking changes, but
that we make exceptions for. This is both to be able to evolve the project more
rapidly, also because the alternative ends up having a bigger impact on users.

For all Utility APIs and Backend Services that _have_ a built-in implementation,
we only consider the API stability for consumers of those interfaces. This means
that it is not considered a breaking change to break the contract for producers
of the interface.

Changes that fall under the above rule, must be marked with
`**BREAKING PRODUCERS**:` in the changelog.

For any case of dependency injection, it is not considered a breaking change to
add a dependency on a Utility API or Backend Service that is provided by the
framework. This includes any dependency that is provided by the
`@backstage/app-defaults` and `@backstage/backend-defaults` packages.

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
following schedule for determining the [Node.js releases](https://nodejs.org/en/about/previous-releases) that we support:

- At any given point in time we support exactly two adjacent even-numbered
  releases of Node.js, for example v12 and v14.
- Once a new Node.js release becomes _Active LTS_ we switch to support that
  release and the previous one. The switch is not immediate but done as soon
  as possible. You can find the Node.js version supported by each release
  in the `engines` field in the root `package.json` of a new app.

When we say _Supporting_ a Node.js release, that means the following:

- The CI pipeline in the main Backstage repo tests towards the supported releases, and we encourage any other Backstage related projects to do the same.
- New Backstage projects created with `@backstage/create-app` will have their `engines.node` version set accordingly.
- Dropping compatibility with unsupported releases is not considered a breaking change. This includes using new syntax or APIs, as well as bumping dependencies that drop support for these versions.

Based on the above Backstage supports Node.js 20 and 22 as of the `1.33.0` release.

## TypeScript Releases

The Backstage project uses [TypeScript](https://www.typescriptlang.org/) for type checking within the project, as well as external APIs and documentation. It is important to have a clear policy for which TypeScript versions we support, since we want to be able to adopt new TypeScript features, but at the same time not break existing projects that are using older versions.

The TypeScript release cadence is roughly every three months. An important aspect of the TypeScript versioning is that it does not follow semver. In particular, there is no differentiation between major and minor versions, both of them are breaking. One way to think about it is to merge the two, for example version 4.7 can be considered major version 47, 5.0 is 50, and so on. Within these releases there can be a number of patch releases, which do follow semver.

Our policy is to support the last 3 TypeScript versions, for example 4.8, 4.9, and 5.0. Converted to time, this means that we typically support the TypeScript version from the last six to nine months, depending on where in the TypeScript release window we are. This policy applies as a snapshot at the time of any given Backstage release, new TypeScript releases only apply to the following Backstage main-line release, not to the current one.

For anyone maintaining their own Backstage project, this means that you should strive to bump to the latest TypeScript version at least every 6 months, or you may encounter breakages as you upgrade Backstage packages. If you encounter any issues in doing so, please [file an issue in the main Backstage repository](https://github.com/backstage/backstage/issues/new/choose), as per this policy we should always support the latest version. In order to ensure that we do not start using new TypeScript features too early, the Backstage project itself uses the version at the beginning of the currently supported window, in the above example that would be version 4.8.

## PostgreSQL Releases

The Backstage project recommends and supports using PostgreSQL for persistent storage.

The PostgreSQL [versioning policy](https://www.postgresql.org/support/versioning/) is to release a new major version every year with new features which is then supported for 5 years after its initial release.

Our policy mirrors the PostgreSQL versioning policy - we will support the last 5 major versions. We will also test the newest and oldest versions in that range. For example, if the range we support is currently 13 to 17, then we would only test 13 and 17 explicitly.
