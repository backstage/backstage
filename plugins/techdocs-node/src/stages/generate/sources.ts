/*
 * Copyright 2026 The Backstage Authors
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

import fs from 'fs-extra';
import path from 'node:path';
import yaml from 'js-yaml';
import { Minimatch } from 'minimatch';
import { isChildPath, LoggerService } from '@backstage/backend-plugin-api';
import { MKDOCS_SCHEMA } from './helpers';

/**
 * Name of the directory, relative to the generated site root, that holds
 * preserved documentation sources.
 *
 * @public
 */
export const TECHDOCS_SOURCES_DIR = '_sources';

/**
 * Name of the manifest file written to the root of the sources directory.
 *
 * @public
 */
export const TECHDOCS_SOURCES_MANIFEST = 'manifest.json';

/**
 * Options for {@link preserveTechDocsSources}.
 *
 * @public
 */
export type PreserveTechDocsSourcesOptions = {
  /** The prepared directory containing `mkdocs.yml` and the docs directory. */
  inputDir: string;
  /** The generated site directory. Sources are written to `_sources/` inside it. */
  outputDir: string;
  logger: LoggerService;
  /**
   * Glob patterns for files to leave out, in addition to the built-in
   * excludes. Patterns are matched against paths relative to the input
   * directory. Patterns without a slash match a file or directory name at
   * any depth, for example `*.png` or `build`, and a leading slash anchors a
   * pattern to the input directory root, for example `/README.md`.
   */
  excludes?: string[];
  /**
   * Files, relative to the input directory, to store alongside the docs
   * directory. Defaults to `['README.md']`.
   */
  additionalFiles?: string[];
  /**
   * The documentation engine that generated the site, recorded in the
   * manifest. Defaults to the engine recorded in `techdocs_metadata.json`.
   */
  engine?: string;
  /** The etag of the prepared source tree, recorded in the manifest. */
  etag?: string;
};

/**
 * Files and directories that are never stored. Dotfiles and `templates/`
 * mirror the MkDocs default for `exclude_docs`, so sources never contain
 * files that the generated site leaves out by default.
 */
const BUILT_IN_EXCLUDES = ['.*', 'node_modules', '__pycache__', '*.pyc'];
const BUILT_IN_DOCS_EXCLUDES = '/templates/';

type ExcludeRule = { negate: boolean; matchers: Minimatch[]; dirOnly: boolean };

/**
 * Converts gitignore-style lines, as used by the MkDocs `exclude_docs` and
 * `draft_docs` options, into match rules relative to the docs directory.
 */
function parseGitignoreRules(spec: string): ExcludeRule[] {
  const rules: ExcludeRule[] = [];
  for (const rawLine of spec.split('\n')) {
    let line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const negate = line.startsWith('!');
    if (negate) {
      line = line.slice(1);
    }
    const dirOnly = line.endsWith('/');
    line = line.replace(/\/+$/, '');
    const anchored = line.includes('/');
    line = line.replace(/^\/+/, '');
    if (!line) {
      continue;
    }
    const pattern = anchored ? line : `**/${line}`;
    const opts = { dot: true };
    rules.push({
      negate,
      dirOnly,
      matchers: [
        new Minimatch(pattern, opts),
        new Minimatch(`${pattern}/**`, opts),
      ],
    });
  }
  return rules;
}

function matchesGitignoreRules(
  rules: ExcludeRule[],
  relPath: string,
  isDir: boolean,
): boolean {
  let excluded = false;
  for (const rule of rules) {
    const [self, contents] = rule.matchers;
    const matched =
      contents.match(relPath) ||
      ((!rule.dirOnly || isDir) && self.match(relPath));
    if (matched) {
      excluded = !rule.negate;
    }
  }
  return excluded;
}

/** @internal */
export function createSourceExcludeMatcher(
  excludes: string[] = [],
): (relPath: string) => boolean {
  // Patterns starting with a slash are anchored to the input directory root.
  const matchers = [...BUILT_IN_EXCLUDES, ...excludes].map(pattern =>
    pattern.startsWith('/')
      ? new Minimatch(pattern.slice(1), { dot: true })
      : new Minimatch(pattern, { dot: true, matchBase: true }),
  );
  return relPath => {
    const segments = relPath.split('/');
    // Check every ancestor so that excluding a directory also excludes its
    // contents, for example when an additional file lives inside it.
    return segments.some((_, i) => {
      const prefix = segments.slice(0, i + 1).join('/');
      return matchers.some(m => m.match(prefix));
    });
  };
}

async function readMkdocsConfig(
  inputDir: string,
): Promise<Record<string, unknown> | undefined> {
  for (const name of ['mkdocs.yaml', 'mkdocs.yml']) {
    const file = path.join(inputDir, name);
    if (await fs.pathExists(file)) {
      const content = await fs.readFile(file, 'utf8');
      const parsed = yaml.load(content, { schema: MKDOCS_SCHEMA });
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, unknown>)
        : undefined;
    }
  }
  return undefined;
}

