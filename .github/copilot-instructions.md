See `/AGENTS.md` for full repository structure, code standards, development flow, and contribution guidelines.

## Pull Request Reviews

When reviewing a pull request you MUST calculate a priority score between 0 and 100, where a higher score indicates higher priority. You MUST include the score as an HTML comment immediately after the `## PR Overview` heading, before any other content, using the following format:

```markdown
## PR Overview

<!-- priority: <score> -->
```

The score MUST be calculated as a sum of the following:

- **60% Guideline Adherence**: How well does the pull request follow the project guidelines in `/STYLE.md`, `/REVIEWING.md`, `/CONTRIBUTING.md`, and `/SECURITY.md`? A pull request that fully adheres to all guidelines scores 60 points, while one that violates multiple guidelines scores closer to 0.

- **40% Complexity**: How straightforward is the pull request? A simple bug fix or documentation update scores the full 40 points. A complex API change, new feature, or architectural modification scores closer to 0.

Higher priority pull requests (higher scores) are those that are both well-crafted according to project standards AND easy to review and merge quickly.

### Do NOT Review Automated PRs

Skip reviews entirely for pull requests authored by any of these accounts:

- `renovate[bot]` (dependency update bot)
- `dependabot[bot]` (dependency update bot)
- `backstage-service` (automated Backstage service account)
- `backstage-goalie[bot]` (automated Backstage service account)

These PRs are managed through their own automated workflows and do not require code review from Copilot.

### Review Guidelines

When reviewing human-authored pull requests:

- Check that a changeset is included for any changes to published (non-private) packages.
- Confirm that new source files include the Apache 2.0 copyright header with the current year.
- Confirm that existing source files have NOT had their copyright year updated.
- Check that the PR description follows the template from `/.github/PULL_REQUEST_TEMPLATE.md`.
- Verify that commits include `Signed-off-by` lines (DCO).
- Check for consistent code style within the package being modified.
- Verify tests are included for new functionality and bug fixes.
- PRs that introduce new features or change existing behavior should include documentation updates. Documentation should be placed in [TSDoc](https://tsdoc.org) comments, the package README, or within the `/docs` folder, whichever is most appropriate.
- Check that ESLint, Prettier, and TypeScript configs are not modified unless the PR explicitly states that as its purpose.
- Check that release notes in `/docs/releases` are not modified unless the PR explicitly states that as its purpose.
- Changes to the docs should follow the documentation style guide at `/docs/contribute/doc-style-guide.md`.
