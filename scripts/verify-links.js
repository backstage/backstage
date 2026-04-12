#!/usr/bin/env node
/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @backstage/no-undeclared-imports */

const { resolve: resolvePath, join: joinPath, dirname } = require('node:path');
const fs = require('node:fs').promises;
const { existsSync, statSync } = require('node:fs');

const IGNORED_DIRS = ['node_modules', 'dist', 'bin', '.git'];
const projectRoot = resolvePath(__dirname, '..');

// Zero-width and other invisible Unicode characters that shouldn't appear in URLs
const INVISIBLE_CHAR_PATTERN =
  /[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD\u2060\u2028\u2029]/;

// Generates a GitHub/Docusaurus-compatible heading slug.
// Handles explicit {#custom-id} overrides and standard slugification.
function headingToSlug(headingText) {
  const explicitId = headingText.match(/\{#([^}]+)\}\s*$/);
  if (explicitId) {
    return explicitId[1];
  }

  let slug = headingText
    .toLowerCase()
    // Remove inline code backticks
    .replace(/`/g, '')
    // Remove markdown bold/italic markers
    .replace(/[*_]/g, '')
    // Remove markdown links, keep link text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Remove HTML tags in a loop to handle nested fragments like <scr<script>ipt>
  let previous;
  do {
    previous = slug;
    slug = slug.replace(/<[^>]+>/g, '');
  } while (slug !== previous);

  return (
    slug
      // Replace special characters with hyphens (keeping alphanumeric, hyphens, spaces)
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  );
}

// Extracts all heading anchors from a markdown file's content,
// handling duplicate headings with -1, -2, etc. suffixes (GitHub/Docusaurus behavior)
function extractHeadingAnchors(content) {
  const anchors = new Set();
  const slugCounts = new Map();

  // Strip fenced code blocks to avoid matching headings inside them
  const stripped = content.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');

  const headingPattern = /^#{1,6}\s+(.+)$/gm;
  for (
    let match = headingPattern.exec(stripped);
    match !== null;
    match = headingPattern.exec(stripped)
  ) {
    const baseSlug = headingToSlug(match[1]);
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    if (count === 0) {
      anchors.add(baseSlug);
    } else {
      anchors.add(`${baseSlug}-${count}`);
    }
  }
  return anchors;
}

// Cache for file content and extracted anchors to avoid repeated reads
const anchorCache = new Map();

async function getAnchorsForFile(filePath) {
  const absPath = resolvePath(projectRoot, filePath);
  if (anchorCache.has(absPath)) {
    return anchorCache.get(absPath);
  }
  try {
    const content = await fs.readFile(absPath, 'utf8');
    const anchors = extractHeadingAnchors(content);
    anchorCache.set(absPath, anchors);
    return anchors;
  } catch {
    anchorCache.set(absPath, null);
    return null;
  }
}

async function listFiles(dir) {
  const files = await fs.readdir(dir);
  const paths = await Promise.all(
    files
      .filter(file => !IGNORED_DIRS.includes(file))
      .map(async file => {
        const path = joinPath(dir, file);

        if ((await fs.stat(path)).isDirectory()) {
          return listFiles(path);
        }
        return path;
      }),
  );
  return paths.flat();
}

async function verifyUrl(basePath, absUrl, docPages) {
  // Check for invisible/zero-width characters in the URL
  if (INVISIBLE_CHAR_PATTERN.test(absUrl)) {
    return { url: absUrl, basePath, problem: 'invisible-chars' };
  }

  const anchorMatch = absUrl.match(/#(.+)$/);
  const anchor = anchorMatch ? anchorMatch[1] : undefined;
  const urlWithoutAnchor = absUrl.replace(/#.*$/, '');
  const isGitHubUrl =
    /https:\/\/github.com\/backstage\/backstage\/(tree|blob)\/master/.test(
      urlWithoutAnchor,
    );
  const url = urlWithoutAnchor.replace(
    /https:\/\/github.com\/backstage\/backstage\/(tree|blob)\/master/,
    '',
  );

  // Avoid having absolute URL links within docs/, so that links work on the site
  if (
    absUrl.match(
      /https:\/\/github.com\/backstage\/backstage\/(tree|blob)\/master\/docs\//,
    ) &&
    basePath.match(/^(?:docs|microsite)\//)
  ) {
    // Exception for linking to the changelogs, since we encourage those to be browsed in GitHub
    if (absUrl.match(/docs\/releases\/.+-changelog\.md$/)) {
      if (docPages.has(url.slice(0, -'.md'.length))) {
        return undefined;
      }
      return { url: absUrl, basePath, problem: 'missing' };
    }

    return { url: absUrl, basePath, problem: 'github' };
  }

  // Same-file anchor reference (e.g. #some-heading)
  if (!url && anchor) {
    const anchors = await getAnchorsForFile(basePath);
    if (anchors && !anchors.has(anchor)) {
      return { url: absUrl, basePath, problem: 'bad-anchor' };
    }
    return undefined;
  }

  if (!url) {
    return undefined;
  }

  // Only verify existence of local files for now, so skip anything with a schema
  if (url.match(/[a-z]+:/)) {
    return undefined;
  }

  if (basePath.startsWith('.changeset/')) {
    if (absUrl.match(/^https?:\/\//)) {
      return undefined;
    }
    return { url, basePath, problem: 'out-of-changeset' };
  }

  let path = '';

  if (url.startsWith('/')) {
    if (url.startsWith('/docs/')) {
      if (basePath.match(/^(?:docs)\//)) {
        return { url, basePath, problem: 'not-relative' };
      }
      if (basePath.startsWith('microsite/')) {
        if (docPages.has(url)) {
          return undefined;
        }
        return { url, basePath, problem: 'doc-missing' };
      }
    }

    if (url.startsWith('/api/stable/')) {
      const apiPath = resolvePath(
        projectRoot,
        `type-docs/${url.slice('/api/stable/'.length)}`,
      );
      if (existsSync(apiPath)) {
        return undefined;
      }
      return { url, basePath, apiPath, problem: 'api-missing' };
    }

    const staticPath = resolvePath(projectRoot, 'microsite/static', `.${url}`);
    if (existsSync(staticPath)) {
      return undefined;
    }

    path = resolvePath(projectRoot, `.${url}`);
  } else {
    path = resolvePath(dirname(resolvePath(projectRoot, basePath)), url);
  }

  if (
    absUrl === url &&
    basePath.match(/^(?:docs)\//) &&
    !path.startsWith(resolvePath(projectRoot, 'docs'))
  ) {
    return { url, basePath, problem: 'out-of-docs' };
  }

  if (!existsSync(path)) {
    return { url, basePath, problem: 'missing' };
  }

  // Flag relative links to directories that are missing /index.md —
  // these resolve as existing dirs but aren't valid doc links.
  // Only check within docs/ since other directories (like microsite/)
  // may legitimately link to directories in READMEs.
  if (
    basePath.match(/^docs\//) &&
    !url.startsWith('/') &&
    existsSync(path) &&
    statSync(path).isDirectory()
  ) {
    return { url: absUrl, basePath, problem: 'directory-link' };
  }

  // Verify anchors in cross-file links, but skip rewritten GitHub URLs
  // since their anchors may reference generated content we can't verify locally
  if (anchor && path.endsWith('.md') && !isGitHubUrl) {
    const targetAnchors = await getAnchorsForFile(
      path.startsWith(projectRoot) ? path.slice(projectRoot.length + 1) : path,
    );
    if (targetAnchors && !targetAnchors.has(anchor)) {
      return { url: absUrl, basePath, problem: 'bad-anchor' };
    }
  }

  return undefined;
}

// Strips fenced code blocks from markdown content so we don't check links inside them
function stripCodeBlocks(content) {
  return content.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
}

async function verifyFile(filePath, docPages) {
  const content = await fs.readFile(filePath, 'utf8');
  const strippedContent = stripCodeBlocks(content);
  const mdLinks = strippedContent.match(/\[.+?\]\(.+?\)/g) || [];
  const badUrls = [];

  for (const mdLink of mdLinks) {
    const url = mdLink.match(/\[.+\]\((.+)\)/)[1].trim();
    const badUrl = await verifyUrl(filePath, url, docPages);
    if (badUrl) {
      badUrls.push(badUrl);
    }
  }

  const multiLineLinks =
    strippedContent.match(/\[[^\]\n]+?\n[^\]\n]*?(?:\n[^\]\n]*?)?\]\(/g) || [];
  badUrls.push(
    ...multiLineLinks.map(url => ({
      url,
      basePath: filePath,
      problem: 'multi-line',
    })),
  );

  return badUrls;
}

// This discovers the doc paths as they will be available on the microsite.
// It is used to validate microsite links from outside /docs/, as those
// are not transformed from the markdown file representation by docusaurus.
async function findExternalDocsLinks(dir) {
  const allFiles = await listFiles(dir);
  const mdFiles = allFiles.filter(p => p.endsWith('.md'));

  const paths = new Map();

  for (const file of mdFiles) {
    const content = await fs.readFile(file, 'utf8');
    const url = `/${file}`;
    const match = content.match(/---(?:\r|\n|.)*^id: (.*)$/m);

    // Both docs with an id and without should remove trailing /index
    const realPath = (
      match ? joinPath(dirname(url), match[1]) : url.replace(/\.md$/, '')
    ).replace(/\/index$/, '');

    paths.set(url, realPath);
    if (url.endsWith('/index.md')) {
      paths.set(url.replace(/\/index\.md$/, ''), realPath);
    }
  }

  return paths;
}

async function main() {
  process.chdir(projectRoot);

  const isCI = Boolean(process.env.CI);

  const files = await listFiles('.');
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const badUrls = [];

  const docPages = await findExternalDocsLinks('docs');
  const docPageSet = new Set(docPages.values());

  for (const mdFile of mdFiles) {
    const badFileUrls = await verifyFile(mdFile, docPageSet);
    badUrls.push(...badFileUrls);
  }

  const hasReference = existsSync(resolvePath(projectRoot, 'docs/reference'));
  if (!hasReference) {
    console.log(
      "Skipping API reference link validation, no docs/reference/ dir. Reference docs can be built with 'yarn build:api-docs'",
    );
  }

  const hasApiDocs = existsSync(resolvePath(projectRoot, 'type-docs'));
  if (!hasApiDocs) {
    console.log(
      "Skipping API docs link validation, no type-docs/ dir. API docs can be built with 'yarn backstage-repo-tools package-docs'",
    );
  }

  if (badUrls.length) {
    console.log(`Found ${badUrls.length} bad links within repo`);
    for (const badUrl of badUrls) {
      const { url, basePath, problem } = badUrl;
      if (problem === 'missing') {
        if (url.startsWith('../reference/') && !isCI && !hasReference) {
          continue;
        }
        console.error(
          `Unable to reach ${url} from root or microsite/static/, linked from ${basePath}`,
        );
      } else if (problem === 'out-of-docs') {
        console.error(
          'Links in docs must use absolute URLs for targets outside of docs',
        );
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
        console.error(
          `  Likely replace with: https://github.com/backstage/backstage/blob/master/${url.replace(
            /^[./]+/,
            '',
          )}`,
        );
      } else if (problem === 'out-of-changeset') {
        console.error('Links in changesets must use absolute URLs');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'doc-missing') {
        const suggestion =
          docPages.get(url) ||
          docPages.get(new URL(url, 'http://localhost').pathname);
        console.error('Links into /docs/ must use an externally reachable ID');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
        if (suggestion) {
          console.error(`  Replace with: ${suggestion}`);
        }
      } else if (problem === 'api-missing') {
        if (!hasApiDocs) {
          continue;
        }
        console.error('Invalid API docs link');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
        console.error(`  Resolved path: ${badUrl.apiPath}`);
      } else if (problem === 'not-relative') {
        console.error('Links within /docs/ must be relative');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'github') {
        console.error(
          `Link to docs/ should not use a GitHub URL, use a relative URL instead`,
        );
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'multi-line') {
        console.error(`Links are not allowed to span multiple lines:`);
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url.replace(/\n/g, '\n      ')}`);
      } else if (problem === 'bad-anchor') {
        console.error(`Anchor not found in target document`);
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'directory-link') {
        console.error(
          `Link points to a directory instead of a file, use index.md suffix`,
        );
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'invisible-chars') {
        console.error(`Link contains invisible or zero-width characters`);
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${JSON.stringify(url)}`);
      }
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
