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
import os from 'node:os';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { createLogger } from 'winston';
import { Config } from '@backstage/config';
import {
  TECHDOCS_SOURCE_MANIFEST,
  TechDocsNavigation,
  TechDocsSourceManifest,
  parseTechDocsMarkdown,
  TechDocsMarkdownTransform,
  techDocsSourceManifestSchema,
} from '@backstage/plugin-techdocs-common/alpha';
import type { GeneratorRunOptions } from '@backstage/plugin-techdocs-node';
import { createOrUpdateMetadata } from './helpers';

async function readConfig(inputDir: string, names: string[]) {
  const found = [];
  for (const name of names) {
    if (await fs.pathExists(path.join(inputDir, name))) found.push(name);
  }
  if (found.length > 1) throw new Error(`Keep only one of ${names.join(', ')}`);
  if (!found.length) return undefined;
  const file = path.join(inputDir, found[0]);
  const stat = await fs.lstat(file);
  if (!stat.isFile() || stat.size > 100_000)
    throw new Error('Invalid documentation configuration file');
  const value = yaml.load(await fs.readFile(file, 'utf8'), {
    schema: yaml.JSON_SCHEMA,
  });
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Documentation configuration must be a mapping');
  return value as Record<string, unknown>;
}

/** Convert supported MkDocs settings without executing plugins or YAML tags. @alpha */
export async function migrateTechDocsConfig(
  inputDir: string,
): Promise<{ diagnostics: string[] }> {
  if (
    (await fs.pathExists(path.join(inputDir, 'techdocs.yaml'))) ||
    (await fs.pathExists(path.join(inputDir, 'techdocs.yml')))
  ) {
    throw new Error('TechDocs configuration already exists');
  }
  const config = await readConfig(inputDir, ['mkdocs.yml', 'mkdocs.yaml']);
  if (!config) throw new Error('No mkdocs.yml or mkdocs.yaml found');
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'techdocs-migrate-'));
  let manifest: TechDocsSourceManifest;
  try {
    await generateTechDocsSource(
      { inputDir, outputDir: staging, logger: createLogger({ silent: true }) },
      false,
    );
    manifest = techDocsSourceManifestSchema.parse(
      await fs.readJson(path.join(staging, TECHDOCS_SOURCE_MANIFEST)),
    );
  } finally {
    await fs.remove(staging);
  }
  const diagnostics = manifest.diagnostics;
  const toConfigNav = (entries: TechDocsNavigation[]): unknown[] =>
    entries.map(entry => ({
      [entry.title]: entry.path ?? toConfigNav(entry.children ?? []),
    }));
  await fs.writeFile(
    path.join(inputDir, 'techdocs.yaml'),
    yaml.dump({
      version: 1,
      title: manifest.title,
      docsDir: config.docs_dir ?? 'docs',
      ...(config.nav ? { nav: toConfigNav(manifest.nav) } : {}),
    }),
    { flag: 'wx' },
  );
  return { diagnostics };
}

function navigation(value: unknown, depth = 0): TechDocsNavigation[] {
  if (depth > 30 || !Array.isArray(value))
    throw new Error('Navigation must be a list with at most 30 nested levels');
  return value.flatMap(entry => {
    if (typeof entry === 'string') return [{ title: entry, path: entry }];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry))
      throw new Error('Invalid navigation entry');
    return Object.entries(entry).map(([title, target]) => {
      if (typeof target === 'string') return { title, path: target };
      return { title, children: navigation(target, depth + 1) };
    });
  });
}

async function validateOutput(
  input: string,
  outputDir: string,
  docsDir: string,
) {
  const requested = path.resolve(outputDir);
  let ancestor = requested;
  while (!(await fs.pathExists(ancestor))) ancestor = path.dirname(ancestor);
  const output = path.resolve(
    await fs.realpath(ancestor),
    path.relative(ancestor, requested),
  );
  const docs = path.resolve(input, docsDir);
  if (
    output === input ||
    input.startsWith(`${output}${path.sep}`) ||
    output === docs ||
    output.startsWith(`${docs}${path.sep}`)
  ) {
    throw new Error(
      'Documentation output must not replace the project or documentation sources',
    );
  }
}

