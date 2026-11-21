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
import { type PluginManifest, pluginManifestSchema } from './manifest';
import { isValidManifestFilename, manifestSlug } from './slug';

export type LoadedPluginManifest = PluginManifest & { slug: string };

type ManifestProblem = { filename: string; messages: string[] };

/**
 * Loads and validates every manifest in the directory. Every file is checked
 * before anything is thrown, so a single run reports all of the problems.
 */
export async function loadPluginManifests(
  directory: string,
): Promise<LoadedPluginManifest[]> {
  const filenames = (await readdir(directory)).sort();
  const plugins: LoadedPluginManifest[] = [];
  const problems: ManifestProblem[] = [];

  for (const filename of filenames) {
    if (!isValidManifestFilename(filename)) {
      problems.push({
        filename,
        messages: [
          'Expected a lowercase kebab-case filename with a .yaml extension',
        ],
      });
      continue;
    }

    let manifestData: unknown;
    try {
      manifestData = load(await readFile(join(directory, filename), 'utf8'), {
        filename,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      problems.push({
        filename,
        messages: [`Failed to read or parse manifest: ${message}`],
      });
      continue;
    }

    const result = pluginManifestSchema.safeParse(manifestData);
    if (!result.success) {
      problems.push({
        filename,
        messages: result.error.issues.map(issue => {
          const path = issue.path.length > 0 ? issue.path.join('.') : '<root>';
          return `${path}: ${issue.message}`;
        }),
      });
      continue;
    }

    plugins.push({ ...result.data, slug: manifestSlug(filename) });
  }

  if (problems.length > 0) {
    const details = problems
      .map(
        ({ filename, messages }) =>
          `${filename}:\n${messages.map(message => `  ${message}`).join('\n')}`,
      )
      .join('\n');
    throw new Error(
      `${problems.length} plugin manifest(s) failed validation\n${details}`,
    );
  }

  return plugins;
}
