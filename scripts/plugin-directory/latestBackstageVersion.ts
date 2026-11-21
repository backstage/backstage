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
import { readFile } from 'node:fs/promises';
import { load } from 'js-yaml';
import { z } from 'zod';

export const latestBackstageVersionSchema = z.strictObject({
  version: z.string().min(1),
  checkedAt: z.string().datetime({ offset: true }),
  sourceUrl: z.string().url(),
});

export type LatestBackstageVersion = z.infer<
  typeof latestBackstageVersionSchema
>;

/**
 * Reads the latest known stable Backstage release version, written
 * periodically by the plugin directory audit script. Returns undefined if
 * the file hasn't been generated yet, so builds don't depend on it existing.
 */
export async function loadLatestBackstageVersion(
  filePath: string,
): Promise<LatestBackstageVersion | undefined> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  return latestBackstageVersionSchema.parse(load(raw, { filename: filePath }));
}
