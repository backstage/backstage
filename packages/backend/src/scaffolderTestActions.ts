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

import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

/**
 * Action that waits for a specified number of seconds with visible countdown.
 * Useful for testing recovery - kill the server during this action.
 */
const createDelayAction = () => {
  return createTemplateAction({
    id: 'test:delay',
    description:
      'Waits for a specified number of seconds with visible countdown',
    schema: {
      input: {
        seconds: z =>
          z.number({
            description: 'Number of seconds to wait',
          }),
        message: z =>
          z
            .string({
              description: 'Optional message to log',
            })
            .optional(),
      },
      output: {
        waited: z => z.number({ description: 'Seconds waited' }),
      },
    },
    async handler(ctx) {
      const seconds = ctx.input.seconds ?? 30;
      const message = ctx.input.message;

      ctx.logger.info(
        message ??
          `Waiting for ${seconds} seconds... (kill the server now to test recovery)`,
      );

      // Log countdown every second for visibility
      for (let i = seconds; i > 0; i--) {
        ctx.logger.info(`  ${i} seconds remaining...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      ctx.logger.info('Delay complete!');
      ctx.output('waited', seconds);
    },
  });
};

/**
 * Action that produces output for testing step state recovery.
 */
const createProduceOutputAction = () => {
  return createTemplateAction({
    id: 'test:produce-output',
    description: 'Produces output that should survive recovery',
    schema: {
      input: {
        name: z =>
          z.string({
            description: 'Output name for logging',
          }),
        value: z =>
          z.string({
            description: 'Output value to produce',
          }),
      },
      output: {
        result: z => z.string({ description: 'The produced result' }),
      },
    },
    async handler(ctx) {
      const name = ctx.input.name;
      const value = ctx.input.value;
      ctx.logger.info(`Producing output: ${name} = ${value}`);
      ctx.output('result', value);
    },
  });
};

/**
 * Action that consumes output from a previous step.
 */
const createConsumeOutputAction = () => {
  return createTemplateAction({
    id: 'test:consume-output',
    description: 'Consumes and verifies output from a previous step',
    schema: {
      input: {
        expectedValue: z =>
          z.string({
            description: 'The value expected from the previous step',
          }),
      },
    },
    async handler(ctx) {
      const expectedValue = ctx.input.expectedValue;
      ctx.logger.info(`Received expected value: ${expectedValue}`);
      ctx.logger.info(
        'If you see this after recovery, step output restoration is working!',
      );
    },
  });
};

/**
 * Backend module that registers test actions for recovery testing.
 */
export default createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'test-actions',
  register(reg) {
    reg.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        logger: coreServices.logger,
      },
      async init({ scaffolder, logger }) {
        logger.info('Registering scaffolder test actions for recovery testing');
        scaffolder.addActions(
          createDelayAction(),
          createProduceOutputAction(),
          createConsumeOutputAction(),
        );
      },
    });
  },
});
