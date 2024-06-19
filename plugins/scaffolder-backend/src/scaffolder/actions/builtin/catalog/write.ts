/*
 * Copyright 2021 The Backstage Authors
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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as yaml from 'yaml';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { z } from 'zod';
import { examples } from './write.examples';

const id = 'catalog:write';

/**
 * Writes a catalog descriptor file containing the provided entity to a path in the workspace.
 * @public
 */

export function createCatalogWriteAction() {
  return createTemplateAction({
    id,
    description: 'Writes the catalog-info.yaml for your template',
    schema: {
      input: z.object({
        filePath: z
          .string()
          .optional()
          .describe('Defaults to catalog-info.yaml'),
        // TODO: this should reference an zod entity validator if it existed.
        entity: z
          .record(z.any())
          .describe(
            'You can provide the same values used in the Entity schema.',
          ),
      }),
    },
    examples,
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info(`Writing catalog-info.yaml`);
      const { filePath, entity } = ctx.input;
      const entityRef = ctx.templateInfo?.entityRef;
      const path = filePath ?? 'catalog-info.yaml';

      await fs.writeFile(
        resolveSafeChildPath(ctx.workspacePath, path),
        yaml.stringify({
          ...entity,
          metadata: {
            ...entity.metadata,
            ...(entityRef
              ? {
                  annotations: {
                    ...entity.metadata.annotations,
                    'backstage.io/source-template': entityRef,
                  },
                }
              : undefined),
          },
        }),
      );
    },
  });
}
