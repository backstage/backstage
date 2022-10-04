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

import { createTemplateAction } from '../../createTemplateAction';

export function waitWorkflow() {
  type InputParameters = {
    name: string;
    delayMilliseconds: number;
    maxCalls: number;
  };

  return createTemplateAction<InputParameters>({
    id: 'stress:waitWorkflow',
    schema: {
      input: {
        required: ['name'],
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description:
              'The Ticket Number used to check the status of the Workflow.',
          },
          delayMilliseconds: {
            type: 'number',
            title: 'Delay',
            description:
              'The amount of milliseconds to delay before the next checkStatus call.',
          },
          maxCalls: {
            type: 'number',
            title: 'Max Calls',
            description:
              'The amount of maximum calls allowed to check a status before stopping.',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          status: {
            title: 'Status',
            type: 'object',
            properties: {
              message: {
                title: 'Status Message',
                type: 'string',
              },
            },
          },
          results: {
            title: 'Results from Ticket execution',
            type: 'object',
          },
        },
      },
    },
    async handler(ctx) {
      const { name, maxCalls, delayMilliseconds } = getParameters(ctx.input);

      ctx.logger.info(`Running the long running workflow: ${name}...`);

      let i = 1;

      for (;;) {
        ctx.logger.info(`waiting... [${i}/${maxCalls}]`);

        if (i++ >= maxCalls) {
          break;
        }

        await new Promise(res => setTimeout(res, delayMilliseconds));
      }

      ctx.output('status.message', 'Workflow completed');
    },
  });

  function getParameters(input: InputParameters) {
    const { name, delayMilliseconds, maxCalls } = input;
    return {
      name,
      maxCalls: maxCalls ?? 30,
      delayMilliseconds: delayMilliseconds ?? 2000,
    };
  }
}
