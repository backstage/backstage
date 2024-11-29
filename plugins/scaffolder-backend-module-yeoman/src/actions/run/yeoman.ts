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

import { JsonObject } from '@backstage/types';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { yeomanRun } from './yeomanRun';
import { examples } from './yeoman.examples';

/**
 * Creates a `run:yeoman` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://yeoman.io/} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @public
 */
export function createRunYeomanAction() {
  return createTemplateAction<{
    namespace: string;
    args?: string[];
    options?: JsonObject;
  }>({
    id: 'run:yeoman',
    description: 'Runs Yeoman on an installed Yeoman generator',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['namespace'],
        properties: {
          namespace: {
            title: 'Generator Namespace',
            description: 'Yeoman generator namespace, e.g: node:app',
            type: 'string',
          },
          args: {
            title: 'Generator Arguments',
            description: 'Arguments to pass on to Yeoman for templating',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          options: {
            title: 'Generator Options',
            description: 'Options to pass on to Yeoman for templating',
            type: 'object',
          },
        },
      },
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info(
        `Templating using Yeoman generator: ${ctx.input.namespace}`,
      );
      await yeomanRun(
        ctx.workspacePath,
        ctx.input.namespace,
        ctx.input.args,
        ctx.input.options,
      );
    },
  });
}
