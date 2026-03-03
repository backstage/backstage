---
id: adrs-overview
title: Architecture Decision Records (ADR)
sidebar_label: Overview
description: Overview of Architecture Decision Records (ADR)
---

The substantial architecture decisions made in the Backstage project live here.
For more information about ADRs, when to write them, and why, please see
[this blog post](https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record/).

Records are never deleted but can be marked as superseded by new decisions or
deprecated.

Records should be stored under the `architecture-decisions` directory.

## Contributing

### Creating an ADR

- Copy `docs/architecture-decisions/adr000-template.md` to
  `docs/architecture-decisions/adr000-my-decision.md` (my-decision should be
  descriptive. Do not assign an ADR number.)
- Fill in the ADR following the guidelines in the template
- Submit a pull request
- Address and integrate feedback from the community
- Eventually, assign a number
- Add the path of the ADR to the microsite sidebar in
  [`sidebars.ts`](https://github.com/backstage/backstage/blob/master/microsite/sidebars.ts)
- Add the path of the ADR to the
  [`mkdocs.yml`](https://github.com/backstage/backstage/blob/master/mkdocs.yml)
- Merge the pull request

## Superseding an ADR

If an ADR supersedes an older ADR then the status of the older ADR is changed to
"superseded by ADR-XXXX", and links to the new ADR.

# Enforcing ADRs on Pull Requests

To help teams remember architectural constraints when modifying affected code,
you can surface relevant ADRs automatically during pull request reviews using
[Decision Guardian](https://github.com/DecispherHQ/decision-guardian).

## GitHub Actions Workflow

Create `.github/workflows/check-adrs.yml`:

```yaml
name: Check ADRs

on:
  pull_request:

# contents: read is required for actions/checkout.
# pull-requests: write is required to post decision comments.
permissions:
  contents: read
  pull-requests: write

jobs:
  check-adrs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Pin to a specific commit SHA in production workflows to protect
      # against supply-chain compromise. Find the latest SHA at:
      # https://github.com/DecispherHQ/decision-guardian/releases
      - uses: DecispherHQ/decision-guardian@v1  # replace with @<commit-sha> for production
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          decision_file: '.decispher/decisions.md'
          fail_on_critical: true
```

> **Note for public repositories:** Pull requests from forks receive a
> read-only `GITHUB_TOKEN`, which cannot post PR comments. If your repository
> accepts fork contributions, use `pull_request_target` instead of
> `pull_request` as the trigger. Decision Guardian only reads the decision file
> from your base branch and calls the GitHub API — it does not execute code
> from the PR branch — so `pull_request_target` is safe for this use case.
> Review [GitHub's security hardening guidance](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#understanding-the-risk-of-script-injections)
> before adopting `pull_request_target` in other workflows.

## Checking Locally Before Pushing

```bash
npx decision-guardian check .decispher/decisions.md --staged --fail-on-critical
```

## Decision File Format

Create `.decispher/decisions.md` to map file globs to your ADRs:

```markdown
<!-- DECISION-AUTH-001 -->
## Decision: Authentication Flow

**Status**: Active
**Date**: 2024-01-15
**Severity**: Critical

**Files**:
- `src/auth/**/*.ts`
- `src/plugins/auth-backend/**`

### Context

See [ADR-0XXX](./adrXXX-your-decision.md) before modifying auth flows.

Changes to authentication can affect all plugins. Coordinate with the
security team and run the full auth integration test suite before merging.

---
```

> **Tip:** Replace `adrXXX-your-decision.md` with the actual filename of the
> relevant ADR in this directory (e.g. `adr015-authentication-strategy.md`).
