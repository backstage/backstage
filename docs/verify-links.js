#!/usr/bin/env node
/*
 * Copyright 2020 Spotify AB
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

const { resolve: resolvePath, dirname } = require('path');
const fs = require('fs-extra');
const recursive = require('recursive-readdir');

const projectRoot = resolvePath(__dirname, '..');

async function verifyUrl(basePath, url) {
  // Avoid having absolute URL links within docs/, so that links work on the site
  if (
    url.match(
      /https:\/\/github.com\/spotify\/backstage\/(tree|blob)\/master\/docs\//,
    ) &&
    basePath.match(/^(?:docs|microsite)\//)
  ) {
    return { url, basePath, problem: 'absolute' };
  }

  url = url.replace(/#.*$/, '');
  url = url.replace(
    /https:\/\/github.com\/spotify\/backstage\/(tree|blob)\/master/,
    '',
  );
  if (!url) {
    return;
  }

  // Only verify existence of local files for now, so skip anything with a schema
  if (!url.match(/[a-z]+:/)) {
    const path = url.startsWith('/')
      ? resolvePath(projectRoot, `.${url}`)
      : resolvePath(dirname(resolvePath(projectRoot, basePath)), url);
    const exists = await fs.pathExists(path);
    if (!exists) {
      return { url, basePath, problem: 'missing' };
    }
  }

  return;
}

async function verifyFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const mdLinks = content.match(/\[.+?\]\(.+?\)/g) || [];
  const badUrls = [];

  for (const mdLink of mdLinks) {
    const url = mdLink.match(/\[.+\]\((.+)\)/)[1].trim();
    const badUrl = await verifyUrl(filePath, url);
    if (badUrl) {
      badUrls.push(badUrl);
    }
  }

  return badUrls;
}

async function main() {
  process.chdir(projectRoot);

  const files = await recursive('.', [
    'node_modules',
    'dist',
    'bin',
    'microsite',
  ]);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const badUrls = [];

  for (const mdFile of mdFiles) {
    const badFileUrls = await verifyFile(mdFile);
    badUrls.push(...badFileUrls);
  }

  if (badUrls.length) {
    console.log(`Found ${badUrls.length} bad links within repo`);
    for (const { url, basePath, problem } of badUrls) {
      if (problem === 'missing') {
        console.error(`Unable to reach ${url}, linked from ${basePath}`);
      } else if (problem === 'absolute') {
        console.error(`Link to docs/ should be replaced by a relative URL`);
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      }
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
