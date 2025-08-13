/*
 * Copyright 2025 The Backstage Authors
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
import { createTemplateAction } from './createTemplateAction';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { mockServices } from '@backstage/backend-test-utils';
import { z } from 'zod';

describe('createTemplateAction', () => {
  it('should allow creating with new first class zod support', () => {
    const action = createTemplateAction({
      id: 'test',
      schema: {
        input: {
          repoUrl: d => d.string(),
        },
        output: {
          test: d => d.string(),
        },
      },
      handler: async ctx => {
        // @ts-expect-error - repoUrl is string
        const a: number = ctx.input.repoUrl;
        const b: string = ctx.input.repoUrl;

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        [a, b];

        ctx.output('test', 'value');

        // @ts-expect-error - not valid output type
        ctx.output('test', 4);

        // @ts-expect-error - not valid output name
        ctx.output('test2', 'value');
      },
    });

    expect(action).toBeDefined();
  });

  it('should allow creating with a function for input and output schema for more complex types', () => {
    const action = createTemplateAction({
      id: 'test',
      schema: {
        input: (zImpl: typeof z) =>
          zImpl.union([
            zImpl.object({
              repoUrl: zImpl.string(),
            }),
            zImpl.object({
              numberThing: z.number(),
            }),
          ]),
        output: (zImpl: typeof z) =>
          zImpl.object({
            test: zImpl.string(),
          }),
      },
      handler: async ctx => {
        ctx.output('test', 'value');

        // @ts-expect-error - not valid output type
        ctx.output('test', 4);

        // @ts-expect-error - not valid output name
        ctx.output('test2', 'value');

        if ('repoUrl' in ctx.input) {
          // @ts-expect-error - not valid input type
          const a: number = ctx.input.repoUrl;

          const b: string = ctx.input.repoUrl;

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          [a, b];
        }

        if ('numberThing' in ctx.input) {
          const a: number = ctx.input.numberThing;

          // @ts-expect-error - not valid input type
          const b: string = ctx.input.numberThing;

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          [a, b];
        }
      },
    });

    expect(action).toBeDefined();
  });

  it('should allow creating with a function for input and output schema for empty objects of schemes with default fields', async () => {
    const mockContext = createMockActionContext({
      logger: mockServices.logger.mock(),
    });
    const action = createTemplateAction<
      {
        x?: (z1: typeof z) => z.ZodType;
        y?: (z1: typeof z) => z.ZodType;
        t: (z1: typeof z) => z.ZodType;
      },
      {
        x: (z1: typeof z) => z.ZodType;
        y: (z1: typeof z) => z.ZodType;
        t: (z1: typeof z) => z.ZodType;
      }
    >({
      id: 'something:random',
      description: 'Just for demo',
      schema: {
        input: {
          x: z1 => z1.number().default(0),
          y: z1 => z1.string().default('Hello'),
          t: z1 => z1.string().transform(val => val.length),
        },
      },
      async handler(ctx) {
        ctx.logger.info(`The value of x is ${ctx.input?.x}`);
        ctx.logger.info(`The value of y is ${ctx.input?.y}`);
        ctx.logger.info(`The value of t is ${ctx.input?.t}`);
      },
    });
    await action.handler({
      ...mockContext,
      input: {
        t: 'Backstage',
      },
    });
    expect(mockContext.logger.info).toHaveBeenCalledWith('The value of x is 0');
    expect(mockContext.logger.info).toHaveBeenCalledWith(
      'The value of y is Hello',
    );
    expect(mockContext.logger.info).toHaveBeenCalledWith('The value of t is 9');
  });
});
