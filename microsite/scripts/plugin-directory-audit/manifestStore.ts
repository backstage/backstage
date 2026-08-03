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
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { dump } from 'js-yaml';
import { loadPluginManifests } from '../../src/pluginDirectory/load';
import type { PluginManifest } from '../../src/pluginDirectory/manifest';

export interface ManifestFile {
  filename: string;
  path: string;
  manifest: PluginManifest;
  originalManifest: PluginManifest;
}

const manifestKeyOrder: readonly (keyof PluginManifest)[] = [
  'title',
  'author',
  'authorUrl',
  'category',
  'description',
  'documentation',
  'iconUrl',
  'npmPackageName',
  'addedDate',
  'order',
  'status',
  'staleSince',
  'capabilities',
  'setup',
  'snapshot',
];

function orderManifestKeys(
  manifest: PluginManifest,
): Record<string, PluginManifest[keyof PluginManifest]> {
  const ordered: Record<string, PluginManifest[keyof PluginManifest]> = {};
  for (const key of manifestKeyOrder) {
    const value = manifest[key];
    if (value !== undefined) {
      ordered[key] = value;
    }
  }
  return ordered;
}

export async function readManifestFiles(
  directory: string,
): Promise<ManifestFile[]> {
  const plugins = await loadPluginManifests(directory);
  return plugins.map(plugin => {
    const { slug, isNew: _isNew, ...manifest } = plugin;
    const filename = `${slug}.yaml`;
    return {
      filename,
      path: join(directory, filename),
      manifest,
      originalManifest: structuredClone(manifest),
    };
  });
}

export async function writeManifestFile(file: ManifestFile): Promise<void> {
  if (isDeepStrictEqual(file.originalManifest, file.manifest)) {
    return;
  }

  const yaml = dump(orderManifestKeys(file.manifest), {
    lineWidth: -1,
    quotingType: "'",
    forceQuotes: false,
    noRefs: true,
  });
  await writeFile(file.path, `---\n${yaml}`, 'utf8');
}
