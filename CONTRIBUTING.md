# Contributing to Backstage

Our vision for Backstage is for it to become the trusted standard toolbox (read: UX layer) for the open source infrastructure landscape. Think of it like Kubernetes for developer experience. We realize this is an ambitious goal. We can’t do it alone.

Therefore we want to create a strong community of contributors -- all working together to create the kind of delightful experience that our developers deserve.

Contributions are welcome, and they are greatly appreciated! Every little bit helps, and credit will always be given. ❤️

Backstage is released under the Apache 2.0 License, and original creations contributed to this repo are accepted under the same license.

You can find out more about the types of contributions over at [getting involved](https://backstage.io/docs/getting-started/getting-involved)!

## Get Started!

So...feel ready to jump in? Let's do this. 👏🏻💯

Start by reading our [Getting Started for Contributors](https://backstage.io/docs/getting-started/contributors) page to get yourself setup with a fresh copy of Backstage ready for your contributions. If you need help, just jump into our [Discord chatroom](https://discord.gg/backstage-687207715902193673).

## Coding Guidelines

All code is formatted with `prettier` using the configuration in the repo. If possible we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

A consistent coding style is included via [EditorConfig](https://editorconfig.org/) with the file [`.editorconfig`](.editorconfig) at the root of the repo. Depending on your editor of choice, it will either support it out of the box or you can [download a plugin](https://editorconfig.org/#download) for the config to be applied.

If you're contributing to the backend or CLI tooling, be mindful of cross-platform support. [This](https://shapeshed.com/writing-cross-platform-node/) blog post is a good guide of what to keep in mind when writing cross-platform NodeJS.

Also be sure to skim through our [ADRs](docs/architecture-decisions) to see if they cover what you're working on. In particular [ADR006: Avoid React.FC and React.SFC](docs/architecture-decisions/adr006-avoid-react-fc.md) is one to look out for.

If there are any updates in `markdown` file please make sure to run `yarn run lint:docs`. Though it is checked on `lint-staged`. It is required to install [vale](https://docs.errata.ai/vale/install) separately and make sure it is accessed by global command.

## Developer Certificate of Origin

As with other CNCF projects, Backstage has adopted a [Developers Certificate of Origin (DCO)](https://developercertificate.org/). A DCO is a lightweight way for a developer to certify that they wrote or otherwise have the right to submit code or documentation to a project.

To certify the code you submit to the repository you'll need to add a `Signed-off-by` line to your commits.

`$ git commit -s -m 'Awesome commit message'`

Which will look something like the following in the repo;

```
Awesome commit message

Signed-off-by: Jane Smith <jane.smith@example.com>
```

- In case you forgot to add it to the most recent commit, use `git commit --amend --signoff`
- In case you forgot to add it to the last N commits in your branch, use `git rebase --signoff HEAD~N` and replace N with the number of new commits you created in your branch.
- If you have a very deep branch with a lot of commits, run `git rebase -i --signoff $(git merge-base -a master HEAD)`, double check to make sense of the commits (keep all lines as `pick`) and save and close the editor. This should bulk sign all the commits in your PR. Do be careful though. If you have a complex flow with a lot of branching and re-merging of work branches and stuff, merge-base may not be the right solution for you.

Note: If you have already pushed your branch to a remote, you might have to force push: `git push -f` after the rebase.

### Using GitHub Desktop?

If you are using the GitHub Desktop client, you need to manually add the `Signed-off-by` line to the Description field on the Changes tab before committing:

```
Awesome description (commit message)

Signed-off-by: Jane Smith <jane.smith@example.com>
```

In case you forgot to add the line to your most recent commit, you can amend the commit message from the History tab before pushing your branch (GitHub Desktop 2.9 or later).

## Creating Changesets

We use [changesets](https://github.com/atlassian/changesets) to help us prepare releases. They help us make sure that every package affected by a change gets a proper version number and an entry in its `CHANGELOG.md`. To make the process of generating releases easy, it helps when contributors include changesets with their pull requests.

### When to use a changeset?

Any time a patch, minor, or major change aligning to [Semantic Versioning](https://semver.org) is made to any published package in `packages/` or `plugins/`, a changeset should be used. It helps to align your change to the [Backstage package versioning policy](https://backstage.io/docs/overview/versioning-policy#package-versioning-policy) for the package you are changing, for example, when to provide additional clarity on deprecation or impacting changes which will then be included into CHANGELOGs.

In general, changesets are only needed for changes to packages within `packages/` or `plugins/` directories, and only for the packages that are not marked as `private`. Changesets are also not needed for changes that do not affect the published version of each package, for example changes to tests or in-line source code comments.

Changesets **are** needed for new packages, as that is what triggers the package to be part of the next release.

### How to create a changeset

1. Run `yarn changeset`
2. Select which packages you want to include a changeset for
3. Select impact of the change you're introducing. If the package you are changing is at version `0.x`, use `minor` for breaking changes and `patch` otherwise. If the package is at `1.0.0` or higher, use `major` for breaking changes, `minor` for backwards compatible API changes, and `patch` otherwise. See the [Semantic Versioning specification](https://semver.org/#semantic-versioning-specification-semver) for more details.
4. Explain your changes in the generated changeset. See [examples of well written changesets](https://backstage.io/docs/getting-started/contributors#writing-changesets).
5. Add generated changeset to Git
6. Push the commit with your changeset to the branch associated with your PR
7. Accept our gratitude for making the release process easier on the maintainers

For more information, check out [adding a changeset](https://github.com/atlassian/changesets/blob/master/docs/adding-a-changeset.md) documentation in the changesets repository.

## Merging to Master

For those contributors who have earned write access to the repository, when a pull request is approved, in general we prefer the author of the PR to perform the merge themselves. This allows them to own accountability for the change and they likely know best how or when to address pending fixes or additional follow-ups. In this way, we all help contribute to the project's successful outcomes.

## Code of Conduct

This project adheres to the [Spotify FOSS Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/backstage/backstage/blob/master/CODE_OF_CONDUCT.md

## Security Issues?

See [SECURITY](SECURITY.md).

## Accessibility

We encourage you to catch any accessibility issues already in the development phase of new features to Backstage, see our [Accessibility documentation](./docs/accessibility/index.md) for more details.
