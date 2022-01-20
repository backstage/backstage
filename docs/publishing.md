<!-- This is intentionally left out of the microsite, since it only applies to the main repo -->

## npm

npm packages are published through CI/CD in the
[`.github/workflows/deploy_packages.yml`](https://github.com/backstage/backstage/blob/master/.github/workflows/deploy_packages.yml)
workflow. Every commit that is merged to master will be checked for new versions
of all public packages, and any new versions will automatically be published to
npm.

### Creating a new release

Releases are handled by changesets and trigger whenever the "Version Packages"
PR is merged. This is typically done every Thursday around noon CET.

## Emergency Release Process

**This emergency release process is intended only for the Backstage
maintainers.**

For this example we will be using the `@backstage/plugin-foo` package as an
example and assume that it is currently version `1.5.0` in the master branch.

In the event of a severe bug being introduced in version `1.5.0` of the
`@backstage/plugin-foo` released in the `2048-01-01` release, the following
process is used to release an emergency fix as `1.5.1`:

- [ ] Identify the release or releases that need to be patched. We should always
      patch the most recent main-line release if needed, which in this example
      would be `2048-01-01`. The fix may also need backporting to older major
      versions, in which case we will want to patch the main-line release just
      before the one that bumped the package to each new major version.
- [ ] Repeat the following steps for each release that needs to be patched:

  - [ ] Make sure a patch branch exists for the release that is being patched.
        If a patch already exists, reuse the existing branch. The branch **must
        always** be named exactly `release-<release>-patch`.

    ```bash
    git checkout release-2048-01-01
    git checkout -b release-2048-01-01-patch
    git push --set-upstream origin release-2048-01-01-patch
    ```

  - [ ] With the `release-2048-01-01-patch` branch as a base, create a new
        branch for your fix. This branch can be named anything, but the
        following naming pattern may be suitable:

    ```bash
    git checkout -b ${USER}/release-2048-01-01-emergency-fix
    ```

  - [ ] Create a single commit that applies fixes and creates a new patch
        changeset for the affected package.
  - [ ] Run `yarn release` in the root of the repo in order to convert your
        changeset into package version bumps and changelog entries. Commit these
        changes as a second `"Generated release"` commit.
  - [ ] Create PR towards the base branch (`release-2048-01-01-patch`)
        containing the two commits.
  - [ ] Review/Merge the PR into `release-2048-01-01-patch`. This will
        automatically trigger a release.

- [ ] Once fixes have been created for each release, the fix should be applied
      to the master branch as well. Create a PR that contains the following:

  - [ ] The fix.
  - [ ] A changeset with the message "Apply fix from the x.y.z patch release",
        in this case `1.5.1`. You can find the version in your patch PR for the
        most recent release.
  - [ ] An entry in `.changeset/patched.json` that sets the current release to
        that same version:

    ```json
    {
      "currentReleaseVersion": {
        "@backstage/plugin-foo": "1.5.1"
      }
    }
    ```
