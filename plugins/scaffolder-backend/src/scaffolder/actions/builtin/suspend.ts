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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { taskSuspendOptionsSchema } from '../../tasks/parseTaskSuspendOptions';

/** Creates the experimental action for waiting on manual or event triggers. @internal */
export function createSuspendAction() {
  return createTemplateAction({
    id: 'workflow:suspend',
    description:
      'Release the worker while waiting for a manual decision or an event.',
    schema: {
      input: () => taskSuspendOptionsSchema,
      output: {
        triggerId: z => z.string(),
        payload: z => z.record(z.any()),
      },
    },
    async handler(ctx) {
      const result = await ctx.suspend(ctx.input);
      if (result.timedOut) throw new Error('Suspension timed out');
      ctx.output('triggerId', result.triggerId!);
      ctx.output('payload', result.payload);
    },
  });
}
