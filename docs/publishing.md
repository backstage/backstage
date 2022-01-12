<!-- This is intentionally left out of the microsite, since it only applies to the main repo -->

## npm

npm packages are published through CI/CD in the
[`.github/workflows/master.yml`](https://github.com/backstage/backstage/blob/master/.github/workflows/master.yml)
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
processed is used to release an emergency fix as `1.5.1`:

- [ ] Identify the release that needs to be patched, in this case we're fixing a
      broken release, so it would be the most recent one, `2048-01-01`. In the
      event of a backported security fix, the release that has the last
      published version of each major version of the package should be the one
      patched.
- [ ] Make sure a patch branch exists for the release that is being patched. If
      a patch already exists, reuse the existing branch.

  ```bash
  git checkout release-2048-01-01
  git checkout -b release-2048-01-01-patch
  git push --set-upstream origin release-2048-01-01-patch
  ```

- [ ] With the `release-2048-01-01-patch` branch as a base, create a new branch
      for your fix:

  ```bash
  git checkout -b ${USER}/release-2048-01-01-emergency-fix
  ```

- [ ] Apply fixes and create a new patch changeset for the effected package,
      then commit these changes.
- [ ] Run `yarn release` in the root of the repo in order to convert your
      changeset into package version bumps and changelog entries. Commit these
      changes as a second `"Generated release"` commit.
- [ ] Create PR towards the base branch(`release-2048-01-01-patch`) containing
      the two commits.
- [ ] Review/Merge PR into `release-2048-01-01-patch`. This will automatically
      trigger a release.
- [ ] In the master branch, add a `.changeset/patched.json` to make sure that
      future releases of the packages are bumped accordingly:

  ```json
  {
    "currentReleaseVersion": {
      "@backstage/plugin-foo": "1.5.1"
    }
  }
  ```

- [ ] Apply the same fix towards master if needed and create appropriate
      changeset. In the changeset towards master you should refer back to all
      patch releases that also received the same fix.
