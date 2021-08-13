# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

Please report sensitive security issues via Spotify's [bug-bounty program](https://hackerone.com/spotify) rather than GitHub.

If you have questions about a potential vulnerability, please reach out on Discord by asking for a maintainer in the `#support` channel, or via direct message to a maintainer.

## Remediation and Notification Process

Vulnerabilities are handled and published through [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/about-github-security-advisories).

In the event of a vulnerability the runbook for the maintainers is as follows:

1. Create a [new draft security advisory](https://github.com/backstage/backstage/security/advisories/new). The values and descriptions don't need to be perfect to begin with as they can be edited later. For severity, use the "Assess severity using CVSS" and refer to [the guide](https://www.first.org/cvss/v3.1/user-guide) for help.
2. Request a CVE identification number. It can take up to 72h for one to be assigned so be sure to do this early on.
3. If there is not already a patch for the vulnerability, collaborate on one in a private fork:
   1. Head to the security advisory on GitHub and [create a private fork](https://docs.github.com/en/code-security/security-advisories/collaborating-in-a-temporary-private-fork-to-resolve-a-security-vulnerability)
   1. [Invite any collaborators](https://docs.github.com/en/code-security/security-advisories/adding-a-collaborator-to-a-security-advisory) from outside the maintainer team that should be part of creating a fix.
   1. Create one or multiple Pull Requests with fixes towards the fork. Note that these PRs will not have CI checks run on them, so more care should be taken to run local validation. The PRs are also not merged like normal PRs, but are instead merged straight into the main repo all at once when the merge button is hit on the security advisory.
4. Once the fix is ready in a PR or private fork and it is time to release it, there are a couple of options. Either merge into the main branch with a changeset and wait for a regular release, or do a quick release by manually bumping the version in `package.json` of the affected package, along with a manual `CHANGELOG.md` entry. Note that a quick release will only work if the package does not have any other pending changes that depend on pending changes in other packages, so be sure to manually check that first, and fall back to an early regular release if needed. In general it's best to stick with the regular release flow, with the quick release being used only for time sensitive fixes.
5. Finalize and publish the security advisory. Note that once you hit the publish button it's no longer possible to edit the advisory. Just like the CVE number this can take up to 72h, and expect it to be slower than the CVE number request.
