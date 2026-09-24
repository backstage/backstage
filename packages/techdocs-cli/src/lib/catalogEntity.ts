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

import { join } from 'node:path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { Entity } from '@backstage/catalog-model';
import { TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY } from '@backstage/plugin-techdocs-node';

const CATALOG_FILE_CANDIDATES = [
  'catalog-info.yaml',
  'catalog-info.yml',
  'service-info.yaml',
  'service-info.yml',
];

export async function readEntityFromCatalog(
  sourceDir: string,
): Promise<Entity | undefined> {
  for (const candidate of CATALOG_FILE_CANDIDATES) {
    const filePath = join(sourceDir, candidate);
    if (await fs.pathExists(filePath)) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        return yaml.load(content) as Entity;
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

export function getEngineFromEntity(
  entity: Entity | undefined,
): string | undefined {
  return entity?.metadata?.annotations?.[
    TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY
  ];
}
