# GitHub Labels in Backstage

This document explains the GitHub labels used in the Backstage main repository. Labels help categorize and track issues and pull requests, but are also used as a communication tool in order to help maintainers respond to issues and pull requests faster.

## Issue Type Labels - `type:*`

These labels help you understand what type of work is needed.

- `type:bug` - Something doesn't work as expected and needs fixing.
- `type:docs` - Documentation is missing or needs updating.
- `type:suggestion` - An proposal for a new feature or change.
- `type:maintenance` - Routine maintenance tasks, version bumps, cleanup, deprecations, etc.

## Priority Labels - `priority:*`

These labels all signal that the issue has been accepted for implementation, and further indicate its priority and whether the owners of the area will address it:

- `priority:critical` - The owners of the area will address this as soon as possible.
- `priority:roadmap` - The owners of the area have this on their roadmap and will address it when possible, some contributions may be welcome.
- `priority:contrib-welcome` - The owners of the area are unlikely to address this in the short term, but contributions are welcome.
- `priority:contrib-needed` - This will not be addressed by the owners of the area, but contributions are welcome.

## Need Labels - `needs:*`

These labels indicate what is needed to move an issue forward before it can be accepted for implementation:

- `needs:bep` - The issue is an advanced addition that needs a [Backstage Enhancement Proposal](./beps/README.md).
- `needs:direction` - The issue needs direction from the owners of the area.
- `needs:discussion` - The way forward for this issue is unclear and it needs further discussion with the author and other participants.
- `needs:more-info` - The issue needs more information from the author.
- `needs:motivation` - It is not clear why this change is needed. The author should provide motivation for the change, for instance by giving examples of concrete use cases or scenarios.
- `needs:repro` - The issue cannot be reproduced by the owners of the area. The author should provide more information to help them reproduce the issue, if possible with a minimal reproduction repository.
- `needs:triage` - The issue needs initial review.
- `needs:unblock` - The issue is blocked by another issue or upstream dependency.

## Area Labels - `area:*`

These labels indicate which part of Backstage an issue or pull request relates to. As a contributor, these help you find issues in areas you're interested in or have expertise in.

