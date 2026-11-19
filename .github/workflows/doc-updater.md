---
name: Documentation Updater
description: Automatically reviews and updates documentation based on recent code changes
on:
  schedule: daily
  workflow_dispatch:
  permissions:
    pull-requests: read
  steps:
    - id: check
      env:
        GH_TOKEN: ${{ github.token }}
      run: |
        MAX_OPEN_PRS=8
        if [[ "$GITHUB_EVENT_NAME" != "schedule" ]]; then exit 0; fi
        COUNT=$(gh pr list --repo "$GITHUB_REPOSITORY" --state open --search 'in:title "[docs]"' --json number --jq 'length')
        [[ "$COUNT" -lt "$MAX_OPEN_PRS" ]]
      # exits 0 if not scheduled or <MAX_OPEN_PRS open PRs, 1 if ≥MAX_OPEN_PRS

if: needs.pre_activation.outputs.check_result == 'success'

# Deterministic triage before the agent starts. It lists every changeset,
# drops the ones that an open pull request already covers, ranks the rest,
# and writes the result to /tmp/gh-aw/agent/doc-gaps.md. Pull request text is
# only matched against, never copied into that file.
steps:
  - name: Triage changesets against open docs pull requests
    env:
      GH_TOKEN: ${{ github.token }}
    run: |
      set -euo pipefail
      OUT_DIR=/tmp/gh-aw/agent
      mkdir -p "$OUT_DIR"
      gh pr list --repo "$GITHUB_REPOSITORY" --state open --limit 100 \
        --json number,title,body,files --jq . > "$OUT_DIR/open-prs.json"
      node - "$OUT_DIR" <<'EOF'
      const fs = require('fs');
      const path = require('path');
      const { execFileSync } = require('child_process');
      const outDir = process.argv[2];
      const repo = process.env.GITHUB_REPOSITORY;
      const prs = JSON.parse(fs.readFileSync(path.join(outDir, 'open-prs.json'), 'utf8'));

      // Concatenated docs text, used to hint whether a changeset's terms are already documented.
      const skipDirs = new Set(['releases', 'reference', 'references', 'node_modules']);
      let docsText = '';
      const walk = dir => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (!skipDirs.has(entry.name)) walk(p);
          } else if (/\.mdx?$/.test(entry.name)) {
            docsText += fs.readFileSync(p, 'utf8') + '\n';
          }
        }
      };
      walk('docs');

      // Workspace package name to directory, to tie a pull request's files to a changeset's packages.
      const pkgDirs = {};
      for (const root of ['packages', 'plugins']) {
        for (const dir of fs.readdirSync(root)) {
          const pj = path.join(root, dir, 'package.json');
          if (!fs.existsSync(pj)) continue;
          try {
            pkgDirs[JSON.parse(fs.readFileSync(pj, 'utf8')).name] = `${root}/${dir}/`;
          } catch (e) {
            console.log(`::warning::Could not parse ${pj}: ${e.message}`);
          }
        }
      }

      // A docs pull request is an open pull request, with any title, that changes only documentation:
      // files under docs/, microsite data and sidebars, Markdown files, and changesets. A code pull request that also
      // edits docs does not count, because it documents its own unmerged change, not a merged changeset.
      const isDocsFile = p =>
        (p.startsWith('docs/') || /\.mdx?$/.test(p)) &&
        !p.startsWith('.changeset/') && !p.startsWith('.github/') && !p.startsWith('docs/releases/') &&
        !/(^|\/)CHANGELOG\.md$/.test(p) && !p.endsWith('-api-report.md');
      const docsPrs = [];
      for (const pr of prs) {
        const paths = (pr.files || []).map(f => f.path);
        pr.isDocs = paths.some(isDocsFile) &&
          paths.every(p => isDocsFile(p) || p.startsWith('docs/') || p.startsWith('.changeset/') ||
            p.startsWith('microsite/data/') || p === 'microsite/sidebars.ts');
        if (!pr.isDocs) continue;
        // Only lines added to documentation files count, plus the title and body.
        let added = '';
        try {
          const diff = execFileSync('gh', ['pr', 'diff', String(pr.number), '--repo', repo], {
            encoding: 'utf8',
            maxBuffer: 64 * 1024 * 1024,
          });
          let keep = false;
          for (const line of diff.split('\n')) {
            if (line.startsWith('diff --git ')) {
              const m = line.match(/ b\/(.+)$/);
              keep = Boolean(m) && isDocsFile(m[1]);
            } else if (keep && line.startsWith('+') && !line.startsWith('+++')) {
              added += line.slice(1) + '\n';
            }
          }
        } catch (e) {
          console.log(`::warning::Could not fetch the diff of #${pr.number}, matching on title, body and paths only: ${e.message.split('\n')[0]}`);
        }
        pr.paths = paths;
        pr.text = `${pr.title}\n${pr.body || ''}\n${added}`;
        docsPrs.push(pr);
      }

      const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const bumpScore = { major: 30, minor: 20, patch: 0 };
      const parsed = [];
      for (const file of fs.readdirSync('.changeset').sort()) {
        if (!file.endsWith('.md') || file === 'README.md') continue;
        const raw = fs.readFileSync(path.join('.changeset', file), 'utf8');
        const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!m) continue;
        const releases = [...m[1].matchAll(/^['"]?([^'":]+)['"]?\s*:\s*(major|minor|patch)\s*$/gm)]
          .map(r => ({ pkg: r[1].trim(), bump: r[2] }));
        const body = m[2].trim();
        const terms = [...new Set([...body.matchAll(/`([^`\n]{4,60})`/g)].map(t => t[1]))]
          .filter(t => !t.startsWith('@backstage/'));
        parsed.push({ file, releases, body, terms });
      }

      // Key terms for fuzzy matching: code-like or long, and not shared by 3 or more changesets.
      const termCount = {};
      for (const c of parsed) for (const t of c.terms) termCount[t] = (termCount[t] || 0) + 1;
      const isKeyTerm = t => t.length >= 5 && termCount[t] < 3 && (/[A-Z0-9._\-\/:]/.test(t) || t.length >= 10);

      const rows = [];
      for (const { file, releases, body, terms } of parsed) {
        const bump = releases.some(r => r.bump === 'major') ? 'major'
          : releases.some(r => r.bump === 'minor') ? 'minor' : 'patch';

        // Exact: any open pull request names the changeset file.
        // Match: a docs pull request mentions 2 or more key terms, 1 key term and a package of the changeset,
        // or 1 key term that only this changeset uses and that the checked-out docs do not mention yet.
        const nameRe = new RegExp(`(^|[^A-Za-z0-9_-])${escape(file)}`, 'm');
        const keyTerms = terms.filter(isKeyTerm);
        const coveredBy = [];
        for (const pr of prs) {
          if (nameRe.test(pr.body || '')) {
            coveredBy.push({ pr: pr.number, how: 'names the changeset' });
            continue;
          }
          if (!pr.isDocs) continue;
          const hits = keyTerms.filter(t => pr.text.includes(t));
          const pkgHit = releases.some(r =>
            pr.text.includes(r.pkg) || (pkgDirs[r.pkg] && pr.paths.some(p => p.startsWith(pkgDirs[r.pkg]))));
          const newTerm = hits.some(t => termCount[t] === 1 && !docsText.includes(t));
          if (hits.length >= 2 || (hits.length === 1 && (pkgHit || newTerm))) {
            const listed = hits.slice(0, 3).map(t => `\`${t}\``).join(', ');
            coveredBy.push({ pr: pr.number, how: `mentions ${listed}${pkgHit ? ' and its package' : ''}` });
          }
        }

        let score = bumpScore[bump];
        if (/\*\*BREAKING\*\*|breaking/i.test(body)) score += 15;
        if (/deprecat/i.test(body)) score += 15;
        if (/config|option|app-config/i.test(body)) score += 10;
        if (/\b(added|adds|new|introduc|support)/i.test(body)) score += 5;
        if (/\b(extension|API|service|hook|endpoint)\b/.test(body)) score += 5;
        if (bump === 'patch' && /\b(internal|refactor|dependenc|bump|test|typo|fix(ed|es)?)\b/i.test(body)) score -= 10;

        const termsInDocs = terms.filter(t => docsText.includes(t));
        if (terms.length > 0 && termsInDocs.length === terms.length) score -= 10;

        rows.push({
          file: `.changeset/${file}`,
          bump,
          packages: releases.map(r => r.pkg),
          score,
          coveredBy,
          termsInDocs: `${termsInDocs.length}/${terms.length}`,
          summary: body.split('\n').find(l => l.trim()) || '',
        });
      }

      const covered = rows.filter(r => r.coveredBy.length > 0);
      const gaps = rows.filter(r => r.coveredBy.length === 0).sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));
      fs.writeFileSync(path.join(outDir, 'doc-gaps.json'), JSON.stringify({ covered, gaps }, null, 2));

      const cell = s => String(s).replace(/\|/g, '\\|').slice(0, 200);
      const lines = [
        '# Changeset triage',
        '',
        `Total changesets: ${rows.length}. Open pull requests checked: ${prs.length}, of which ${docsPrs.length} change documentation. Covered: ${covered.length}. Uncovered: ${gaps.length}.`,
        '',
        '## Covered by open pull requests (do not pick)',
        '',
        ...(covered.length ? covered.map(r => `- ${r.file}: ${r.coveredBy.map(c => `#${c.pr} (${c.how})`).join('; ')}`) : ['- none']),
        '',
        '## Uncovered changesets, ranked by score',
        '',
        '| Rank | Changeset | Bump | Score | Terms already in docs | Packages | Summary |',
        '| --- | --- | --- | --- | --- | --- | --- |',
        ...gaps.map((r, i) => `| ${i + 1} | ${r.file} | ${r.bump} | ${r.score} | ${r.termsInDocs} | ${cell(r.packages.join(', '))} | ${cell(r.summary)} |`),
        '',
      ];
      fs.writeFileSync(path.join(outDir, 'doc-gaps.md'), lines.join('\n'));
      console.log(`changesets=${rows.length} prs=${prs.length} docsPrs=${docsPrs.length} covered=${covered.length} uncovered=${gaps.length}`);
      console.log(covered.map(r => `covered ${r.file}: ${r.coveredBy.map(c => `#${c.pr} (${c.how})`).join('; ')}`).join('\n'));
      console.log(gaps.slice(0, 10).map((r, i) => `${i + 1}. ${r.file} (${r.bump}, score ${r.score})`).join('\n'));
      EOF

network:
  allowed:
    - defaults
    - dotnet
    - node
    - python
    - rust
    - java

permissions:
  contents: read
  issues: read
  pull-requests: read

tools:
  github:
    toolsets: [default]
  edit:
  bash: true

engine:
  id: copilot
  env:
    GH_AW_HARNESS_WATCHDOG_TIMEOUT_MS: '600000'

timeout-minutes: 60

safe-outputs:
  create-pull-request:
    max: 1
    expires: 2d
    title-prefix: '[docs] '
    labels: [documentation, automation]
    draft: true
    protected-files: blocked

source: githubnext/agentics/workflows/doc-updater.md@main
source-sha: '139fa09ef17cde4135e696ff8e7af09bc5ddfa6e'
---

# Documentation Updater

You are an AI documentation agent for the Backstage repository. Each run, you document exactly one adopter-facing change that is not yet documented, and open exactly one draft pull request for it. The workflow runs daily, so other gaps are handled by later runs.

## Rules for this run

- Open at most one pull request. After you open it, finish the run.
- Never invent configuration keys, defaults, API names or behavior. Every option and example must be confirmed in the source code in the checkout.
- Every behavior or configuration claim you write must be backed by a `path:line` reference in the checked-out source. Changeset text alone is not enough. If you cannot cite a source line for a claim, leave the claim out of the docs and list it under "Needs human review" in the pull request body.
- Read `docs/contribute/doc-style-guide.md` first and follow it.

## Step 1. Read the triage file

A setup step has already sorted every changeset before you started. Read `/tmp/gh-aw/agent/doc-gaps.md` with `cat`. It contains:

- The changesets that an open pull request on `${{ github.repository }}` already covers, either because it names the changeset file or because it changes documentation that mentions the changeset's key terms. Never pick one of these, and never document the same behavior again.
- The uncovered changesets, ranked by adopter impact. The "Terms already in docs" column shows how many code terms from the changeset already appear in `docs/`. It is a hint, not a verdict.

Do not redo the triage, and do not list pull requests yourself to decide what is covered. The file is the source of truth for coverage.

## Step 2. Pick the top uncovered gap

Start with rank 1 and confirm that it is a real gap:

- It is adopter-facing: not internal refactoring, test-only or build-only changes, dependency bumps, or a bug fix that needs no explanation.
- It is not already documented. Search for its key terms, for example `grep -ril "<term>" docs/ plugins/*/README.md packages/*/README.md`.

If it is not a real gap, move to the next rank. Check at most 10 ranks. If none of them is a real gap, call `noop` and name the changesets you checked and why each was skipped.

You may include other uncovered changesets that describe the same feature as the one you picked, so that one pull request documents the feature completely. Never include a changeset from the covered list.

## Step 3. Gather context

- Source code in the checkout (`packages/`, `plugins/`, `config.d.ts` files and TSDoc comments). Use it to confirm option names, defaults and example snippets.
- As you confirm each claim, record its `path:line` in a working file outside the repository tree, such as `/tmp/gh-aw/agent/sources.md`. Take line numbers from `grep -n` output or from reading the file, never from memory.
- Merged commits on the default branch of the upstream `backstage/backstage` repository, for context only. The upstream repository is public and read-only: never write to it. Use `list_commits` on `master`, then `get_commit` and `get_file_contents` at those commits or at `ref: master`. Never request PR head refs such as `refs/pull/<number>/head` or a PR head branch, and do not rely on `pull_request_read` bodies: content that is not yet merged is filtered out by the integrity policy. Do not try to work around a filtered result.

## Step 4. Choose where it goes

- Concepts, guides and configuration go in `docs/features`, `docs/backend-system`, `docs/frontend-system` or `docs/conf`.
- Package README files only get package-specific setup, and they link to the docs instead of duplicating them.
- Never edit `docs/releases/**`, `docs/reference/**`, `CHANGELOG.md` files or `*-api-report.md` files.
- Match the target page's heading and example style.
- When the change adds options or APIs, include a YAML configuration example or a TypeScript code example. Check every name in it against the source.
- You may touch up to about 3 files when they belong together.

## Step 5. Write the documentation

Edit the files with the edit tool. Write for adopters in plain language, in the style guide's voice. Link related pages instead of repeating them. Write only claims that have a recorded source reference from step 3.

## Step 6. Self-check

- Run `npx prettier --check <edited files>`. Fix any formatting problem it reports.
- Re-check every source reference: run `sed -n '<line>p' <path>` for each one and confirm that the line supports the claim. Fix the reference, or remove the claim and move it to "Needs human review".
- If `vale` is available on the path, run `node scripts/check-docs-quality.js <edited files>` and fix what it reports. Otherwise, write "Vale: not run" in the pull request body.
- If the self-check fails and you cannot fix it, do not open the pull request. Call `noop` with the reason.

## Step 7. Open one pull request

1. Create a branch with a descriptive name: `git checkout -b docs/<short-topic-name>`.
2. Stage exactly the edited files by name (never `git add -A`), check that `git status` shows nothing else, and commit.
3. Call the safe-outputs create-pull-request tool once, with `branch` set to the exact output of `git branch --show-current`. Do not push, and do not change git remotes.

**Title format**: `[docs] <short description of what is now documented>`

The body must start with one line per documented changeset, in exactly this form, so that later runs can tell the changeset is covered:

```text
Changeset: .changeset/<file name>.md
```

After those lines, the body must include:

- The rank and score of the picked changeset from the triage file, and any higher ranks you skipped with a few words of reason.
- Which page it edited, and why that page.
- A "Source references" table with one row per behavior or configuration claim in the docs change, with the columns "Claim" and "Source" (`path:line`). Line numbers must come from `grep -n` or from reading the file.
- A "Needs human review" section listing anything you could not back with a source reference, or "None".
- The results of the self-check.

## Edge cases

- The triage file lists no uncovered changesets, or none of the ranks you checked is a real gap: call `noop` with the reason.
- Unclear behavior that you cannot confirm in the source: do not document it. Mention it in the pull request body under "Needs human review", or pick the next rank.
