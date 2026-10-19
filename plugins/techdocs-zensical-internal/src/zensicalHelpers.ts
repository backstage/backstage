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
import yaml from 'js-yaml';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { LoggerService } from '@backstage/backend-plugin-api';
import { MKDOCS_SCHEMA } from '@backstage/plugin-techdocs-node/alpha';

type NamedOptions = Record<string, unknown> | undefined;

const TECHDOCS_ZENSICAL_CORE_EXTENSIONS = [
  'admonition',
  'toc',
  'pymdownx.details',
  'pymdownx.tabbed',
  'pymdownx.caret',
  'pymdownx.critic',
  'pymdownx.emoji',
  'pymdownx.inlinehilite',
  'pymdownx.magiclink',
  'pymdownx.mark',
  'pymdownx.smartsymbols',
  'pymdownx.snippets',
  'pymdownx.highlight',
  'pymdownx.extra',
  'pymdownx.tasklist',
  'pymdownx.tilde',
];

const TECHDOCS_ZENSICAL_EXTRA_EXTENSIONS = [
  'plantuml_markdown',
  'markdown_inline_graphviz',
  'mdx_truly_sane_lists',
];

/**
 * Options for the TechDocs extensions, set inline on each markdown_extensions
 * entry. Zensical rebuilds mdx_configs from markdown_extensions, so options
 * set through mdx_configs are ignored.
 */
const TECHDOCS_ZENSICAL_EXTENSION_OPTIONS: Record<string, NamedOptions> = {
  'pymdownx.snippets': {
    restrict_base_path: true,
  },
  'pymdownx.tabbed': {
    alternate_style: true,
  },
  toc: {
    permalink: true,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Reads an mkdocs.yml list of named entries (markdown_extensions or plugins)
 * into name/options pairs. Accepts every form MkDocs accepts: a list of
 * names, a list mixing names and single-key mappings, or a mapping.
 */
function readNamedEntries(value: unknown): Map<string, NamedOptions> {
  const entries = new Map<string, NamedOptions>();
  const add = (name: string, options: unknown) => {
    entries.set(name, isRecord(options) ? options : undefined);
  };
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string') {
        add(item, undefined);
      } else if (isRecord(item)) {
        for (const [name, options] of Object.entries(item)) {
          add(name, options);
        }
      }
    }
  } else if (isRecord(value)) {
    for (const [name, options] of Object.entries(value)) {
      add(name, options);
    }
  }
  return entries;
}

/** Writes name/options pairs back as an mkdocs.yml list. */
function writeNamedEntries(
  entries: Map<string, NamedOptions>,
): Array<string | Record<string, unknown>> {
  return [...entries].map(([name, options]) =>
    options ? { [name]: options } : name,
  );
}

/**
 * Patches mkdocs.yml for Zensical builds: sets classic theme, injects markdown
 * extensions, sets site_dir, and removes the techdocs-core plugin.
 *
 * Writes to a uniquely named temporary file so the original config is not modified.
 *
 * @param mkdocsYmlPath - Path to the mkdocs.yml to patch.
 * @param siteDir - Output directory, relative to the mkdocs.yml directory.
 * @param logger - Logger for progress messages.
 * @returns Path to the patched temporary config.
 *
 * @public
 */
export async function patchZensicalConfig(
  mkdocsYmlPath: string,
  siteDir: string,
  logger: Pick<LoggerService, 'info'>,
): Promise<string> {
  const content = await fs.readFile(mkdocsYmlPath, 'utf8');
  const config = yaml.load(content, { schema: MKDOCS_SCHEMA }) as Record<
    string,
    unknown
  >;

  const theme = isRecord(config.theme) ? config.theme : {};
  const features = Array.isArray(theme.features) ? theme.features : [];
  config.theme = {
    ...theme,
    name: 'material',
    custom_dir: undefined,
    features: [...new Set([...features, 'navigation.footer'])],
    font: false,
  };
  // Remove palette entirely — the TechDocs frontend handles dark/light
  // theming via CSS variable overrides in the shadow DOM. Leaving palette
  // in causes Zensical to emit data-md-color-scheme="default" on <body>
  // which locks the output to light mode.
  delete (config.theme as Record<string, unknown>).palette;

  config.site_dir = siteDir;

  const extensions = readNamedEntries(config.markdown_extensions);
  for (const name of [
    ...TECHDOCS_ZENSICAL_CORE_EXTENSIONS,
    ...TECHDOCS_ZENSICAL_EXTRA_EXTENSIONS,
  ]) {
    const defaults = TECHDOCS_ZENSICAL_EXTENSION_OPTIONS[name];
    const existing = extensions.get(name);
    extensions.set(
      name,
      defaults || existing ? { ...defaults, ...existing } : undefined,
    );
  }
  config.markdown_extensions = writeNamedEntries(extensions);

  if (config.plugins !== undefined) {
    const plugins = readNamedEntries(config.plugins);
    plugins.delete('techdocs-core');
    config.plugins = writeNamedEntries(plugins);
  }

  const zensicalConfigPath = path.join(
    path.dirname(mkdocsYmlPath),
    `.mkdocs.zensical-${randomUUID()}.yml`,
  );
  await fs.writeFile(
    zensicalConfigPath,
    yaml.dump(config, { schema: MKDOCS_SCHEMA }),
  );

  logger.info(`Wrote Zensical config to ${zensicalConfigPath}`);
  return zensicalConfigPath;
}

/**
 * Removes a temporary config written by {@link patchZensicalConfig}.
 *
 * @public
 */
export async function cleanupZensicalConfig(
  zensicalConfigPath: string,
): Promise<void> {
  try {
    await fs.remove(zensicalConfigPath);
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Normalizes Zensical's search output to the MkDocs format expected by the
 * TechDocs search collator.
 *
 * Zensical: search.json with { config, items: [...] } (HTML in text)
 * MkDocs:   search/search_index.json with { config, docs: [...] } (plain text)
 */
export async function normalizeSearchIndex(
  outputDir: string,
  logger: LoggerService,
): Promise<void> {
  const zensicalSearchPath = path.join(outputDir, 'search.json');
  const mkdocsSearchDir = path.join(outputDir, 'search');
  const mkdocsSearchPath = path.join(mkdocsSearchDir, 'search_index.json');

  if (!(await fs.pathExists(zensicalSearchPath))) {
    logger.warn('Zensical search.json not found; search indexing may not work');
    return;
  }

  try {
    const raw = await fs.readJson(zensicalSearchPath);
    const items = raw.items ?? raw.docs ?? [];

    const docs = items.map(
      (item: { title?: string; text?: string; location?: string }) => ({
        title: item.title ?? '',
        text: stripHtmlTags(item.text ?? ''),
        location: item.location ?? '',
      }),
    );

    await fs.ensureDir(mkdocsSearchDir);
    await fs.writeJson(mkdocsSearchPath, {
      config: raw.config ?? {},
      docs,
    });

    logger.info(
      `Normalized search index: ${docs.length} entries written to search/search_index.json`,
    );
  } catch (error) {
    logger.warn(`Failed to normalize search index: ${error}`);
  }
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
