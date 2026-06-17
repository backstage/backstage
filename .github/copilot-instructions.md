## Pull Request Reviews

When reviewing a pull request you MUST calculate a priority score between 0 and 100, where a higher score indicates higher priority. You MUST include the score as an HTML comment at the very beginning of the "PR Overview" section, using the following format: `<!-- priority: <score> -->`.

The score MUST be calculated as a sum of the following:

- **60% Guideline Adherence**: How well does the pull request follow the project guidelines in `/STYLE.md`, `/REVIEWING.md`, `/CONTRIBUTING.md`, and `/SECURITY.md`? A pull request that fully adheres to all guidelines scores 60 points, while one that violates multiple guidelines scores closer to 0.

- **40% Complexity**: How straightforward is the pull request? A simple bug fix or documentation update scores the full 40 points. A complex API change, new feature, or architectural modification scores closer to 0.

Higher priority pull requests (higher scores) are those that are both well-crafted according to project standards AND easy to review and merge quickly.
