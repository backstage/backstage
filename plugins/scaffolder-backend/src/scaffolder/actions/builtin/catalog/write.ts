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
import { createTemplateAction } from '../../createTemplateAction';
import * as yaml from 'yaml';
import { Entity } from '@backstage/catalog-model';
import { resolveSafeChildPath } from '@backstage/backend-common';

const id = 'catalog:write';

const examples = [
  {
    description: 'Write a catalog yaml file',
    example: yaml.stringify({
      steps: [
        {
          action: id,
          id: 'create-catalog-info-file',
          name: 'Create catalog file',
          input: {
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: 'test',
                annotations: {},
              },
              spec: {
                type: 'service',
                lifecycle: 'production',
                owner: 'default/owner',
              },
            },
          },
        },
      ],
    }),
  },
];

/**
 * Writes a catalog descriptor file containing the provided entity to a path in the workspace.
 * @public
 */
export function createCatalogWriteAction() {
  return createTemplateAction<{ filePath?: string; entity: Entity }>({
    id,
    description: 'Writes the catalog-info.yaml for your template',
    examples,
    schema: {
      input: {
        type: 'object',
        properties: {
          filePath: {
            title: 'Catalog file path',
            description: 'Defaults to catalog-info.yaml',
            type: 'string',
          },
          entity: {
            title: 'Entity info to write catalog-info.yaml',
            description:
              'You can provide the same values used in the Entity schema.',
            type: 'object',
          },
        },
      },
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logStream.write(`Writing catalog-info.yaml`);
      const { filePath, entity } = ctx.input;
      const path = filePath ?? 'catalog-info.yaml';

      await fs.writeFile(
        resolveSafeChildPath(ctx.workspacePath, path),
        yaml.stringify(entity),
      );
    },
  });
}
