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
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { load } from 'js-yaml';
import { calcIsNewPlugin } from '../util/calcIsNewPlugin';
import {
  type PluginData,
  type PluginManifest,
  pluginManifestSchema,
} from './manifest';

const manifestFilenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.yaml$/;
const legacyManifestFilenames: Record<string, true> = {
  'digital.ai-deploy.yaml': true,
  'digital.ai-release.yaml': true,
  'sds_workspace.yaml': true,
};

export async function loadPluginManifests(
  directory: string,
): Promise<PluginData[]> {
  const filenames = (await readdir(directory)).sort();
  const plugins: PluginData[] = [];

  for (const filename of filenames) {
    if (
      !manifestFilenamePattern.test(filename) &&
      legacyManifestFilenames[filename] !== true
    ) {
      throw new Error(
        `${filename}: Expected a lowercase kebab-case filename with a .yaml extension`,
      );
    }

    const filePath = join(directory, filename);
    let manifestData: unknown;
    try {
      manifestData = load(await readFile(filePath, 'utf8'), { filename });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${filename}: Failed to read or parse manifest: ${message}`);
    }

    const result = pluginManifestSchema.safeParse(manifestData);
    if (!result.success) {
      const issues = result.error.issues
        .map(issue => {
          const path = issue.path.length > 0 ? issue.path.join('.') : '<root>';
          return `${path}: ${issue.message}`;
        })
        .join('\n');
      throw new Error(`${filename}: YAML data validation failed\n${issues}`);
    }

    const manifest: PluginManifest = result.data;
    plugins.push(
      calcIsNewPlugin({
        ...manifest,
        slug: filename.slice(0, -'.yaml'.length),
        isNew: false,
      }),
    );
  }

  return plugins;
}
