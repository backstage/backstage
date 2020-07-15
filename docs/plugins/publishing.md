# Publishing

## NPM

NPM packages are published through CI/CD in the
[.github/workflows/master.yml](../.github/workflows/master.yml) workflow. Every
commit that is merged to master will be checked for new versions of all public
packages, and any new versions will automatically be published to NPM.

### Creating a new release

Version bumps are made through release PRs. To create a new release, checkout
out a new branch that you will use for the release, e.g.

```sh
$ git checkout -b new-release
```

Then, from the root of the repo, run

```sh
$ yarn release
```

This will bring up the lerna release CLI where you choose what type of version
bump you want to make, (major/minor/patch/prerelease). The CLI will take you
through choosing a version, previewing all changes, and then approving the
release. Once the release is approved, a new commit is created that you can
submit as a PR. Push the branch to GitHub:

```sh
$ git push origin -u new-release
```

And then create a PR. Once the PR is approved and merged into master, the master
build will publish new versions of all bumped packages.

[Back to Docs](README.md)