async function walk(
  root: string,
  relDir: string,
  skip: (relPath: string, isDir: boolean) => boolean,
): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(path.join(root, relDir), {
    withFileTypes: true,
  });
  for (const entry of entries) {
    const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;
    // Symbolic links are never followed, to avoid storing content from
    // outside the prepared directory.
    if (entry.isSymbolicLink()) {
      continue;
    }
    if (entry.isDirectory()) {
      if (!skip(relPath, true)) {
        files.push(...(await walk(root, relPath, skip)));
      }
    } else if (entry.isFile() && !skip(relPath, false)) {
      files.push(relPath);
    }
  }
  return files;
}

/**
 * Copies documentation sources into the `_sources/` directory of a generated
 * TechDocs site and writes a `manifest.json` index of the stored files.
 *
 * This works for any documentation engine that reads `mkdocs.yml`. Files that
 * the generated site leaves out are also left out of the sources: dotfiles,
 * `templates/`, and anything matched by the `exclude_docs` or `draft_docs`
 * options in `mkdocs.yml`.
 *
 * @public
 */
export async function preserveTechDocsSources(
  options: PreserveTechDocsSourcesOptions,
): Promise<void> {
  const { inputDir, outputDir, logger, engine, etag } = options;
  const resolvedInputDir = path.resolve(inputDir);

  const mkdocsConfig = await readMkdocsConfig(resolvedInputDir);
  const docsDir =
    typeof mkdocsConfig?.docs_dir === 'string' && mkdocsConfig.docs_dir
      ? mkdocsConfig.docs_dir
      : 'docs';
  const docsSource = path.resolve(resolvedInputDir, docsDir);
  if (!isChildPath(resolvedInputDir, docsSource)) {
    logger.warn(
      'Skipping source storage: docs_dir resolves outside the input directory',
    );
    return;
  }
  if (docsSource === resolvedInputDir) {
    logger.warn(
      'Skipping source storage: docs_dir resolves to the input directory, which may contain non-documentation files',
    );
    return;
  }
  const docsDirRel = path
    .relative(resolvedInputDir, docsSource)
    .split(path.sep)
    .join('/');

  const isExcluded = createSourceExcludeMatcher(options.excludes);
  const docsRules = parseGitignoreRules(
    [
      BUILT_IN_DOCS_EXCLUDES,
      typeof mkdocsConfig?.exclude_docs === 'string'
        ? mkdocsConfig.exclude_docs
        : '',
      typeof mkdocsConfig?.draft_docs === 'string'
        ? mkdocsConfig.draft_docs
        : '',
    ].join('\n'),
  );

  const sourcesDir = path.join(outputDir, TECHDOCS_SOURCES_DIR);
  await fs.ensureDir(sourcesDir);
  const stored = new Set<string>();

  if (await fs.pathExists(docsSource)) {
    const docFiles = await walk(
      docsSource,
      '',
      (relPath, isDir) =>
        isExcluded(`${docsDirRel}/${relPath}`) ||
        matchesGitignoreRules(docsRules, relPath, isDir),
    );
    for (const relPath of docFiles) {
      const target = `${docsDirRel}/${relPath}`;
      await fs.copy(
        path.join(docsSource, relPath),
        path.join(sourcesDir, target),
      );
      stored.add(target);
    }
  }

  for (const entry of options.additionalFiles ?? ['README.md']) {
    const source = path.resolve(resolvedInputDir, entry);
    if (!isChildPath(resolvedInputDir, source) || source === resolvedInputDir) {
      logger.warn(
        `Skipping additional source file '${entry}': path resolves outside the input directory`,
      );
      continue;
    }
    const relPath = path
      .relative(resolvedInputDir, source)
      .split(path.sep)
      .join('/');
    if (relPath === TECHDOCS_SOURCES_MANIFEST) {
      logger.warn(
        `Skipping additional source file '${entry}': the name is reserved for the sources manifest`,
      );
      continue;
    }
    if (stored.has(relPath) || isExcluded(relPath)) {
      continue;
    }
    let stat;
    try {
      stat = await fs.lstat(source);
    } catch {
      continue; // Missing additional files are silently skipped
    }
    if (!stat.isFile()) {
      logger.warn(
        `Skipping additional source file '${entry}': only regular files are supported`,
      );
      continue;
    }
    await fs.copy(source, path.join(sourcesDir, relPath));
    stored.add(relPath);
  }

  const storedFiles = [...stored].sort();
  const metadataPath = path.join(outputDir, 'techdocs_metadata.json');
  const metadata = (await fs.pathExists(metadataPath))
    ? await fs.readJson(metadataPath)
    : undefined;
  const recordedEngine = engine ?? metadata?.engine;

  await fs.writeJson(path.join(sourcesDir, TECHDOCS_SOURCES_MANIFEST), {
    generatedAt: Date.now(),
    ...(recordedEngine && { engine: recordedEngine }),
    docsDir: docsDirRel,
    ...(etag && { etag }),
    files: storedFiles,
  });

  // Add the stored sources to the site's file list, which is used to
  // invalidate cached objects after publishing.
  if (metadata) {
    const sourceFiles = [...storedFiles, TECHDOCS_SOURCES_MANIFEST].map(f =>
      path.join(TECHDOCS_SOURCES_DIR, ...f.split('/')),
    );
    metadata.files = [...new Set([...(metadata.files ?? []), ...sourceFiles])];
    await fs.writeJson(metadataPath, metadata);
  }

  logger.info(`Preserved ${stored.size} source files in ${sourcesDir}`);
}