/** Creates a bounded, data-only source snapshot. No source files are executed. @alpha */
export async function generateTechDocsSource(
  options: GeneratorRunOptions,
  legacy: boolean,
  transforms: TechDocsMarkdownTransform[] = [],
): Promise<void> {
  const input = await fs.realpath(options.inputDir);
  const explicit = await readConfig(input, ['techdocs.yaml', 'techdocs.yml']);
  const mkdocs = explicit
    ? undefined
    : await readConfig(input, ['mkdocs.yml', 'mkdocs.yaml']);
  const config = explicit ?? {
    title: mkdocs?.site_name,
    docsDir: mkdocs?.docs_dir,
    nav: mkdocs?.nav,
  };
  if (
    explicit &&
    (explicit.version !== 1 ||
      Object.keys(explicit).some(
        key => !['version', 'title', 'docsDir', 'nav'].includes(key),
      ))
  ) {
    throw new Error(
      'techdocs.yaml requires version: 1 and supports only title, docsDir, and nav',
    );
  }
  const docsDir = config.docsDir ?? 'docs';
  if (typeof docsDir !== 'string' || typeof (config.title ?? '') !== 'string')
    throw new Error('title and docsDir must be strings');
  const docs = path.resolve(input, docsDir);
  if (
    docs === input ||
    !docs.startsWith(`${input}${path.sep}`) ||
    (await fs.realpath(docs)) !== docs
  ) {
    throw new Error(
      'docsDir must be a directory inside the documentation project, without symlinks',
    );
  }
  await validateOutput(input, options.outputDir, docsDir);
  const manifest: TechDocsSourceManifest = {
    version: 1,
    available: true,
    legacy,
    optedIn: Boolean(explicit),
    title: String(config.title ?? options.siteOptions?.name ?? 'Documentation'),
    pages: [],
    assets: [],
    nav: [],
    diagnostics: [],
  };
  if (mkdocs) {
    for (const key of Object.keys(mkdocs)) {
      if (!['site_name', 'docs_dir', 'nav'].includes(key))
        manifest.diagnostics.push(
          `Source rendering ignores MkDocs setting: ${key}`,
        );
    }
  }
  const filesDir = path.join(options.outputDir, '_techdocs/source/files');
  await fs.ensureDir(filesDir);
  let total = 0;
  let count = 0;
  const put = async (value: unknown) => {
    const content = JSON.stringify(value);
    const hash = createHash('sha256').update(content).digest('hex');
    const file = `_techdocs/source/files/${hash}.json`;
    await fs.outputFile(path.join(options.outputDir, file), content);
    return file;
  };
  const search: { title: string; text: string; location: string }[] = [];
  const walk = async (directory: string) => {
    for (const entry of (
      await fs.readdir(directory, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error(
          `Source documentation cannot contain symlinks: ${entry.name}`,
        );
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.isFile())
        throw new Error('Source documentation must contain regular files');
      const relative = path.relative(docs, full).split(path.sep).join('/');
      if (
        /[\\%?#:]/.test(relative) ||
        Array.from(relative).some(c => c.charCodeAt(0) < 32)
      )
        throw new Error(`Unsupported documentation path: ${relative}`);
      const stat = await fs.stat(full);
      total += stat.size;
      count++;
      if (stat.size > 10_000_000 || total > 100_000_000 || count > 10000)
        throw new Error('Source documentation exceeds publication limits');
      if (/\.md$/i.test(relative)) {
        if (stat.size > 1_000_000)
          throw new Error(`Markdown page exceeds 1 MB: ${relative}`);
        const markdown = await fs.readFile(full, 'utf8');
        const parsed = parseTechDocsMarkdown(markdown, transforms);
        const route = relative
          .replace(/(^|\/)index\.md$/i, '$1')
          .replace(/\.md$/i, '/');
        if (manifest.pages.some(p => p.route === route))
          throw new Error(`Duplicate documentation route: ${route}`);
        const title = parsed.title ?? relative;
        manifest.pages.push({
          path: relative,
          route,
          title,
          file: await put({ markdown }),
        });
        search.push({ title, text: parsed.text, location: route });
        for (const heading of parsed.headings)
          search.push({
            title: heading.title,
            text: '',
            location: `${route}#${heading.id.replace(/^techdocs-/, '')}`,
          });
        if (
          /^import |^export |<TechDocsAddon|\{\{|!include|^\s*```(?:plantuml|graphviz)/m.test(
            markdown,
          )
        ) {
          manifest.diagnostics.push(
            `Review unsupported executable or generated content in ${relative}`,
          );
        }
      } else if (
        /\.(png|jpe?g|gif|webp|avif|svg|pdf|txt|json|csv)$/i.test(relative)
      ) {
        // Assets are JSON envelopes, so direct navigation cannot execute uploaded HTML/SVG.
        const data = (await fs.readFile(full)).toString('base64');
        manifest.assets.push({
          path: relative,
          file: await put({
            data,
            extension: path.extname(relative).slice(1).toLowerCase(),
          }),
        });
      } else {
        manifest.diagnostics.push(`Unsupported asset omitted: ${relative}`);
      }
    }
  };
  await walk(docs);
  if (!manifest.pages.length) throw new Error('No Markdown pages found');
  if (!manifest.pages.some(page => page.route === '')) {
    const markdown = `# ${manifest.title}\n\n${manifest.pages
      .map(page => `- [${page.title.replace(/[\[\]]/g, '')}](${page.path})`)
      .join('\n')}`;
    manifest.pages.unshift({
      path: 'index.md',
      route: '',
      title: manifest.title,
      file: await put({ markdown }),
    });
    search.unshift({
      title: manifest.title,
      text: manifest.title,
      location: '',
    });
  }
  manifest.nav = config.nav
    ? navigation(config.nav)
    : manifest.pages.map(p => ({ title: p.title, path: p.path }));
  const checkNav = (entries: TechDocsNavigation[]): TechDocsNavigation[] =>
    entries.flatMap(entry => {
      if (entry.path && !manifest.pages.some(p => p.path === entry.path)) {
        if (explicit)
          throw new Error(`Navigation references missing page: ${entry.path}`);
        const directoryIndex = entry.path.replace(/\.md$/, '/index.md');
        if (manifest.pages.some(p => p.path === directoryIndex)) {
          manifest.diagnostics.push(
            `Updated migrated navigation: ${entry.path} -> ${directoryIndex}`,
          );
          return [{ ...entry, path: directoryIndex }];
        }
        manifest.diagnostics.push(
          `Omitted missing MkDocs navigation page: ${entry.path}`,
        );
        return [];
      }
      return [
        {
          ...entry,
          ...(entry.children ? { children: checkNav(entry.children) } : {}),
        },
      ];
    });
  manifest.nav = checkNav(manifest.nav);
  techDocsSourceManifestSchema.parse(manifest);
  for (const diagnostic of manifest.diagnostics)
    options.logger.warn(diagnostic);
  await fs.outputJson(
    path.join(options.outputDir, TECHDOCS_SOURCE_MANIFEST),
    manifest,
  );
  if (!legacy)
    await fs.outputJson(
      path.join(options.outputDir, 'search/search_index.json'),
      { docs: search },
    );
  await fs.outputJson(
    path.join(options.outputDir, '_techdocs/source/search_index.json'),
    { docs: search },
  );
}

/** Runs the migration pipeline without exposing partial generation to a publisher. @internal */
export async function runTechDocsMigration(
  config: Config,
  options: GeneratorRunOptions,
  generateLegacy: () => Promise<void>,
): Promise<void> {
  const mode =
    config.getOptionalString('techdocs.migration.publishing') ?? 'legacy';
  if (!['legacy', 'dual', 'source'].includes(mode))
    throw new Error(`Invalid TechDocs publishing mode: ${mode}`);
  if (mode === 'legacy') {
    await generateLegacy();
    await fs.remove(path.join(options.outputDir, '_techdocs/source'));
    return;
  }
  const input = await fs.realpath(options.inputDir);
  const sourceConfig = await readConfig(input, [
    'techdocs.yaml',
    'techdocs.yml',
  ]);
  const oldConfig = sourceConfig
    ? undefined
    : await readConfig(input, ['mkdocs.yml', 'mkdocs.yaml']);
  const docsDir = sourceConfig?.docsDir ?? oldConfig?.docs_dir ?? 'docs';
  if (typeof docsDir !== 'string') throw new Error('docsDir must be a string');
  await validateOutput(input, options.outputDir, docsDir);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'techdocs-source-'));
  try {
    // Capture source before MkDocs preprocessing modifies the input configuration.
    await generateTechDocsSource(
      { ...options, outputDir: staging },
      mode === 'dual',
    );
    if (mode === 'dual') await generateLegacy();
    else await fs.emptyDir(options.outputDir);
    await fs.remove(path.join(options.outputDir, '_techdocs/source'));
    await fs.copy(staging, options.outputDir);
    const metadata = path.join(options.outputDir, 'techdocs_metadata.json');
    await createOrUpdateMetadata(metadata, options.logger);
    const value = await fs.readJson(metadata);
    await fs.writeJson(metadata, {
      ...value,
      ...(options.etag ? { etag: options.etag } : {}),
      site_name:
        value.site_name ?? options.siteOptions?.name ?? 'Documentation',
      source: true,
      publishingMode: mode,
    });
  } finally {
    await fs.remove(staging);
  }
}
