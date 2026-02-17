# Contributing to Backstage

Our vision for Backstage is for it to become the trusted standard toolbox (read: UX layer) for the open source infrastructure landscape. Think of it like Kubernetes for developer experience. We realize this is an ambitious goal. We can’t do it alone.

Therefore, we want to create a strong community of contributors -- all working together to create the kind of delightful experience that our developers deserve.

Contributions are welcome, and they are greatly appreciated! Every little bit helps, and credit will always be given. ❤️

Backstage is released under the Apache 2.0 License, and original creations contributed to this repo are accepted under the same license.

If you need help, just jump into our [Discord chatroom](https://discord.gg/backstage-687207715902193673).

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Security Issues?](#security-issues)
- [Accessibility](#accessibility)
- [Get Started!](#get-started)
- [Coding Guidelines](#coding-guidelines)
- [AI Use Policy and Guidelines](#ai-use-policy-and-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Package Scripts](#package-scripts)
- [Local configuration](#local-configuration)
- [Creating Changesets](#creating-changesets)
- [Developer Certificate of Origin](#developer-certificate-of-origin)
- [API Reports](#api-reports)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Review Process](#review-process)

## Code of Conduct

This project adheres to the [CNCF Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/backstage/backstage/blob/master/CODE_OF_CONDUCT.md

## Security Issues?

See [SECURITY](SECURITY.md).

## Accessibility

We encourage you to catch any accessibility issues already in the development phase of new features to Backstage, see our [Accessibility documentation](https://backstage.io/docs/accessibility/) for more details.

## Get Started!

So... feel ready to jump in? Let's do this. 👏🏻💯

### Cloning the Repository

Ok. So you're gonna want some code right? Go ahead and fork the repository into your own GitHub account and clone that code to your local machine. GitHub's [Fork a repo](https://docs.github.com/en/get-started/quickstart/fork-a-repo) documentation has a great step by step guide if you are not sure how to do this.

If you cloned a fork, you can add the upstream dependency like so:

```bash
git remote add upstream git@github.com:backstage/backstage
git pull upstream master
```

After you have cloned the Backstage repository, you should run the following commands once to set things up for development:

```bash
cd backstage  # change to root directory of project

yarn install  # fetch dependency packages - may take a while
yarn tsc      # does a first run of type generation and checks
```

### Serving the Example App

Open a terminal window and start the web app by using the following command from the project root. Make sure you have run the above mentioned commands first.

```bash
yarn start
```

This is going to start two things, the frontend (:3000) and the backend (:7007).

This should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

By default, Backstage will start on port 3000, however you can override this by setting an environment variable `PORT` on your local machine. e.g. `export PORT=8080` then running `yarn start`. Or `PORT=8080 yarn start`.

Once successfully started, you should see the following message in your terminal window:

```sh
$ concurrently "yarn start" "yarn start-backend"
$ yarn workspace example-app start
$ yarn workspace example-backend start
$ backstage-cli app:serve
$ backstage-cli backend:dev
[0] Loaded config from app-config.yaml
[1] Build succeeded
[0] ℹ ｢wds｣: Project is running at http://localhost:3000/
[0] ℹ ｢wds｣: webpack output is served from /
[0] ℹ ｢wds｣: Content not from webpack is served from $BACKSTAGE_DIR/packages/app/public
[0] ℹ ｢wds｣: 404s will fallback to /index.html
[0] ℹ ｢wdm｣: wait until bundle finished: /
[1] 2021-02-12T20:58:17.614Z backstage info Loaded config from app-config.yaml
```

You'll see how you get both logs for the frontend `webpack-dev-server` which serves the react app ([0]) and the backend ([1]);

Visit <http://localhost:3000> and you should see the bleeding edge of Backstage ready for contributions!

If you want to get a better understanding of the layout of the repo now that you have a local copy running feel free to review the [Backstage Project Structure](https://backstage.io/docs/getting-started/#general-folder-structure) documentation.

#### Using Docker for the Example App

You can run the Example App using Docker with Postgres, OpenSearch and Redis services. This setup very closely resembles how Backstage is run in production in many occasions.

To start the Example App with Docker, make sure you have Docker and Docker Compose installed on your machine, then run the following command from the root of the repository:

```bash
yarn start:docker
```

## Coding Guidelines

All code is formatted with `prettier` using the configuration in the repo. If possible, we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

A consistent coding style is included via [EditorConfig](https://editorconfig.org/) with the file [`.editorconfig`](.editorconfig) at the root of the repo. Depending on your editor of choice, it will either support it out of the box or you can [download a plugin](https://editorconfig.org/#download) for the config to be applied.

If you're contributing to the backend or CLI tooling, be mindful of cross-platform support. [This](https://shapeshed.com/writing-cross-platform-node/) blog post is a good guide of what to keep in mind when writing cross-platform NodeJS.

Also be sure to skim through our [ADRs](docs/architecture-decisions) to see if they cover what you're working on. In particular [ADR006: Avoid React.FC and React.SFC](docs/architecture-decisions/adr006-avoid-react-fc.md) is one to look out for.

If there are any updates in `markdown` file please make sure to run `yarn run lint:docs`. Though it is checked on `lint-staged`. It is required to install [vale](https://vale.sh/docs/vale-cli/installation/) separately and make sure it is accessed by global command.

### Editor

The Backstage development environment does not require any specific editor, but it is intended to be used with one that has built-in linting and type-checking. The development server does not include any checks by default, but they can be enabled using the `--check` flag. Note that using the flag may consume more system resources and slow things down.

## AI Use Policy and Guidelines

Our goal in the Backstage project is to develop an excellent software system. This requires careful attention to detail in every change we integrate. Maintainer time and attention is very limited, so it's important that changes you ask us to review represent your _best_ work.

You are encouraged to use tools that help you write good code, including AI tools. However, you always need to understand and explain the changes you're proposing to make, whether or not you used an LLM as part of your process to produce them. The answer to "Why did you make change X?" should never be "I'm not sure. The AI did it."

**Do not submit an AI-generated PR you haven't personally understood and tested**, as this wastes maintainers' time. PRs that appear to violate this guideline will be closed without review. If you do submit a largely AI-generated PR, clearly mark it as such in the description—maintainers may still close it without further review if it does not seem worthwhile.

### Using AI as a Coding Assistant

1. Don't skip **becoming familiar with the part of the codebase** you're working on. This will let you write better prompts and validate their output if you use an LLM. Code assistants can be a useful search engine/discovery tool in this process, but don't trust claims they make about how Backstage works. LLMs are often wrong, even about details that are clearly answered in the [Backstage documentation](https://backstage.io/docs).
2. Split up your changes into **coherent commits**, even if an LLM generates them all in one go. See our section on [Creating Changesets](#creating-changesets) for guidance on documenting your changes.
3. Don't simply ask an LLM to add **code comments**, as it will likely produce a bunch of text that unnecessarily explains what's already clear from the code. If using an LLM to generate comments, be really specific in your request, demand succinctness, and carefully edit the result.

### Using AI for Communication

Backstage contributors are expected to communicate with intention, to avoid wasting maintainer time with long, sloppy writing. We strongly prefer clear and concise communication about points that actually require discussion over long AI-generated comments.

When you use an LLM to write a message for you, it remains **your responsibility** to read through the whole thing and make sure that it makes sense to you and represents your ideas concisely. A good rule of thumb is that if you can't make yourself carefully read some LLM output that you generated, nobody else wants to read it either.

Here are some concrete guidelines for using LLMs as part of your communication workflows:

1. When writing a pull request description, **do not include anything that's obvious** from looking at your changes directly (e.g., files changed, functions updated, etc.). Instead, focus on the _why_ behind your changes. Don't ask an LLM to generate a PR description on your behalf based on your code changes, as it will simply regurgitate the information that's already there.
2. Similarly, when responding to a pull request comment, **explain _your_ reasoning**. Don't prompt an LLM to re-describe what can already be seen from the code.
3. Verify that **everything you write is accurate**, whether or not an LLM generated any part of it. Backstage's maintainers will be unable to review your contributions if you misrepresent your work (e.g., wrongly describing your code changes, their effect, or your testing process).
4. Complete all parts of the **PR description template**, including screenshots and the checklist. Don't simply overwrite the template with LLM output.
5. **Clarity and succinctness** are much more important than perfect grammar, so you shouldn't feel obliged to pass your writing through an LLM. If you do ask an LLM to clean up your writing style, be sure it does _not_ make it longer in the process. Demand succinctness in your prompt.
6. Quoting an LLM answer is usually less helpful than linking to **relevant primary sources**, like source code, [Backstage documentation](https://backstage.io/docs), or reference materials. If you do need to quote an LLM answer in a discussion, clearly distinguish LLM output from your own thoughts.

If you have questions about AI usage or need help, feel free to ask in [Discord](https://discord.gg/backstage-687207715902193673).

## Documentation Guidelines

Contributing to the docs is one of the best ways to start getting involved with Backstage. The documentation site is often the first stop for anyone using or exploring Backstage, so even small improvements can have a big impact!

To help your changes get reviewed and merged smoothly, please keep the following in mind:

- Try to group related updates into a single pull request. For example, if you notice missing admonitions or outdated information in a section, feel free to update all of it together. This makes it easier for maintainers to review your contribution in context.

- We really appreciate contributions that improve clarity or fix outdated information. That said, we generally don’t accept changes that are purely stylistic (e.g., rewording a sentence just to tweak the tone or phrasing). If something is **unclear**, **confusing**, or **factually inaccurate**, those are great opportunities to help!

Ready to get started? You can find all the documentation files in the [docs](docs) directory! If you have any questions or need help, feel free to reach out in the [Backstage Discord Docs Channel](https://discord.com/channels/687207715902193673/687994765559463940)

Thank you in advance for your contributions! We really appreciate it. 🙏

## Package Scripts

There are many commands to be found in the root [package.json](https://github.com/backstage/backstage/blob/master/package.json), here are some useful ones:

```shell
yarn start # Start serving the example app, use --check to include type checks and linting

yarn storybook # Start local storybook, useful for working on components in @backstage/core-components

yarn workspace @backstage/plugin-api-docs start # Serve api-docs plugin only, also supports --check

yarn tsc # Run typecheck, use --watch for watch mode
yarn tsc:full # Run full type checking, for example without skipLibCheck, use in CI

yarn build:backend # Build the backend package, depends on tsc
yarn build:all # Build published versions of packages, depends on tsc
yarn build:api-reports # Build API Reports used for documentation

yarn lint # Lint packages that have changed since later commit on origin/master
yarn lint:all # Lint all packages
yarn lint:docs # Lint all the Markdown files
yarn lint:type-deps # Verify that @types/* dependencies are placed correctly in packages

yarn test # Test packages that have changed since later commit on origin/master
yarn test --no-watch # Test packages and include unchanged ones
yarn test:all # Test all packages

yarn clean # Remove all output folders and @backstage/cli cache

yarn diff # Make sure all plugins are up to date with the latest plugin template

yarn new # Create a new module
```

> See [package.json](https://github.com/backstage/backstage/blob/master/package.json) for other yarn commands/options.

## Local configuration

Backstage allows you to specify the configuration used while running the application on your computer. Local configuration is read from `app-config.local.yaml`. This file is ignored by Git, which means that you can safely use it to reference secrets like GitHub tokens without worrying about these secrets, inadvertently ending up in the Git repository. You do not need to copy everything from the default config to the local config. The `app-config.local.yaml` file will be merged with `app-config.yaml` and overwrite the default app configs.

> NOTE: If you want to add your own configuration values to access in the frontend you also need to mark those values as visible using configuration schema, either in the app or in your own plugin. For more information, see [Defining Configuration](https://backstage.io/docs/conf/defining/).

You can learn more about the local configuration in the [Static Configuration in Backstage](https://backstage.io/docs/conf/) section.

## Creating Changesets

We use [changesets](https://github.com/atlassian/changesets) to help us prepare releases. They help us make sure that every package affected by a change gets a proper version number and an entry in its `CHANGELOG.md`. To make the process of generating releases easy, it helps when contributors include changesets with their pull requests.

### When to use a changeset?

Any time a patch, minor, or major change aligning to [Semantic Versioning](https://semver.org) is made to any published package in `packages/` or `plugins/`, a changeset should be used. It helps to align your change to the [Backstage package versioning policy](https://backstage.io/docs/overview/versioning-policy#package-versioning-policy) for the package you are changing, for example, when to provide additional clarity on deprecation or impacting changes which will then be included into CHANGELOGs.

In general, changesets are only needed for changes to packages within `packages/` or `plugins/` directories, and only for the packages that are not marked as `private`. Changesets are also not needed for changes that do not affect the published version of each package, for example changes to tests or in-line source code comments.

Changesets **are** needed for new packages, as that is what triggers the package to be part of the next release. They are also needed for changes to `README.md` files so that the updates are reflected on the NPM page for the changed package.

### How to create a changeset

1. Run `yarn changeset` from the root of the repo
2. Select which packages you want to include a changeset for
3. Select impact of the change you're introducing. If the package you are changing is at version `0.x`, use `minor` for breaking changes and `patch` otherwise. If the package is at `1.0.0` or higher, use `major` for breaking changes, `minor` for backwards compatible API changes, and `patch` otherwise. See the [Semantic Versioning specification](https://semver.org/#semantic-versioning-specification-semver) for more details.
4. Explain your changes in the generated changeset. See [examples of well written changesets](#writing-changesets).
5. Add generated changeset to Git
6. Push the commit with your changeset to the branch associated with your PR
7. Accept our gratitude for making the release process easier on the maintainers

### Writing changesets

Changesets are an important part of the development process. They are used to generate Changelog entries for all changes to the project. Ultimately, they are read by the end users to learn about important changes and fixes to the project. Some of these fixes might require manual intervention from users so it's important to write changesets that users understand and can take action on.

Here are some important do's and don'ts when writing changesets:

### Changeset should give a clear description to what has changed

#### Bad

```md
---
'@backstage/catalog': patch
---

Fixed table layout
```

#### Good

```md
---
'@backstage/catalog': patch
---

Fixed bug in EntityTable component where table layout did not readjust properly below 1080x768 pixels.
```

### Breaking changes not caught by the type checker should be clearly marked with bold **BREAKING** text

#### Bad

```md
---
'@backstage/catalog': minor
---

getEntity is now a function that returns a Promise.
```

#### Good

```md
---
'@backstage/catalog': minor
---

**BREAKING** The getEntity function now returns a Promise and **must** be awaited from now on.
```

### Changes to code should include a diff of the files that need updating

#### Bad

```md
---
'@backstage/catalog': patch
---

**BREAKING** The catalogEngine now requires a flux capacitor to be passed.
```

#### Good

````md
---
'@backstage/catalog': patch
---

**BREAKING** The catalog createRouter now requires that a `FluxCapacitor` is
passed to the router.

These changes are **required** to `packages/backend/src/plugins/catalog.ts`

```diff
+ import { FluxCapacitor } from '@backstage/time';
+ const fluxCapacitor = new FluxCapacitor();
  return await createRouter({
    entitiesCatalog,
    locationAnalyzer,
    locationService,
+   fluxCapacitor,
    logger: env.logger,
    config: env.config,
  });
```
````

## Developer Certificate of Origin

As with other CNCF projects, Backstage has adopted a [Developers Certificate of Origin (DCO)](https://developercertificate.org/). A DCO is a lightweight way for a developer to certify that they wrote or otherwise have the right to submit code or documentation to a project.

To certify the code you submit to the repository, you'll need to add a `Signed-off-by` line to your commits.

`$ git commit -s -m 'Awesome commit message'`

Which will look something like the following in the repo;

```
Awesome commit message

Signed-off-by: Jane Smith <jane.smith@example.com>
```

> Note: this assumes you have setup your git name and email, if you have not you can use these commands to set that up:
>
> ```shell
> git config --global user.name "Your Name"
> git config --global user.email "youremail@example.com"
> ```

- In case you forgot to add it to the most recent commit, use `git commit --amend --signoff`
- In case you forgot to add it to the last N commits in your branch, use `git rebase --signoff HEAD~N` and replace N with the number of new commits you created in your branch.
- If you have a very deep branch with a lot of commits, run `git rebase -i --signoff $(git merge-base -a master HEAD)`, double check to make sense of the commits (keep all lines as `pick`) and save and close the editor. This should bulk sign all the commits in your PR. Do be careful though. If you have a complex flow with a lot of branching and re-merging of work branches and stuff, merge-base may not be the right solution for you.

Note: If you have already pushed your branch to a remote, you might have to force push: `git push -f` after the rebase.

### Using GitHub Desktop?

If you are using the GitHub Desktop client, you need to manually add the `Signed-off-by` line to the Description field on the Changes tab before committing:

```text
Awesome description (commit message)

Signed-off-by: Jane Smith <jane.smith@example.com>
```

In case you forgot to add the line to your most recent commit, you can amend the commit message from the History tab before pushing your branch (GitHub Desktop 2.9 or later).

### Using VS Code?

If you are using VS Code you can enable always signing your commits by setting the following in your `settings.json` file:

```json
"git.alwaysSignOff": true,
```

Or from the Settings UI look for the "Git: Always Sign Off" setting and check the "Controls the signoff flag for all commits" box.

## API Reports

Backstage uses [API Extractor](https://api-extractor.com/) and TSDoc comments to generate API Reports in Markdown format. What this means is that if you are making changes to the API or adding a new plugin then you will need either generate a new API Report or update an existing API Report. If you don't do this the CI build will fail when you create your Pull Request.

There are two ways you can do this:

1. You can run `yarn build:api-reports` from the root of the project and it will go through all of the existing API Reports and update them or create new ones as needed. This may take a while but is generally the best method if you are new to this.
2. You can run `yarn build:api-reports plugins/<your-plugin-with-changes>` from the root and it will update the existing API Report or create a new one.

> Note: the above commands assume you've run `yarn install` beforehand or recently.

Each plugin/package has its own API Report which means you might see more than one file updated or created depending on your changes. These changes will then need to be committed as well.

## Submitting a Pull Request

When you've got your contribution working, tested, and committed to your branch it's time to create a Pull Request (PR). If you are unsure how to do this GitHub's [Creating a pull request from a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) documentation will help you with that. Once you create your PR you will be presented with a template in the PR's description that looks like this:

```md
## Hey, I just made a Pull Request!

<!-- Please describe what you added, and add a screenshot if possible.
     That makes it easier to understand the change so we can :shipit: faster. -->

#### :heavy_check_mark: Checklist

<!--- Please include the following in your Pull Request when applicable: -->

- [ ] A changeset describing the change and affected packages. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#creating-changesets))
- [ ] Added or updated documentation
- [ ] Tests for new functionality and regression tests for bug fixes
- [ ] Screenshots attached (for UI changes)
- [ ] All your commits have a `Signed-off-by` line in the message. ([more info](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md#developer-certificate-of-origin))
```

From here all you need to do is fill in the information as requested by the template. Please do not remove this as it helps both you and the reviewers confirm that the various tasks have been completed.

Here are some examples of good PR descriptions:

- <https://github.com/backstage/backstage/pull/19473>
- <https://github.com/backstage/backstage/pull/19623>
- <https://github.com/backstage/backstage/pull/15881>
- <https://github.com/backstage/backstage/pull/16401>

## Review Process

Once you've submitted a Pull Request (PR) the various bots will come out and do their work:

- assigning reviewers from the various areas impacted by changes in your PR
- adding labels to help make reviewing PRs easier
- checking for missing changesets or confirming them
- checking for commits for their DCO (Developer Certificate of Origin)
- kick off the various CI builds

Once these steps are completed, it's just a matter of being patient. Reviews are coordinated by maintainers and reviewers based on project area ownership. Prioritization is driven by a number of different factors, but some important ones are size (smaller get higher priority) and alignment with current roadmap priorities. Timely responses to review comments also help keep the pull request moving faster. You may also have someone from the reviewers group review your pull request and request changes. Approval from a member of the reviewers group will greatly increase the priority of your pull request.

### Review Tips

Here are a few things that can help as you go through the review process:

- You'll want to make sure all the automated checks are passing as generally the PR won't get a review if something like the CI build is failing
- PRs get automatically assigned so you don't need to ping people, they will be notified and have a process of their own for this
- If you are waiting for a review or mid-review and your PR goes stale one of the easiest ways to clear the stale bot is by simply rebasing your PR
- There are times where you might run into conflict with the `yarn.lock` during a rebase, to help with that make sure your `master` branch is up to date and then in your branch run `git checkout master yarn.lock` and then run `yarn install`, this will get you a conflict free `yarn.lock` file you can commit
- If Vale finds issues with your documentation but it's a code reference you can fix it by putting backticks (`) around it. Now if it is a special word or maybe a name there are two ways you can fix that by adding it to the list of accepted words in the [accept.txt file](https://github.com/backstage/backstage/blob/master/.github/vale/config/vocabularies/Backstage/accept.txt) and them committing that change

### Merging to Master

For those contributors who have earned write access to the repository, when a pull request is approved, in general we prefer the author of the PR to perform the merge themselves. This allows them to own accountability for the change and they likely know best how or when to address pending fixes or additional follow-ups. In this way, we all help contribute to the project's successful outcomes.