- `area:auditor` - Auditor service and it's use in plugins.
- `area:auth` - Authentication and 3rd party authorization.
- `area:catalog` - The Catalog plugin and the Software Catalog model and integrations.
- `area:design-system` - The Backstage UI design system and library.
- `area:documentation` - Documentation for adopters, users, and developers.
- `area:events` - The Events system and integrations for other plugins.
- `area:framework` - The core Backstage framework.
- `area:home` - The Home plugin and the main page of the Backstage site.
- `area:kubernetes` - The Kubernetes plugin and integrations for other plugins.
- `area:microsite` - The microsite at [backstage.io](https://backstage.io), excluding the documentation.
- `area:notifications` - The Notifications plugin and integrations for other plugins.
- `area:openapi-tooling` - The OpenAPI tooling it's use in plugins.
- `area:operations` - The management and operations of the main Backstage repository.
- `area:permission` - The Permissions system and permission integrations from other plugins.
- `area:scaffolder` - The Scaffolder plugin that powers Software Templates.
- `area:search` - The Search plugin and search integrations for other plugins.
- `area:techdocs` - The TechDocs plugin.
- `area:tooling` - The Backstage CLI and repository tooling.

## Integration Labels - `integration:*`

These labels help you find issues related to specific external integrations:

- `integration:aws` - [Amazon Web Services](https://aws.amazon.com/)
- `integration:azure` - [Microsoft Azure](https://azure.microsoft.com/) and [Azure DevOps](https://dev.azure.com/)
- `integration:bitbucket-cloud` - [Bitbucket Cloud](https://bitbucket.org/)
- `integration:bitbucket-server` - Bitbucket Server (Stash)
- `integration:gcp` - [Google Cloud Platform](https://cloud.google.com/)
- `integration:gerrit` - [Gerrit](https://www.gerritcodereview.com/)
- `integration:gitea` - [Gitea](https://gitea.com/)
- `integration:github` - [GitHub](https://github.com/)
- `integration:gitlab` - [GitLab](https://gitlab.com/)
- `integration:other` - Any other integration

## Domain Labels

These labels indicate that an issue is related to specific domains of expertise.

- `domain:a11y` - Web domain issues specifically related to accessibility.
- `domain:design` - Visual design and user experience.
- `domain:docs` - Documentation for adopters, users, and developers.
- `domain:backend` - Backend development in Node.js.
- `domain:tooling` - Tooling and automation in Node.js and GitHub Actions.
- `domain:web` - Frontend development using TypeScript and React.

## Workflow Labels

These labels indicate a workflow status for the owners.

- `workflow:do-not-merge` - The Pull Request should not be merged.
- `workflow:before-release` - Should be handled before the next main-line release.
- `workflow:after-release` - Should be handled after the next main-line release.
- `workflow:after-vacations` - To be handled once the owners return from vacation.

## General Labels

- `good first issue` - Good for new contributors.
- `stale` - The issue or pull request has not seen any activity for a while and will be closed if no further activity is seen.
- `no stale` - The issue or pull request should not be closed due to inactivity.

## Pull Request Labels

The following labels indicate the status of a pull request:

- `waiting-for:review` - The pull request needs a review and will be visible in the review queue unless already assigned an owner.
- `waiting-for:author` - Changes have been requested by a reviewer and the pull request will not receive a review until the changes are made. A comment made on the pull request by the author will also push it back into the review queue.
- `waiting-for:decision` - The pull request has been marked as more complex and needs a decision from the owners. Progress can still be made and discussion can continue, but expect the review to take longer. These pull requests are often good candidates to bring to a [SIG](https://github.com/backstage/community/tree/main/sigs) meeting.
- `waiting-for:merge` - The pull request has been approved and is awaiting merge. If you have write access and authored the pull request you can merge it yourself. If you do not have access to merge and the pull request has not been merged within a day of approval, please notify the assigned reviewer.

The following labels indicate the size of a pull request:

- `size:tiny` - Tiny pull requests receive a higher priority for reviews.
- `size:small` - Small pull requests receive a slightly higher priority for reviews.
- `size:medium` - Medium-sized pull requests receive no change in priority for reviews.
- `size:large` - Large pull requests receive a slightly lower priority for reviews.
- `size:huge` - Huge pull requests receive a lower priority for reviews.

The following additional labels also apply to pull requests:

- `reviewer-approved` - The pull request has been approved by a member of the reviewers group. This pull request receives a much higher priority for reviews.

## Common Issue Filters

This is a collection of common issue filters that can help you find issues that you are looking for or that match your interests and skills.

### New Contributors

These issues are ideal for new contributors to get started and don't require much familiarity with Backstage.

- [Backend](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22good%20first%20issue%22%20label%3A%22domain%3Abackend%22%20)
- [Documentation](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22good%20first%20issue%22%20label%3A%22area%3Adocumentation%22)
- [Tooling](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22good%20first%20issue%22%20label%3A%22domain%3Atooling%22%20)
- [Web](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22good%20first%20issue%22%20label%3A%22domain%3Aweb%22%20)

### Experienced Contributors

These issues generally require some familiarity with Backstage and the codebase, and are either open for or require contributions from the community.

- [Backend](<https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20(label%3Apriority%3Acontrib-welcome%20OR%20label%3Apriority%3Acontrib-needed)%20label%3A%22domain%3Abackend%22%20>)
- [Documentation](<https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20(label%3Apriority%3Acontrib-welcome%20OR%20label%3Apriority%3Acontrib-needed)%20label%3A%22area%3Adocumentation%22>)
- [Tooling](<https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20(label%3Apriority%3Acontrib-welcome%20OR%20label%3Apriority%3Acontrib-needed)%20label%3A%22domain%3Atooling%22%20>)
- [Web](<https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20(label%3Apriority%3Acontrib-welcome%20OR%20label%3Apriority%3Acontrib-needed)%20label%3A%22domain%3Aweb%22%20>)

### Maintainer Lists

These are useful lists for maintainers.

- [After vacations](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22after%20vacations%22)
- [Critical priority](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22priority%3Acritical%22)
- [Fix before release](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22fix%20before%20release%22)
- [Needs direction](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22needs%3Adirection%22)
- [Needs triage](https://github.com/backstage/backstage/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22needs%3Atriage%22)
