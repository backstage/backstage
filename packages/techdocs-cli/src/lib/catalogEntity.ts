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

const CATALOG_FILE_CANDIDATES = ['catalog-info.yaml', 'catalog-info.yml'];

type CatalogLogger = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
};

/**
 * Reads the entity from the first catalog file found in sourceDir. Catalog
 * files may hold several YAML documents; the entity carrying TechDocs
 * annotations is preferred, falling back to the first entity in the file.
 */
export async function readEntityFromCatalog(
  sourceDir: string,
  logger?: CatalogLogger,
): Promise<Entity | undefined> {
  for (const candidate of CATALOG_FILE_CANDIDATES) {
    const filePath = join(sourceDir, candidate);
    if (await fs.pathExists(filePath)) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const entities = (yaml.loadAll(content) as Entity[]).filter(
          doc => doc && typeof doc === 'object' && doc.metadata,
        );
        const annotations = (e: Entity) => e.metadata.annotations ?? {};
        return (
          entities.find(
            e => TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY in annotations(e),
          ) ??
          entities.find(e => 'backstage.io/techdocs-ref' in annotations(e)) ??
          entities[0]
        );
      } catch (error) {
        logger?.warn(
          `Failed to parse ${filePath}, ignoring catalog annotations: ${error}`,
        );
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

/**
 * Resolves the documentation engine to use.
 * Priority: explicit --engine flag > catalog annotation > 'mkdocs' default.
 */
export async function resolveEngine(
  sourceDir: string,
  explicitEngine: string | undefined,
  logger: CatalogLogger,
): Promise<{ engine: string; entity: Entity | undefined }> {
  const catalogEntity = await readEntityFromCatalog(sourceDir, logger);
  const catalogEngine = getEngineFromEntity(catalogEntity);

  const engine = explicitEngine ?? catalogEngine ?? 'mkdocs';

  if (catalogEngine && !explicitEngine) {
    logger.info(
      `Detected ${TECHDOCS_ENGINE_CATALOG_ANNOTATION_KEY}: '${catalogEngine}' from catalog entity`,
    );
  }

  return { engine, entity: catalogEntity };
}
