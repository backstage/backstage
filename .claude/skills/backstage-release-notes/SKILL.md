---
name: backstage-release-notes
description: Use when generating release notes for a new Backstage version. Triggered by requests to write, draft, or generate release notes, or when preparing a Backstage release.
---

# Backstage Release Notes

Generate release notes for a Backstage release from changeset files.

## When to Use

- User asks to generate or draft release notes for a Backstage version
- User is preparing a Backstage release and needs the release notes document

## Process

### 1. Get the version number

Ask the user for the target version (e.g., `v1.51.0`) if not already provided.

### 2. Parse changesets

Read all `.md` files in `.changeset/`. Skip `README.md` and any file whose YAML frontmatter does not contain at least one package-to-bump mapping.

For each valid changeset, extract:

- Package names and bump types from YAML frontmatter
- Description text from the markdown body
- The filename

### 3. Look up PRs and authors

For each changeset file, find the commit that added it:

```
git log --diff-filter=A --format='%H' -- .changeset/<filename>.md
```

Then find the PR and author using `gh`:

```
gh pr list --search '<commit-sha>' --state merged --json number,author --jq '.[0] | {number, login: .author.login}'
```

If `gh` returns nothing, check the commit message for a `#NNN` reference. If neither works, flag the entry for manual review and use the git author name without a GitHub link.

Run these lookups in batches to avoid excessive API calls.

### 4. Categorize changesets

Assign each changeset to a tier:

| Tier            | What qualifies                                                                                                                 | Output treatment                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1 - Breaking    | `major` bump for packages >= 1.0, `minor` bump for packages < 1.0, or description contains `BREAKING`                         | Individual `###` highlight with `**BREAKING**:` prefix                 |
| 2 - New package | Package directory created after previous release tag                                                                           | Individual `###` highlight                                             |
| 3 - Feature     | `minor` bump with substantial description, especially core packages                                                            | Individual `###` highlight. Group related changesets under one heading  |
| 4 - Deprecation | Description mentions "deprecated"                                                                                              | Individual or grouped highlight                                        |
| 5 - Fix         | Patch-level fixes, performance improvements, community contributions                                                           | Bullet in "Additional fixes and improvements"                          |
| 6 - Skip        | Dependency updates (author is `renovate[bot]`, or message matches `chore(deps)`), trivial patches, "Updated dependencies" only | Omit entirely                                                          |

Grouping rules:

- Changesets in the same package family go under one heading (e.g., all `@backstage/plugin-catalog-backend` changes)
- Changesets from the same PR go under one heading
- `@backstage/ui` changesets get grouped under "Backstage UI updates" with a link to the [BUI Changelog](https://ui.backstage.io/changelog)

Prefer core/framework packages over plugin-specific ones within each tier.

### 5. Detect new packages

To check if a package is new in this release, see if the package directory was created after the previous release tag:

```
git log --diff-filter=A --format='%H' <previous-tag>..HEAD -- <package-dir>/package.json
```

If a commit is returned, the package is new.

### 6. Draft the release notes

Read the most recent release notes file in `docs/releases/` (highest version `v*.md` that isn't a changelog) to get the current boilerplate for "Upgrade path" and "Links and References" sections. Copy those sections, updating only the version number.

Always include the changelog link `v<VERSION>-changelog.md` in the Links and References section. The changelog file does not exist yet when the release notes are merged — it is generated later during the release process. CI link verification will fail on this link, but that is expected and should be ignored. Do NOT remove the changelog link to fix CI.

Write each highlight as 1-3 paragraphs of prose. Do not just paste the raw changeset text. Rewrite it for clarity, aimed at Backstage adopters. Include code examples when they help illustrate migration steps or usage.

For community contributions, add attribution:

```
Contributed by [@user](https://github.com/user) in [#NNN](https://github.com/backstage/backstage/pull/NNN)
```

Breaking change heading variants:

- `### **BREAKING**: Title` for general breaking changes
- `### **BREAKING ALPHA**: Title` for alpha-only API breakage
- `### **BREAKING PRODUCERS**: Title` for changes that only break code producing certain types (not consumers)

If a changeset could not be traced to a PR or parsed, put it in a `### Needs manual review` section at the end of highlights.

Exclude maintainers from the contributor list. Current maintainers are: `benjdlambert`, `freben`, `Rugvip`, `awanlin`, `backstage-service`.

### 7. Compile contributors

Gather all unique non-maintainer PR authors from step 3. Format under its own heading:

```markdown
## Contributors

Big shoutout to all X of you amazing folks who chipped in on this release: [@a](https://github.com/a), [@b](https://github.com/b), ...
```

### 8. Assemble the file

Use this structure:

```markdown
---
id: v<VERSION>
title: v<VERSION>
description: Backstage Release v<VERSION>
---

These are the release notes for the v<VERSION> release of [Backstage](https://backstage.io/).

A huge thanks to the whole team of maintainers and contributors as well as the amazing Backstage Community for the hard work in getting this release developed and done.

## Highlights

<highlights from step 6>

## Security Fixes

This release does not contain any security fixes.

## Contributors

<contributor shoutout from step 7>

## Upgrade path

<copied from previous release, version updated>

## Links and References

<copied from previous release, version updated, no changelog link>
```

Save to `docs/releases/v<VERSION>.md`.

### 9. Validate

Before reporting to the user, run these checks:

```
yarn prettier --write docs/releases/v<VERSION>.md
node scripts/verify-links.js
```

If `verify-links.js` reports broken links, fix them before proceeding. If `prettier` is not available, run `yarn install` first.

Check the vale vocabulary at `.github/vale/config/vocabularies/Backstage/accept.txt`. If the release notes use technical terms not in the vocabulary, add them and include the vocabulary file in the commit.

### 10. Report

Tell the user what was generated, how many changesets were processed, how many highlights were created, and whether any entries need manual review.

Do NOT commit or push the file. The user will review and handle that.
