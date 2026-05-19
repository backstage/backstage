---
name: backstage-release-notes
description: Generate release notes for a new Backstage version from changesets. Use when writing or drafting release notes, or when preparing a Backstage release.
---

# Backstage Release Notes

Create release notes for a Backstage release from changeset files.

## Process

### 1. Get the version number

Ask the user for the target version if it is not already provided. Accept the
version with or without a leading `v`, then normalize it to a bare semantic
version such as `1.54.0`. In the rest of this skill, `<version>` means this bare
version.

### 2. Parse changesets

Read all `.md` files in `.changeset/`. Skip `README.md` and any file whose YAML front matter does not contain at least one package-to-bump mapping.

For each valid changeset, extract:

- Package names and bump types from YAML front matter
- Description text from the markdown body
- The repository-relative path, including the `.md` extension

### 3. Look up PRs and authors

For each changeset file, find the commit that added it:

```shell
git log --diff-filter=A --format='%H' -- <changeset-path>
```

Then find the PR and author using `gh`:

```shell
gh pr list --search '<commit-sha>' --state merged --json number,author --jq '.[0] | {number, login: .author.login}'
```

If `gh` returns nothing, check the commit message for a `#NNN` reference. If neither works, flag the entry for manual review and use the git author name without a GitHub link.

Run these lookups in batches to avoid excessive API calls.

### 4. Categorize changesets

Assign each changeset to a tier:

| Tier            | What qualifies                                                                                                                 | Output treatment                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1 - Breaking    | `major` bump for packages >= 1.0, `minor` bump for packages < 1.0, or description contains `BREAKING`                          | Individual `###` highlight with `**BREAKING**:` prefix                 |
| 2 - New package | Package directory created after previous release tag                                                                           | Individual `###` highlight                                             |
| 3 - Feature     | `minor` bump with substantial description, especially core packages                                                            | Individual `###` highlight. Group related changesets under one heading |
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

```shell
git log --diff-filter=A --format='%H' <previous-tag>..HEAD -- <package-dir>/package.json
```

If a commit is returned, the package is new.

### 6. Draft the release notes

Use `docs/.release-notes-template.md` as the base document. Replace its example
version with `<version>`, and replace its example highlights and security text
with the generated content. Keep the template's section order and boilerplate.

Always include the matching `v<version>-changelog.md` link from the template in
the Links and References section. The changelog file is generated later in the
release process. The link verifier permits this matching link before the file
exists. Do not remove the link.

Write each highlight as 1-3 paragraphs of prose. Do not just paste the raw changeset text. Rewrite it for clarity, aimed at Backstage adopters. Include code examples when they help illustrate migration steps or usage.

For community contributions, add attribution:

```markdown
Contributed by [@user](https://github.com/user) in [#NNN](https://github.com/backstage/backstage/pull/NNN)
```

Breaking change heading variants:

- `### **BREAKING**: Title` for general breaking changes
- `### **BREAKING ALPHA**: Title` for alpha-only API breakage
- `### **BREAKING PRODUCERS**: Title` for changes that only break code producing certain types (not consumers)

If a changeset could not be traced to a PR or parsed, put it in a `### Needs manual review` section at the end of highlights.

Do not add contributor attribution for maintainers. Current maintainers are
`benjdlambert`, `freben`, `Rugvip`, `awanlin`, and `backstage-service`.

### 7. Assemble the file

Use this structure:

```markdown
---
id: v<version>
title: v<version>
description: Backstage Release v<version>
---

These are the release notes for the v<version> release of [Backstage](https://backstage.io/).

A huge thanks to the whole team of maintainers and contributors as well as the amazing Backstage Community for the hard work in getting this release developed and done.

## Highlights

<highlights from step 6>

## Security Fixes

This release does not contain any security fixes.

## Upgrade path

<copied from docs/.release-notes-template.md, version updated>

## Links and References

<copied from docs/.release-notes-template.md, version and changelog link updated>
```

Save to `docs/releases/v<version>.md`.

### 8. Validate

Before reporting to the user, run these checks:

```shell
yarn prettier --write docs/releases/v<version>.md
node scripts/verify-links.js
```

If `verify-links.js` reports broken links other than the matching generated
changelog link, fix them before proceeding. If `prettier` is not available,
run `yarn install` first.

Check the vale vocabulary at `.github/vale/config/vocabularies/Backstage/accept.txt`. If the release notes use technical terms not in the vocabulary, add them and include the vocabulary file in the commit.

### 9. Report

Tell the user what was generated, how many changesets were processed, how many highlights were created, and whether any entries need manual review.

Do NOT commit or push the file. The user will review and handle that.
